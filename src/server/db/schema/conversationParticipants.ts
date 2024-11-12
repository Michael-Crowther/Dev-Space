import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import conversations from "./conversations";
import users from "./users";

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

export default conversationParticipants;
