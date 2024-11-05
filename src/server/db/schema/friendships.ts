import {
  text,
  sqliteTable,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import users from "./users";

const friendships = sqliteTable(
  "friendships",
  {
    id: text("id", { length: 128 })
      .primaryKey()
      .$default(() => createId()),
    userId1: text("user_id_1", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userId2: text("user_id_2", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
  },
  (table) => ({
    unique_friendship: uniqueIndex("unique_friendship").on(
      table.userId1,
      table.userId2
    ),
  })
);

export default friendships;
