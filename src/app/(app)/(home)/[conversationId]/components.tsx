"use client";
import { Avatar, MultiAvatar } from "@/components/utils/Avatar";
import Tooltip from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  CircleUserRound,
  PhoneCall,
  UserPlus,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/utils/PageHeader";
import { format } from "date-fns";
import { DirectMessagePopover } from "@/components/popovers/DirectMessagePopover";
import { PopoverTrigger } from "@/components/ui/popover";
import { Participants } from "@/types";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/UserProvider";

type PageComponentsType = {
  participants: Participants;
  title: string;
};

export default function PageComponents({
  participants,
  title,
}: PageComponentsType) {
  const [showSidebar, setShowSidebar] = useState(true);
  const router = useRouter();
  const { getConversations } = useUser();

  const isGroupChat = participants.length > 2;
  const firstParticipant = participants[0].user;
  const secondParticipant = participants[1].user;

  return (
    <>
      <PageHeader className="flex items-center">
        {isGroupChat ? (
          <div className="mr-2 mt-1">
            <MultiAvatar
              profileImageUrl1={firstParticipant?.profileImageUrl}
              profileImageUrl2={secondParticipant?.profileImageUrl}
            />
          </div>
        ) : (
          <div className="min-w-11 ml-2">
            <Avatar
              profileImageUrl={firstParticipant?.profileImageUrl}
              className="size-8"
            />
          </div>
        )}
        <p>{title}</p>
        <span className="flex-1" />
        <section className="flex gap-1">
          <Tooltip title="Start Voice Call">
            <Button size="icon" variant="ghost">
              <PhoneCall className="size-5" />
            </Button>
          </Tooltip>
          <Tooltip title="Start Video Call">
            <Button size="icon" variant="ghost">
              <Video className="size-5" />
            </Button>
          </Tooltip>
          <DirectMessagePopover
            afterChanges={() => {
              router.refresh();
              getConversations();
            }}
            participants={participants.length}
            conversationId={participants[0].conversationId}
          >
            <Tooltip title="Add Friends to DM">
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost">
                  <UserPlus className="size-4" />
                </Button>
              </PopoverTrigger>
            </Tooltip>
          </DirectMessagePopover>
          {isGroupChat && (
            <Tooltip
              title={showSidebar ? "Hide Member List" : "Show Member List"}
            >
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setShowSidebar(!showSidebar);
                }}
              >
                <Users className="size-5" />
              </Button>
            </Tooltip>
          )}
          {!isGroupChat && (
            <Tooltip
              title={showSidebar ? "Hide User Profile" : "Show User Profile"}
            >
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setShowSidebar(!showSidebar);
                }}
              >
                <CircleUserRound className="size-5" />
              </Button>
            </Tooltip>
          )}
        </section>
      </PageHeader>
      <main className="h-full flex">
        <section className="flex items-center justify-center w-full">
          Messages go here
        </section>

        {isGroupChat && showSidebar && (
          <section className="w-1/4 bg-secondary p-4 text-muted-foreground text-sm">
            <p>Members - {participants.length}</p>
            <div className="space-y-3 mt-3">
              {participants.map(({ user }) => (
                <div className="flex gap-2" key={user?.id}>
                  <Avatar
                    profileImageUrl={user?.profileImageUrl}
                    className="size-8"
                  />
                  <p>{user?.displayName || user?.username}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!isGroupChat && showSidebar && firstParticipant && (
          <div className="w-1/4 bg-secondary p-7 text-muted-foreground text-sm flex flex-col gap-3">
            <Avatar profileImageUrl={firstParticipant.profileImageUrl} />
            <div className="flex flex-col gap-1">
              <p className="text-primary text-lg">
                {firstParticipant.displayName || firstParticipant.username}
              </p>
              <p className="text-primary text-sm">
                {" "}
                {firstParticipant.displayName || firstParticipant.username}
              </p>
              <p>
                {`Registered ${format(
                  new Date(firstParticipant.createdAt),
                  "MMM dd, yyyy"
                )}`}
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
