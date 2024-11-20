"use client";
import { useUser } from "@/components/providers/UserProvider";
import { redirect } from "next/navigation";

export default function Page() {
  const { conversations } = useUser();

  if (!conversations || !conversations[0]) {
    redirect("/friends");
  }

  redirect(`/${conversations[0].id}`);
}
