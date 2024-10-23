"use client";
import { api } from "@/app/api/trpc/util";
import { UserProfile } from "@/server/shared/routerTypes";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type UserContext = {
  user: UserProfile;
  getUser: () => void;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: user, refetch: getUser } = api.base.user.getUser.useQuery(
    undefined,
    {
      enabled: !!session?.user?.id,
    }
  );

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session) {
    return null;
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
