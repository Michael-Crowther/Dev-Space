"use client";
import { api } from "@/app/(app)/api/trpc/util";
import { useUser } from "@/components/providers/UserProvider";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/ui/tooltip";
import { Avatar } from "@/components/utils/Avatar";
import { LoadingSpinner } from "@/components/utils/LoadingSpinner";
import { NoResults } from "@/components/utils/NoResults";
import { SearchBar } from "@/components/utils/SearchBar";
import { toast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

export default function FriendsPending() {
  const [search, setSearch] = useDebounceValue("", 300);

  const { getFriendRequests } = useUser();

  const {
    data: friendRequests,
    refetch,
    isLoading,
  } = api.base.user.friendRequests.useQuery(
    { search },
    { refetchOnMount: true }
  );

  if ((friendRequests?.count === 0 || !friendRequests) && !search) {
    return <NoResults title="No pending requests" delayRender />;
  }

  return (
    <div className="flex flex-col items-start p-4 h-full overflow-auto pt-0">
      <section className="sticky top-0 z-50 w-full pt-4 bg-page">
        <SearchBar setSearch={setSearch} className="px-5" />

        <p className="p-3 border-b w-full text-sm">
          Pending - {friendRequests && <span>{friendRequests.count}</span>}
        </p>
      </section>

      {isLoading ? (
        <LoadingSpinner />
      ) : friendRequests?.requestsWithUser &&
        friendRequests.requestsWithUser.length > 0 ? (
        <div className="flex flex-col w-full divide-y divide-border">
          {friendRequests.requestsWithUser.map(
            ({ requestId, sender }) =>
              sender && (
                <FriendRequestRow
                  key={requestId}
                  requestId={requestId}
                  sender={sender}
                  afterChanges={() => {
                    refetch();
                    getFriendRequests();
                  }}
                />
              )
          )}
        </div>
      ) : (
        <div className="h-full w-full">
          <NoResults title="Can't find anyone with that name" delayRender />
        </div>
      )}
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
        <Tooltip placement="top" title="Accept">
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              acceptOrRejectFriendRequest({ requestId, type: "accept" })
            }
          >
            <Check />
          </Button>
        </Tooltip>
        <Tooltip placement="top" title="Ignore">
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              acceptOrRejectFriendRequest({ requestId, type: "reject" })
            }
          >
            <X />
          </Button>
        </Tooltip>
      </section>
    </div>
  );
}
