"use client";
import { Contact } from "lucide-react";
import { Button } from "../ui/button";
import { ProfileNav } from "./ProfileNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHeader } from "../utils/PageHeader";
import { Badge } from "../ui/badge";
import { useUser } from "../providers/UserProvider";
import { api } from "@/app/(app)/api/trpc/util";
import { DirectMessagePopover } from "../popovers/DirectMessagePopover";
import { Conversations } from "@/server/shared/routerTypes";
import { Avatar, MultiAvatar } from "../utils/Avatar";
import { cn } from "@/lib/utils";

export default function SecondaryNav() {
  const pathname = usePathname();
  const selected = pathname.startsWith("/friends");
  const { friendRequests } = useUser();

  const { data: conversations, refetch: getConversations } =
    api.base.user.conversations.useQuery(undefined);

  return (
    <div className="flex flex-col max-w-[310px]">
      <PageHeader className="bg-bgsecondary p-2">
        <Button className="h-8 bg-card text-muted-foreground w-full justify-start flex hover:bg-card">
          Find or start a conversation
        </Button>
      </PageHeader>

      <div className="overflow-auto bg-bgsecondary h-full flex flex-col">
        <Link
          href="/friends"
          className="flex flex-col w-[310px] text-primary p-2"
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

        <div className="h-full bg-bgsecondary pt-2 text-xs text-muted-foreground flex flex-col">
          <section className="flex justify-between items-center px-5">
            <p>DIRECT MESSAGES</p>
            <DirectMessagePopover afterChanges={getConversations} />
          </section>

          <section className="space-y-[2px] mt-2 px-2">
            {conversations?.map((conversation) => (
              <ConversationRow
                conversation={conversation}
                key={conversation.id}
              />
            ))}
          </section>
        </div>
      </div>

      <ProfileNav />
    </div>
  );
}

function ConversationRow({ conversation }: { conversation: Conversations }) {
  const { title, participants, id: conversationId } = conversation;
  const { user } = useUser();
  const pathname = usePathname();
  const selected = pathname.includes(conversationId);

  const titleFallback = participants
    .filter((participant) => participant.user?.id !== user?.id)
    .map(
      (participant) =>
        participant.user?.displayName || participant.user?.username
    )
    .join(", ");

  return (
    <Link
      className={cn(
        "flex items-center gap-2 hover:bg-bgprofilenav hover:cursor-pointer group rounded-sm h-14 overflow-hidden",
        selected && "bg-page text-primary hover:bg-page"
      )}
      href={`/${conversationId}`}
    >
      {participants.length > 2 ? (
        <MultiAvatar
          profileImageUrl1={participants[0].user?.profileImageUrl}
          profileImageUrl2={participants[1].user?.profileImageUrl}
          className={
            selected ? "border-page" : "group-hover:border-bgprofilenav"
          }
        />
      ) : (
        <div className="min-w-11 ml-2">
          <Avatar
            profileImageUrl={participants[0].user?.profileImageUrl}
            className="size-10"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 min-w-0 group-hover:text-primary">
        <p className="text-[15px] truncate mr-3">{title || titleFallback}</p>
        {participants.length > 2 && <p>{participants.length} Members</p>}
      </div>
    </Link>
  );
}
