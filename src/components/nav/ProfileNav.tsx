"use client";

import { api } from "@/app/api/trpc/util";

export function ProfileNav() {
  const { data: loggedInUser } = api.base.user.loggedIn.useQuery();

  return (
    <section className="h-16 bg-bgprofilenav flex items-center justify-center text-primary">
      Hello, {loggedInUser?.name}
    </section>
  );
}
