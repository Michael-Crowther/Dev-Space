import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "..";
import sessions from "./sessions";
import users from "./users";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export { adapter };
