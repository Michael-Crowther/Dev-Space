import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

const users = sqliteTable("users", {
  id: text("id", { length: 128 })
    .primaryKey()
    .$default(() => createId()),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  profileImageUrl: text("profile_image_url")
    .default("https://github.com/shadcn.png")
    .notNull(),
  email: text("email").notNull().unique(),
  dateOfBirth: integer("date_of_birth", { mode: "timestamp" }).notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export default users;
