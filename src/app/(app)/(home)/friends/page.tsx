"use client";
import { api } from "../../api/trpc/util";
import { SearchBar } from "@/components/utils/SearchBar";
import { Avatar } from "@/components/utils/Avatar";
import { NoResults } from "@/components/utils/NoResults";
import { useDebounceValue } from "usehooks-ts";
import { LoadingSpinner } from "@/components/utils/LoadingSpinner";
import { MessageCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

export default function Friends() {
  const [search, setSearch] = useDebounceValue("", 300);

  const {
    data: friends,
    refetch: getFriends,
    isLoading,
  } = api.base.user.allFriends.useQuery({ search });

  if ((friends?.count === 0 || !friends) && !search) {
    return <NoResults title="No friends" delayRender />;
  }

  return (
    <div className="flex flex-col items-start h-full overflow-auto pt-0">
      <section className="sticky top-0 z-30 w-full pt-4 bg-page">
        <SearchBar setSearch={setSearch} className="px-5" />

        <p className="p-3 border-b w-full text-sm">
          All Friends - {friends && <span>{friends.count}</span>}
        </p>
      </section>

      {isLoading ? (
        <LoadingSpinner />
      ) : friends?.friendsWithUser && friends.friendsWithUser.length > 0 ? (
        <div className="flex flex-col w-full p-3 pt-0">
          {friends.friendsWithUser.map(
            (friend) =>
              friend && (
                <FriendRow
                  key={friend.id}
                  friend={friend}
                  afterChanges={getFriends}
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

type FriendRowProps = {
  friend: {
    id: string;
    displayName: string | null;
    username: string;
    profileImageUrl: string;
  };
  afterChanges: () => void;
};

function FriendRow({
  friend: { id: friendId, displayName, username, profileImageUrl },
  afterChanges,
}: FriendRowProps) {
  const menuButtonStyle =
    "rounded-sm w-full bg-inherit flex justify-start text-muted-foreground hover:bg-brand hover:text-primary";

  const { mutate: removeFriend } = api.base.user.removeFriend.useMutation({
    onSuccess: (data) => {
      toast({ description: data.message });
      afterChanges();
    },
    onError: (error) =>
      toast({ description: error.message, variant: "destructive" }),
  });

  return (
    <>
      <div className="flex gap-3 p-4 items-center hover:bg-accent-foreground/10 hover:cursor-pointer group hover:rounded-lg">
        <Avatar profileImageUrl={profileImageUrl} className="size-10" />
        <section>
          <div className="flex gap-2 items-center">
            <p>{displayName || username}</p>
            <p className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100">
              {displayName && username}
            </p>
          </div>
          <p className="text-xs">Online</p>
        </section>
        <span className="flex-1" />
        <Tooltip title="Message">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full p-2 size-10"
          >
            <MessageCircle />
          </Button>
        </Tooltip>
        <Popover>
          <Tooltip title="More">
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full p-2 size-10"
              >
                <MoreVertical />
              </Button>
            </PopoverTrigger>
          </Tooltip>
          <PopoverContent className="p-2 w-[220px]">
            <Button className={menuButtonStyle}>Start Voice Call</Button>
            <Button className={menuButtonStyle}>Start Video Call</Button>
            <Button
              className="hover:bg-destructive rounded-sm w-full bg-inherit hover:text-primary text-destructive flex justify-start"
              onClick={() => removeFriend({ friendId })}
            >
              Remove Friend
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <span className="border-b mx-2" />
    </>
  );
}
