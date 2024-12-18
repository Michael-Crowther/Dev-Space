import { Button } from "../ui/button";
import { Popover, PopoverContent } from "../ui/popover";
import { useDebounceValue } from "usehooks-ts";
import { LoadingSpinner } from "../utils/LoadingSpinner";
import { NoResults } from "../utils/NoResults";
import { api } from "@/app/(app)/api/trpc/util";
import { Avatar } from "../utils/Avatar";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type DirectMessagesPopoverProps = {
  afterChanges?: () => void;
  children: ReactNode;
  participants?: number;
  conversationId?: string | null;
};

export function DirectMessagePopover({
  afterChanges,
  children,
  participants = 0,
  conversationId,
}: DirectMessagesPopoverProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useDebounceValue("", 300);
  const [checkedUserIds, setCheckedUserIds] = useState<string[]>([]);
  const router = useRouter();
  const MAX_USERS = 5;
  const totalParticipants =
    participants + checkedUserIds.length + (participants === 0 ? 1 : 0);

  const usersToAdd = MAX_USERS - totalParticipants;
  const hasMaxUsers = totalParticipants > MAX_USERS;

  const { mutate: createConversation } =
    api.base.user.createConversation.useMutation({
      onSuccess: (data) => {
        if (data?.message) {
          toast({ description: data.message });
          afterChanges && afterChanges();
        }
        if (data?.conversationId) {
          router.push(`/${data.conversationId}`);
        }
      },
    });

  const { mutate: updateConversation } =
    api.base.user.updateConversation.useMutation({
      onSuccess: (data) => {
        toast({ description: data.message });
        getFriends();
        afterChanges && afterChanges();
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
  } = api.base.user.allFriends.useQuery({ search, conversationId });

  return (
    <Popover
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        setSearch("");
        setCheckedUserIds([]);
      }}
    >
      {children}
      <PopoverContent
        className="w-[450px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <section className="flex flex-col border-b">
          <p className="font-bold text-xl">Select Friends</p>
          <p
            className={cn(
              "text-muted-foreground text-xs mb-3",
              hasMaxUsers && "text-destructive"
            )}
          >
            {hasMaxUsers
              ? `This group has a max of ${MAX_USERS} participants.`
              : `You can add ${usersToAdd} more ${
                  usersToAdd === 1 ? "friend" : "friends"
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
              {
                participants === 0
                  ? createConversation({ userIds: checkedUserIds })
                  : updateConversation({
                      userIds: checkedUserIds,
                      conversationId,
                    });
              }
              setOpen(false);
            }}
            disabled={hasMaxUsers || checkedUserIds.length === 0}
          >
            {participants === 0 ? "Create DM" : "Add Members"}
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
    <main
      className="flex items-center gap-1 hover:bg-page rounded-sm hover:cursor-pointer p-1"
      onClick={() => onClick(!checked)}
    >
      <Avatar profileImageUrl={profileImageUrl} className="size-10 mr-1" />
      <p className="text-primary">{displayName || username}</p>
      <p className="text-muted-foreground text-sm">{username}</p>
      <span className="flex-1" />
      <Checkbox
        className="mr-2"
        checked={checked}
        onCheckedChange={(checked) => onClick(!!checked)}
      />
    </main>
  );
}
