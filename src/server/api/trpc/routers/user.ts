import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { procedure, router } from "../trpc";
import { eq } from "drizzle-orm";

export const userRouter = router({
  all: procedure.query(async () => {
    return await db.select().from(users);
  }),

  loggedIn: procedure.query(async ({ ctx: { user } }) => {
    if (user) {
      return await db.query.users.findFirst({
        where: eq(users.id, user?.id),
      });
    }
  }),
});
