import { db } from "@/server/db";
import {
  friendRequests,
  friendships,
  messages,
  users,
} from "@/server/db/schema";
import { procedure, router, userProcedure } from "../trpc";
import { and, asc, eq, inArray, like, notInArray, or, sql } from "drizzle-orm";
import { LibsqlError } from "@libsql/client";
import {
  passwordChangeSchema,
  updateDisplayNameSchema,
  updateUsernameSchema,
} from "@/server/utils/zodSchemas";
import { getHashedPassword, isPasswordMatch } from "@/server/utils/bcrypt";
import { z } from "zod";
import conversations from "@/server/db/schema/conversations";
import conversationParticipants from "@/server/db/schema/conversationParticipants";
import { arraysHaveSameElements } from "@/lib/helpers";

export const userRouter = router({
  all: procedure.query(async () => {
    return await db.select().from(users);
  }),

  getUser: userProcedure().query(async ({ ctx: { user } }) => {
    return await db.query.users.findFirst({
      columns: {
        id: true,
        name: true,
        username: true,
        displayName: true,
        email: true,
        dateOfBirth: true,
        createdAt: true,
        updatedAt: true,
        profileImageUrl: true,
      },
      where: eq(users.id, user.id),
    });
  }),

  updateDisplayName: userProcedure()
    .input(updateDisplayNameSchema)
    .mutation(async ({ input: { name }, ctx: { user } }) => {
      try {
        await db
          .update(users)
          .set({ displayName: name })
          .where(eq(users.id, user.id));

        return { message: "Display name was successfully changed." };
      } catch (error) {
        if (error instanceof Error) {
          return { message: error.message };
        }
      }
    }),

  updateUsername: userProcedure()
    .input(updateUsernameSchema)
    .mutation(async ({ input: { name }, ctx: { user } }) => {
      try {
        await db
          .update(users)
          .set({ username: name })
          .where(eq(users.id, user.id));

        return { message: "Username was successfully changed." };
      } catch (error) {
        if (error instanceof LibsqlError) {
          throw new Error(`Username '${name}' already exists`);
        }
      }
    }),

  changePassword: userProcedure()
    .input(passwordChangeSchema)
    .mutation(async ({ input, ctx: { user } }) => {
      const { currentPassword, newPassword, confirmNewPassword } = input;
      if (newPassword !== confirmNewPassword) {
        throw new Error("Passwords do not match");
      }

      if (newPassword === currentPassword) {
        throw new Error("Passwords must be different");
      }

      const dbUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, user.id),
        columns: {
          id: true,
          name: true,
          passwordHash: true,
        },
      });

      if (!dbUser) {
        throw new Error("Unable to find user");
      }

      const match = await isPasswordMatch(currentPassword, dbUser.passwordHash);

      if (!match) {
        throw new Error("Incorrect current password");
      }
      const passwordHash = await getHashedPassword(newPassword);
      await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
      return { message: "Password successfully changed" };
    }),

  sendFriendRequest: userProcedure()
    .input(z.object({ name: z.string() }))
    .mutation(
      async ({
        input: { name: username },
        ctx: {
          user: { id: senderId },
        },
      }) => {
        const receiver = await db.query.users.findFirst({
          where: eq(users.username, username),
          columns: { id: true },
        });

        if (!receiver) {
          throw new Error("Username does not exist");
        }

        const receiverId = receiver.id;

        if (senderId === receiverId) {
          throw new Error("You cannot send a friend request to yourself");
        }

        const existingFriendship = await db.query.friendships.findFirst({
          where: or(
            and(
              eq(friendships.userId1, senderId),
              eq(friendships.userId2, receiverId)
            ),
            and(
              eq(friendships.userId1, receiverId),
              eq(friendships.userId2, senderId)
            )
          ),
        });

        if (existingFriendship) {
          throw new Error("You're already friends with this user");
        }

        const existingRequest = await db.query.friendRequests.findFirst({
          where: and(
            eq(friendRequests.status, "pending"),
            or(
              and(
                eq(friendRequests.senderId, senderId),
                eq(friendRequests.receiverId, receiverId)
              ),
              and(
                eq(friendRequests.senderId, receiverId),
                eq(friendRequests.receiverId, senderId)
              )
            )
          ),
        });

        if (existingRequest) {
          throw new Error("You've already sent a friend request to this user");
        }

        await db.insert(friendRequests).values({ receiverId, senderId });

        return { message: `Friend request has been sent to '${username}'` };
      }
    ),

  friendRequests: userProcedure()
    .input(z.object({ search: z.string() }).optional())
    .query(async ({ input, ctx: { user } }) => {
      const requests = await db
        .select({
          requestId: friendRequests.id,
          senderId: friendRequests.senderId,
          username: users.username,
        })
        .from(friendRequests)
        .leftJoin(users, eq(users.id, friendRequests.senderId))
        .where(
          and(
            eq(friendRequests.receiverId, user.id),
            eq(friendRequests.status, "pending"),
            !!input?.search
              ? like(users.username, `%${input?.search}%`)
              : undefined
          )
        );

      const requestsWithUser = await Promise.all(
        requests.map(async ({ senderId, requestId }) => {
          const sender = await db.query.users.findFirst({
            where: eq(users.id, senderId),
            columns: {
              id: true,
              displayName: true,
              username: true,
              profileImageUrl: true,
            },
          });

          return { requestId, sender };
        })
      );

      return { requestsWithUser, count: requests.length };
    }),

  acceptOrRejectFriendRequest: userProcedure()
    .input(
      z.object({
        requestId: z.string().cuid2(),
        type: z.enum(["accept", "reject"]),
      })
    )
    .mutation(async ({ input: { requestId, type }, ctx: { user } }) => {
      const friendRequest = await db.query.friendRequests.findFirst({
        where: and(
          eq(friendRequests.id, requestId),
          eq(friendRequests.receiverId, user.id),
          eq(friendRequests.status, "pending")
        ),
      });

      if (!friendRequest) {
        throw new Error(
          "Friend request not found or has already been processed"
        );
      }

      if (type === "reject") {
        await db
          .update(friendRequests)
          .set({ status: "rejected", updatedAt: new Date() })
          .where(eq(friendRequests.id, requestId));

        return { message: "Friend request has been rejected" };
      } else if (type === "accept") {
        await db.transaction(async (tx) => {
          await tx
            .update(friendRequests)
            .set({ status: "accepted", updatedAt: new Date() })
            .where(eq(friendRequests.id, requestId));

          //create friendship record
          await tx.insert(friendships).values({
            userId1: friendRequest.senderId,
            userId2: friendRequest.receiverId,
          });

          //delete friend request
          await tx
            .delete(friendRequests)
            .where(eq(friendRequests.id, requestId));
        });
        return { message: "Friend request has been accepted" };
      }
    }),

  allFriends: userProcedure()
    .input(
      z
        .object({
          search: z.string(),
          conversationId: z.string().cuid2().nullish(),
        })
        .optional()
    )
    .query(async ({ input, ctx: { user } }) => {
      const friends = await db
        .select({
          friendId: sql<string>`
            CASE 
              WHEN ${friendships.userId1} = ${user.id} THEN ${friendships.userId2}
              ELSE ${friendships.userId1}
            END
          `,
          username: users.username,
        })
        .from(friendships)
        .leftJoin(
          users,
          sql<string>`
          users.id = CASE 
            WHEN ${friendships.userId1} = ${user.id} THEN ${friendships.userId2}
            ELSE ${friendships.userId1}
          END
        `
        )
        .where(
          and(
            !!input?.search
              ? like(users.username, `%${input?.search}%`)
              : undefined,
            or(
              eq(friendships.userId1, user.id),
              eq(friendships.userId2, user.id)
            ),
            input?.conversationId
              ? notInArray(
                  sql<string>`
                    CASE 
                      WHEN ${friendships.userId1} = ${user.id} THEN ${friendships.userId2}
                      ELSE ${friendships.userId1}
                    END
                  `,
                  db
                    .select({ userId: conversationParticipants.userId })
                    .from(conversationParticipants)
                    .where(
                      eq(
                        conversationParticipants.conversationId,
                        input.conversationId
                      )
                    )
                )
              : undefined
          )
        );

      const friendsWithUser = await Promise.all(
        friends.map(async ({ friendId }) => {
          const friend = await db.query.users.findFirst({
            where: eq(users.id, friendId),
            columns: {
              id: true,
              displayName: true,
              username: true,
              profileImageUrl: true,
            },
          });

          return friend;
        })
      );

      return { friendsWithUser, count: friends.length };
    }),

  removeFriend: userProcedure()
    .input(z.object({ friendId: z.string().cuid2() }))
    .mutation(async ({ input: { friendId }, ctx: { user } }) => {
      const friend = await db.query.users.findFirst({
        where: eq(users.id, friendId),
        columns: { id: true, username: true },
      });

      if (!friend) {
        throw new Error("User does not exists");
      }

      await db
        .delete(friendships)
        .where(
          or(
            and(
              eq(friendships.userId1, user.id),
              eq(friendships.userId2, friendId)
            ),
            and(
              eq(friendships.userId2, user.id),
              eq(friendships.userId1, friendId)
            )
          )
        );

      return { message: `'${friend.username}' has been removed as a friend` };
    }),

  createConversation: userProcedure()
    .input(z.object({ userIds: z.array(z.string().cuid2()) }))
    .mutation(async ({ input: { userIds }, ctx: { user } }) => {
      const participants = await db.query.users.findMany({
        where: inArray(users.id, userIds),
        columns: {
          id: true,
          username: true,
          displayName: true,
        },
      });

      const allParticipants = [...participants, user];

      //check for existing conversation. Existing conversation is one
      //in which all the participants in conversation equals allParticipants
      const existingConversations = await db
        .select({ id: conversations.id })
        .from(conversations)
        .innerJoin(
          conversationParticipants,
          eq(conversations.id, conversationParticipants.conversationId)
        )
        .where(eq(conversationParticipants.userId, user.id));

      for (const { id: conversationId } of existingConversations) {
        const participantsInConversation: { id: string }[] = [];

        const participants = await db.query.conversationParticipants.findMany({
          where: eq(conversationParticipants.conversationId, conversationId),
        });

        for (const participant of participants) {
          if (participant.userId) {
            participantsInConversation.push({ id: participant.userId });
          }
        }

        if (
          arraysHaveSameElements(participantsInConversation, allParticipants)
        ) {
          return { conversationId };
        }
      }

      let conversation: { id: string } = { id: "" };
      await db.transaction(async (tx) => {
        [conversation] = await tx
          .insert(conversations)
          .values({})
          .returning({ id: conversations.id });

        for (const participant of allParticipants) {
          await tx.insert(conversationParticipants).values({
            conversationId: conversation.id,
            userId: participant.id,
          });
        }
      });

      return {
        conversationId: conversation.id,
        message:
          allParticipants.length > 2
            ? "Group chat was successfully created"
            : "Direct message was successfully created",
      };
    }),

  updateConversation: userProcedure()
    .input(
      z.object({
        userIds: z.array(z.string().cuid2()),
        conversationId: z.string().cuid2().nullish(),
      })
    )
    .mutation(async ({ input: { userIds, conversationId } }) => {
      const participants = await db.query.users.findMany({
        where: inArray(users.id, userIds),
        columns: {
          id: true,
          username: true,
          displayName: true,
        },
      });

      for (const participant of participants) {
        await db.insert(conversationParticipants).values({
          conversationId,
          userId: participant.id,
        });
      }

      return { message: "Users successfully added to chat" };
    }),

  conversations: userProcedure().query(async ({ ctx: { user } }) => {
    return await db.query.conversations.findMany({
      columns: { id: true, title: true },
      with: {
        participants: {
          columns: { joinedAt: true },
          with: {
            user: {
              columns: {
                id: true,
                username: true,
                displayName: true,
                profileImageUrl: true,
              },
            },
          },
          orderBy: asc(eq(conversationParticipants.userId, user.id)),
        },
      },
      where: inArray(
        conversations.id,
        db
          .select({ id: conversationParticipants.conversationId })
          .from(conversationParticipants)
          .where(eq(conversationParticipants.userId, user.id))
      ),
    });
  }),

  createMessage: userProcedure()
    .input(
      z.object({ content: z.string(), conversationId: z.string().cuid2() })
    )
    .mutation(async ({ ctx: { user }, input: { content, conversationId } }) => {
      await db
        .insert(messages)
        .values({ content, conversationId, createdByUserId: user.id });
    }),

  messages: userProcedure()
    .input(z.object({ conversationId: z.string().cuid2() }))
    .query(async ({ input: { conversationId } }) => {
      return await db.query.messages.findMany({
        where: eq(messages.conversationId, conversationId),
        with: {
          createdByUser: {
            columns: {
              id: true,
              name: true,
              profileImageUrl: true,
              username: true,
              displayName: true,
            },
          },
        },
      });
    }),
});
