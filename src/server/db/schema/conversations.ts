import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

const conversations = sqliteTable("conversations", {
  id: text("id", { length: 128 })
    .primaryKey()
    .$default(() => createId()),
  title: text("title", { length: 128 }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
});

export default conversations;
