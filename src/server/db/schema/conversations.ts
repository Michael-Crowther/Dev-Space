import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import conversationParticipants from "./conversationParticipants";

const conversations = sqliteTable("conversations", {
  id: text("id", { length: 128 })
    .primaryKey()
    .$default(() => createId()),
  title: text("title", { length: 128 }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
});

export const conversationRelations = relations(conversations, ({ many }) => ({
  participants: many(conversationParticipants),
}));

export default conversations;
