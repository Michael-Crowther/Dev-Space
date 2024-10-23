import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { procedure, router, userProcedure } from "../trpc";
import { eq } from "drizzle-orm";
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
      },
      where: eq(users.id, user.id),
    });
  }),

  updateDisplayName: userProcedure()
    .input(
      z.object({
        value: z
          .string()
          .max(20, "Display name must be 20 characters or less")
          .trim(),
      })
    )
    .mutation(async ({ input: { value }, ctx: { user } }) => {
      try {
        await db
          .update(users)
          .set({ displayName: value })
          .where(eq(users.id, user.id));

        return { message: "Display name was successfully changed." };
      } catch (error) {
        if (error instanceof Error) {
          return { message: error.message };
        }
      }
    }),

  updateUsername: userProcedure()
    .input(
      z.object({
        value: z
          .string()
          .max(20, "Username must be 20 characters or less")
          .trim(),
      })
    )
    .mutation(async ({ input: { value }, ctx: { user } }) => {
      try {
        await db
          .update(users)
          .set({ username: value })
          .where(eq(users.id, user.id));

        return { message: "Username was successfully changed." };
      } catch (error) {
        if (error instanceof Error) {
          return { message: error.message };
        }
      }
    }),
});
