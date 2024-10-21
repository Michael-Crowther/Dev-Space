"use client";

import { api } from "@/app/api/trpc/util";
import { UserProfile } from "@/server/shared/routerTypes";
import { createContext, ReactNode, useContext } from "react";
import { ClipLoader } from "react-spinners";

type UserContext = {
  user: UserProfile;
  getUser: () => void;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const {
    data: user,
    isLoading,
    refetch: getUser,
  } = api.base.user.loggedIn.useQuery();

  if (isLoading) {
    return <ClipLoader />;
  }

  return (
    <UserContext.Provider value={{ user, getUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context || !context.user) {
    throw new Error(
      "useUser must be used within a UserContextProvider || user does not exist"
    );
  }
  const { user, getUser } = context;
  return { user, getUser };
}
