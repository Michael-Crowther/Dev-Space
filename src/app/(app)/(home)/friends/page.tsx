"use client";
import { api } from "../../api/trpc/util";
import { SearchBar } from "@/components/utils/SearchBar";
import { Avatar } from "@/components/utils/Avatar";
import { NoResults } from "@/components/utils/NoResults";
import { useDebounceValue } from "usehooks-ts";
import { LoadingSpinner } from "@/components/utils/LoadingSpinner";

export default function Friends() {
  const [search, setSearch] = useDebounceValue("", 300);

  const { data: friends, isLoading } = api.base.user.allFriends.useQuery(
    { search },
    { refetchOnMount: true }
  );

  if (friends?.count === 0 && !search) {
    return <NoResults title="No friends" />;
  }

  return (
    <div className="flex flex-col items-start p-4 h-full overflow-auto pt-0">
      <section className="sticky top-0 z-50 w-full pt-4 bg-page">
        <SearchBar setSearch={setSearch} className="px-5" />

        <p className="p-3 border-b w-full text-sm">
          All Friends - {friends && <span>{friends.count}</span>}
        </p>
      </section>

      {isLoading ? (
        <LoadingSpinner />
      ) : friends?.friendsWithUser && friends.friendsWithUser.length > 0 ? (
        <div className="flex flex-col w-full divide-y divide-border">
          {friends.friendsWithUser.map(
            (friend) => friend && <FriendRow key={friend.id} friend={friend} />
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
    displayName: string | null;
    username: string;
    profileImageUrl: string;
  };
};

function FriendRow({
  friend: { displayName, username, profileImageUrl },
}: FriendRowProps) {
  return (
    <div className="flex gap-3 p-4 items-center">
      <Avatar profileImageUrl={profileImageUrl} className="size-10" />
      <section>
        <p>{displayName || username}</p>
        <p className="text-xs">Online</p>
      </section>
      <span className="flex-1" />
    </div>
  );
}
