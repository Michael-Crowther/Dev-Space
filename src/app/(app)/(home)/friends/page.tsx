"use client";
import { PrettyObject } from "@/components/utils/PrettyObject";
import { api } from "../../api/trpc/util";

export default function Friends() {
  const friends = api.base.user.allFriends.useQuery();
  return (
    <div className="flex items-center justify-center h-full">
      <PrettyObject>{friends?.data?.userFriends}</PrettyObject>
    </div>
  );
}
