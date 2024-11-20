export type Participants = {
  userId: string | null;
  conversationId: string | null;
  joinedAt: Date;
  user: {
    id: string;
    createdAt: Date;
    username: string;
    displayName: string | null;
    profileImageUrl: string;
  } | null;
}[];
