import { PageHeader } from "@/components/utils/PageHeader";
import { NoResults } from "@/components/utils/NoResults";
import { and, eq } from "drizzle-orm";
import { conversationParticipants, conversations } from "@/server/db/schema";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { PrettyObject } from "@/components/utils/PrettyObject";
import { Avatar, MultiAvatar } from "@/components/utils/Avatar";

export default async function Page({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const conversationId = (await params).conversationId;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const conversation = await db.query.conversations.findFirst({
    where: eq(conversations.id, conversationId),
  });

  if (!conversation) {
    return <NoResults title="Conversation not found" />;
  }

  const isParticipant =
    (await db.$count(
      conversationParticipants,
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, session.user.id)
      )
    )) > 0;

  if (!isParticipant) {
    return <NoResults title="Conversation not found" />;
  }

  const participants = await db.query.conversationParticipants.findMany({
    where: eq(conversationParticipants.conversationId, conversationId),
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          profileImageUrl: true,
        },
      },
    },
  });

  const title =
    conversation.title ||
    participants
      .filter((participant) => participant.userId !== session.user?.id)
      .map(
        (participant) =>
          participant.user?.displayName || participant.user?.username
      )
      .join(", ");

  return (
    <>
      <PageHeader className="flex items-center">
        {participants.length > 2 ? (
          <div className="mr-2 mt-1">
            <MultiAvatar
              profileImageUrl1={participants[0].user?.profileImageUrl}
              profileImageUrl2={participants[1].user?.profileImageUrl}
            />
          </div>
        ) : (
          <div className="min-w-11 ml-2">
            <Avatar
              profileImageUrl={participants[0].user?.profileImageUrl}
              className="size-8"
            />
          </div>
        )}
        <p>{title}</p>
      </PageHeader>
      <PrettyObject>{conversation}</PrettyObject>
    </>
  );
}
