import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "../api/trpc/routers/appRouter.js";

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;

//export type ItemType<T> = T extends Array<infer U> ? U : never;

export type UserProfile = RouterOutputs["base"]["user"]["loggedIn"];
