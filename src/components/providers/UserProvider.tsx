"use client";
import { api } from "@/app/(app)/api/trpc/util";
import { UserProfile } from "@/server/shared/routerTypes";
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
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [sessionFetched, setSessionFetched] = useState(false);

  const { data: user, refetch: getUser } = api.base.user.getUser.useQuery(
    undefined,
    { enabled: status === "authenticated" }
  );

  useEffect(() => {
    if (!sessionFetched) {
      getSession();
      setSessionFetched(true);
    }
  }, []);

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

  if (!context || !context.user) {
    throw new Error(
      "useUser must be used within a UserContextProvider || user does not exist"
    );
  }

  const { user, getUser } = context;
  return { user, getUser };
}
