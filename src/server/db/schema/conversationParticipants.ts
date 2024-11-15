import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import conversations from "./conversations";
import users from "./users";
import { relations } from "drizzle-orm";

const conversationParticipants = sqliteTable("conversation_participants", {
  conversationId: text("conversation_id", { length: 128 }).references(
    () => conversations.id,
    { onDelete: "cascade" }
  ),
  userId: text("user_id", { length: 128 }).references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  joinedAt: integer("joined_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
});

export const conversationParticipantRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
    user: one(users, {
      fields: [conversationParticipants.userId],
      references: [users.id],
    }),
  })
);

export default conversationParticipants;
