import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { procedure, router, userProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { LibsqlError } from "@libsql/client";
import {
  updateDisplayNameSchema,
  updateUsernameSchema,
} from "@/server/utils/zodSchemas";

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
          return { message: error.message };
        }
      }
    }),
});
