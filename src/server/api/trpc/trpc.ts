import { validateRequest } from "@/server/auth/validation";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const { user, session } = await validateRequest();

  return { user, session, ...opts };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const procedure = t.procedure;
