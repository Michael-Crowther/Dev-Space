"use client";
import { api } from "@/app/(app)/api/trpc/util";
import { UserProfile } from "@/server/shared/routerTypes";
import { createContext, ReactNode, useContext } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { LoadingSpinner } from "../utils/LoadingSpinner";

type UserContext = {
  user: UserProfile;
  getUser: () => void;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  const { data: user, refetch: getUser } = api.base.user.getUser.useQuery(
    undefined,
    {
      enabled: !!session?.user?.id,
    }
  );

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <UserContext.Provider value={{ user, getUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context?.user) {
    redirect("/login");
  }

  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }

  const { user, getUser } = context;
  return { user, getUser };
}
