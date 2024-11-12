import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import users from "./users";
import conversations from "./conversations";

const messages = sqliteTable("messages", {
  id: text("id", { length: 128 })
    .primaryKey()
    .$default(() => createId()),
  content: text("content").notNull(),
  conversationId: text("conversation_id", { length: 128 })
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  createdByUserId: text("created_by_user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
});

export default messages;
