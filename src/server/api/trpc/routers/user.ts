import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { procedure, router, userProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { LibsqlError } from "@libsql/client";
import {
  passwordChangeSchema,
  updateDisplayNameSchema,
  updateUsernameSchema,
} from "@/server/utils/zodSchemas";
import { getHashedPassword, isPasswordMatch } from "@/server/utils/bcrypt";
import { toast } from "@/hooks/use-toast";

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

  changePassword: userProcedure()
    .input(passwordChangeSchema)
    .mutation(async ({ input, ctx: { user } }) => {
      const { currentPassword, newPassword, confirmNewPassword } = input;
      if (newPassword !== confirmNewPassword) {
        toast({ description: "Passwords do not match" });
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
      return { message: "Changed password" };
    }),
});
