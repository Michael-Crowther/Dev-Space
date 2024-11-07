"use client";
import { api } from "@/app/(app)/api/trpc/util";
import { FriendRequests, UserProfile } from "@/server/shared/routerTypes";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getSession, useSession } from "next-auth/react";
import { LoadingSpinner } from "../utils/LoadingSpinner";

type UserContext = {
  user: UserProfile;
  getUser: () => void;
  friendRequests: FriendRequests | undefined;
  getFriendRequests: () => void;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [sessionFetched, setSessionFetched] = useState(false);

  const {
    data: user,
    refetch: getUser,
    isLoading,
  } = api.base.user.getUser.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const { data: friendRequests, refetch: getFriendRequests } =
    api.base.user.friendRequests.useQuery();

  useEffect(() => {
    if (!sessionFetched) {
      getSession().then(() => getUser());
      setSessionFetched(true);
    }
  }, [getUser, sessionFetched]);

  if (!user || isLoading || status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <UserContext.Provider
      value={{ user, getUser, friendRequests, getFriendRequests }}
    >
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

  const { user, getUser, friendRequests, getFriendRequests } = context;
  return { user, getUser, friendRequests, getFriendRequests };
}
