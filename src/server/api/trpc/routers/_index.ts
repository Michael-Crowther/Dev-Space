import { router } from "../trpc";
import { userRouter } from "./user";

export const baseRouter = router({
  user: userRouter,
});
