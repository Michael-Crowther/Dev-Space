"use client";
import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  loggerLink,
  // unstable_httpBatchStreamLink,
  httpBatchLink,
} from "@trpc/client";
import React, { useState } from "react";
import SuperJSON from "superjson";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { createTRPCReact } from "@trpc/react-query";
import { toast } from "sonner";
import { type AppRouter } from "@/server/api/trpc/appRouter";
import { useRouter } from "next/navigation";

export const api = createTRPCReact<AppRouter>();

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  function onError(error: unknown) {
    if (typeof error === "object" && error !== null) {
      if ("message" in error) {
        const message = (error as { message: unknown }).message;
        if (typeof message === "string") {
          toast.error("Error", { description: message });

          // redirecting to login page
          if (message === "Missing or invalid user") {
            router.push("/login");
          }
        }
      }
    }
  }

  function onSuccess(data: unknown) {
    if (typeof data === "object" && data !== null) {
      if ("message" in data) {
        const message = (data as { message: unknown }).message;
        if (typeof message === "string") {
          toast.success("Success", { description: message });
        }
      }
    }
  }

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30 * 1000, retry: false },
          dehydrate: {
            serializeData: SuperJSON.serialize,
            shouldDehydrateQuery: (query) =>
              defaultShouldDehydrateQuery(query) ||
              query.state.status === "pending",
          },
          hydrate: {
            deserializeData: SuperJSON.deserialize,
          },
        },
        queryCache: new QueryCache({ onError, onSuccess }),
        mutationCache: new MutationCache({ onError, onSuccess }),
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        // unstable_httpBatchStreamLink({
        //   transformer: SuperJSON,
        //   url: getBaseUrl() + "/api/trpc",
        //   headers: () => {
        //     const headers = new Headers();
        //     headers.set("x-trpc-source", "nextjs-react");
        //     return headers;
        //   },
        // }),
        httpBatchLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
