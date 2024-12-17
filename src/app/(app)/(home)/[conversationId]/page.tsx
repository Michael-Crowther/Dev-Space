import { NoResults } from "@/components/utils/NoResults";
import { and, asc, eq } from "drizzle-orm";
import { conversationParticipants, conversations } from "@/server/db/schema";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import PageComponents from "./components";

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
          createdAt: true,
        },
      },
    },
    orderBy: asc(eq(conversationParticipants.userId, session?.user.id)),
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
    <PageComponents
      participants={participants}
      title={title}
      conversationId={conversationId}
    />
  );
}
