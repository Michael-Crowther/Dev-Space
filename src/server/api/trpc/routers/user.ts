import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { procedure, router } from "../trpc";

export const userRouter = router({
  all: procedure.query(async () => {
    return await db.select().from(users);
  }),
});
