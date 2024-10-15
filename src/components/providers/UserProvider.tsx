"use client";

import { api } from "@/app/api/trpc/util";
import { UserProfile } from "@/server/shared/routerTypes";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";
import { ClipLoader } from "react-spinners";

type UserContext = {
  user: UserProfile;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { data: user, isLoading } = api.base.user.loggedIn.useQuery();

  if (isLoading) {
    return <ClipLoader />;
  }

  if (!user) {
    router.push("/login");
  }

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context || !context.user) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context.user;
}
