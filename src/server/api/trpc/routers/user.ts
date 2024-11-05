import { db } from "@/server/db";
import { friendRequests, friendships, users } from "@/server/db/schema";
import { procedure, router, userProcedure } from "../trpc";
import { and, eq, or } from "drizzle-orm";
import { LibsqlError } from "@libsql/client";
import {
  passwordChangeSchema,
  updateDisplayNameSchema,
  updateUsernameSchema,
} from "@/server/utils/zodSchemas";
import { getHashedPassword, isPasswordMatch } from "@/server/utils/bcrypt";
import { z } from "zod";

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

  friendRequests: userProcedure().query(async ({ ctx: { user } }) => {
    const requests = await db.query.friendRequests.findMany({
      where: and(
        eq(friendRequests.receiverId, user.id),
        eq(friendRequests.status, "pending")
      ),
    });

    const userRequests = await Promise.all(
      requests.map(async (request) => {
        const sender = await db.query.users.findFirst({
          where: eq(users.id, request.senderId),
          columns: {
            id: true,
            displayName: true,
            username: true,
            profileImageUrl: true,
          },
        });

        return {
          ...request,
          sender,
        };
      })
    );

    return { userRequests, count: requests.length };
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

  allFriends: userProcedure().query(async ({ ctx: { user } }) => {
    const friends = await db.query.friendships.findMany({
      where: eq(friendships.userId1, user.id),
    });

    const userFriends = await Promise.all(
      friends.map(async (friend) => {
        const dbFriend = await db.query.users.findFirst({
          where: eq(users.id, friend.userId2),
          columns: {
            id: true,
            displayName: true,
            username: true,
            profileImageUrl: true,
          },
        });

        return {
          ...friend,
          dbFriend,
        };
      })
    );

    return { userFriends, count: friends.length };
  }),
});
