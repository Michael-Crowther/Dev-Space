import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "../../../../auth";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();

  return { user: session?.user, ...opts };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const procedure = t.procedure;

export function userProcedure() {
  return procedure.use(async ({ next, ctx }) => {
    const { user } = ctx;

    if (!user || !user.id) {
      throw new Error("User is missing");
    }

    return next({ ctx: { user: { id: user.id } } });
  });
}
