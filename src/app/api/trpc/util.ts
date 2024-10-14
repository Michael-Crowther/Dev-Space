import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { createTRPCClient } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@/server/api/trpc/routers/appRouter";

const { NEXT_PUBLIC_FRONTEND_URL } = process.env;
const url = NEXT_PUBLIC_FRONTEND_URL || "/api/trpc";

export const api = createTRPCReact<AppRouter>();
export const proxy = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: superjson,
      url,
      fetch(url, options) {
        return fetch(url, { ...options, credentials: "include" });
      },
    }),
  ],
});
