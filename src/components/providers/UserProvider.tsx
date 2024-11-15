"use client";
import { api } from "@/app/(app)/api/trpc/util";
import {
  FriendRequests,
  Friends,
  UserProfile,
} from "@/server/shared/routerTypes";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getSession, useSession } from "next-auth/react";
import { LoadingSpinner } from "../utils/LoadingSpinner";
import { useRouter } from "next/navigation";

type UserContext = {
  user: UserProfile;
  getUser: () => void;
  friendRequests: FriendRequests | undefined;
  getFriendRequests: () => void;
  friends: Friends | undefined;
  getFriends: () => void;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const [sessionFetched, setSessionFetched] = useState(false);

  const {
    data: user,
    refetch: getUser,
    isLoading,
    error: userError,
  } = api.base.user.getUser.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const { data: friendRequests, refetch: getFriendRequests } =
    api.base.user.friendRequests.useQuery();

  const { data: friends, refetch: getFriends } =
    api.base.user.allFriends.useQuery({ search: "" });

  useEffect(() => {
    if (!sessionFetched) {
      getSession().then(() => {
        getUser();
        getFriendRequests();
        getFriends();
      });
      setSessionFetched(true);
    }
  }, [getUser, sessionFetched, getFriendRequests, getFriends]);

  useEffect(() => {
    if (userError) {
      router.push("/login");
    }
  }, [userError, router]);

  if (!user || isLoading || status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        getUser,
        friendRequests,
        getFriendRequests,
        friends,
        getFriends,
      }}
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

  const {
    user,
    getUser,
    friendRequests,
    getFriendRequests,
    friends,
    getFriends,
  } = context;
  return {
    user,
    getUser,
    friendRequests,
    getFriendRequests,
    friends,
    getFriends,
  };
}
