import { baseRouter } from "./routers/_index";
import { router } from "./trpc";

export const appRouter = router({
  base: baseRouter,
});

export type AppRouter = typeof appRouter;
