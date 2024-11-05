"use client";
import { api } from "@/app/(app)/api/trpc/util";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/utils/Avatar";
import { NoResults } from "@/components/utils/NoResults";
import { SearchBar } from "@/components/utils/SearchBar";
import { toast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { useState } from "react";

export default function FriendsPending() {
  const [search, setSearch] = useState("");

  const pendingRequests = api.base.user.friendRequests.useQuery();

  if (!pendingRequests.data || pendingRequests.data.count === 0) {
    return <NoResults title="No pending requests" />;
  }

  return (
    <div className="flex flex-col items-start p-4 h-full">
      <SearchBar search={search} setSearch={setSearch} className="px-5" />

      <p className="p-3 border-b w-full text-sm">
        Pending - {pendingRequests?.data?.count}
      </p>

      <div className="flex flex-col p-2 pt-0 w-full divide-y">
        {pendingRequests?.data.userRequests.map(
          (request) =>
            request.sender && (
              <FriendRequestRow
                key={request.id}
                requestId={request.id}
                sender={request.sender}
                afterChanges={pendingRequests.refetch}
              />
            )
        )}
      </div>
    </div>
  );
}

type FriendRequestRow = {
  requestId: string;
  sender: {
    id: string;
    username: string;
    displayName: string | null;
    profileImageUrl: string;
  };
  afterChanges: () => void;
};

function FriendRequestRow({
  requestId,
  sender: { username, displayName, profileImageUrl },
  afterChanges,
}: FriendRequestRow) {
  const { mutate: acceptOrRejectFriendRequest } =
    api.base.user.acceptOrRejectFriendRequest.useMutation({
      onSuccess: (data) => {
        toast({ description: data?.message });
        afterChanges();
      },
      onError: (error) => {
        toast({ description: error?.message, variant: "destructive" });
      },
    });

  return (
    <div className="flex gap-3 p-4 items-center">
      <Avatar profileImageUrl={profileImageUrl} className="size-10" />
      <section>
        <p>{displayName || username}</p>
        <p className="text-xs">Incoming Friend Request</p>
      </section>
      <span className="flex-1" />
      <section className="flex gap-5">
        <Button
          size="icon"
          variant="ghost"
          onClick={() =>
            acceptOrRejectFriendRequest({ requestId, type: "accept" })
          }
        >
          <Check />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() =>
            acceptOrRejectFriendRequest({ requestId, type: "reject" })
          }
        >
          <X />
        </Button>
      </section>
    </div>
  );
}
