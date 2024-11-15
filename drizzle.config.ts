import { defineConfig } from "drizzle-kit";
import env from "@/env";

export default defineConfig({
  schema: "./src/server/db/schema/index.ts",
  out: "./src/server/db/migrations",
  dialect: "sqlite",
  //driver: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    //authToken: env.TURSO_AUTH_TOKEN,
  },
});
