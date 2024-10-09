"use client";

import { api } from "@/app/api/trpc/util";

export function ProfileNav() {
  const { data: user } = api.base.user.random.useQuery();

  return (
    <section className="h-16 bg-bgprofilenav flex items-center justify-center text-primary">
      Hello, {user?.name}
    </section>
  );
}
