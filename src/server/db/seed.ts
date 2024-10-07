import env from "@/env";
import { db } from "@/server/db";
import { users } from "./schema";

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

// function randomInteger(min: number, max: number): number {
//   min = Math.ceil(min);
//   max = Math.floor(max);

//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

async function seed() {
  console.log("Seeding the database 🌱");
  const dbUsers = await db.insert(users).values({
    name: "Michael Crowther",
    username: "michael-crowther",
    email: "md.crowther@yahoo.com",
    passwordHash: "yomama",
  });

  return dbUsers;
}

seed()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
