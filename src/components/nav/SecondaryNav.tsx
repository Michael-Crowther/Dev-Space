"use client";
import { Contact, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ProfileNav } from "./ProfileNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHeader } from "../utils/PageHeader";
import { Badge } from "../ui/badge";
import { useUser } from "../providers/UserProvider";
import Tooltip from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useDebounceValue } from "usehooks-ts";
import { LoadingSpinner } from "../utils/LoadingSpinner";
import { NoResults } from "../utils/NoResults";
import { api } from "@/app/(app)/api/trpc/util";
import { Avatar } from "../utils/Avatar";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { PrettyObject } from "../utils/PrettyObject";

export default function SecondaryNav() {
  const pathname = usePathname();
  const selected = pathname.startsWith("/friends");
  const { friendRequests } = useUser();

  const { data: directMessages, refetch: getDirectMessages } =
    api.base.user.directMessages.useQuery();

  return (
    <div className="flex flex-col">
      <PageHeader className="bg-bgsecondary p-2">
        <Button className="h-8 bg-card text-muted-foreground w-full justify-start flex hover:bg-card">
          Find or start a conversation
        </Button>
      </PageHeader>
      <Link
        href="/friends"
        className="bg-bgsecondary flex flex-col w-[310px] text-primary p-2"
      >
        <Button
          className={`flex gap-4 w-full justify-start h-10 bg-bgsecondary text-muted-foreground text-xl hover:bg-page hover:text-primary ${
            selected ? "text-primary bg-page" : ""
          }`}
        >
          <Contact />
          Friends
          <span className="flex-1" />
          {friendRequests && friendRequests.count > 0 && (
            <Badge variant="destructive">{friendRequests.count}</Badge>
          )}
        </Button>
      </Link>

      <section className="h-full bg-bgsecondary pt-2 p-6 text-xs text-muted-foreground flex flex-col">
        <div className="flex justify-between items-center">
          <p>DIRECT MESSAGES</p>
          <DirectMessagePopover afterChanges={getDirectMessages} />
        </div>
        <PrettyObject>{directMessages}</PrettyObject>
        {/* <div className="flex items-center justify-center h-full text-lg">
          No DMs
        </div> */}
      </section>
      <ProfileNav />
    </div>
  );
}

function DirectMessagePopover({ afterChanges }: { afterChanges: () => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useDebounceValue("", 300);
  const [checkedUserIds, setCheckedUserIds] = useState<string[]>([]);
  const maxUsers = checkedUserIds.length > 4;

  const { mutate: createDm } = api.base.user.createDm.useMutation({
    onSuccess: (data) => {
      toast({ description: data.message });
      afterChanges();
    },
  });

  function handleUserSelect(userId: string, isChecked: boolean) {
    setCheckedUserIds((currentUsers) => {
      if (isChecked) {
        // Add userId to the array if it's not already present
        return currentUsers.includes(userId)
          ? currentUsers
          : [...currentUsers, userId];
      } else {
        // Remove userId from the array
        return currentUsers.filter((id) => id !== userId);
      }
    });
  }

  const {
    data: friends,
    refetch: getFriends,
    isLoading,
  } = api.base.user.allFriends.useQuery({ search });
  return (
    <Popover
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        setSearch("");
        setCheckedUserIds([]);
      }}
    >
      <Tooltip title="Create DM">
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost">
            <Plus className="size-4" />
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent
        className="w-[450px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <section className="flex flex-col border-b">
          <p className="font-bold text-xl">Select Friends</p>
          <p
            className={cn(
              "text-muted-foreground text-xs mb-3",
              maxUsers && "text-destructive"
            )}
          >
            {maxUsers
              ? "This group has a max of 5 participants."
              : `You can add ${4 - checkedUserIds.length} more ${
                  4 - checkedUserIds.length === 1 ? "friend" : "friends"
                }.`}
          </p>
          <Input
            placeholder="Type the username of a friend"
            className="mb-4 text-secondary-foreground h-10 bg-page"
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        <section className="max-h-60 overflow-auto p-1">
          {isLoading ? (
            <LoadingSpinner />
          ) : !friends || (friends.count === 0 && !search) ? (
            <NoResults title="No Friends" />
          ) : friends.friendsWithUser && friends.friendsWithUser.length > 0 ? (
            <div className="flex flex-col gap-2">
              {friends.friendsWithUser.map(
                (friend) =>
                  friend && (
                    <FriendRow
                      key={friend.id}
                      friend={friend}
                      checkedUserIds={checkedUserIds}
                      afterChanges={getFriends}
                      onClick={(checked) =>
                        handleUserSelect(friend.id, checked)
                      }
                    />
                  )
              )}
            </div>
          ) : (
            <div className="h-full w-full">
              <NoResults title="Can't find anyone with that name" delayRender />
            </div>
          )}
        </section>
        <footer className="sticky bottom-0 pt-4 border-t-[0.5px] w-full">
          <Button
            className="bg-brand-500 w-full text-white hover:bg-brand-600"
            onClick={() => {
              createDm({ userIds: checkedUserIds });
              setOpen(false);
            }}
            disabled={maxUsers}
          >
            Create DM
          </Button>
        </footer>
      </PopoverContent>
    </Popover>
  );
}

type FriendRowProps = {
  friend: {
    id: string;
    displayName: string | null;
    username: string;
    profileImageUrl: string;
  };
  checkedUserIds: string[];
  afterChanges: () => void;
  onClick: (checked: boolean) => void;
};

function FriendRow({
  friend: { id: friendId, profileImageUrl, username, displayName },
  checkedUserIds,
  onClick,
}: FriendRowProps) {
  const checked = checkedUserIds.includes(friendId);

  return (
    <main>
      <div className="flex items-center gap-1 hover:bg-page rounded-sm hover:cursor-pointer p-1">
        <Avatar profileImageUrl={profileImageUrl} className="size-10 mr-1" />
        <p className="text-primary">{displayName || username}</p>
        <p className="text-muted-foreground text-sm">{username}</p>
        <span className="flex-1" />
        <Checkbox
          className="mr-2"
          checked={checked}
          onCheckedChange={(checked) => onClick(!!checked)}
        />
      </div>
    </main>
  );
}
