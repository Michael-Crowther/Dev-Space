import env from "@/env";
import { db } from "@/server/db";
import { friendRequests, users } from "./schema";
import { getHashedPassword } from "../utils/bcrypt";
import { randomDate, randomItem } from "@/lib/helpers";
import { eq } from "drizzle-orm";
import { fakeUsers } from "./seedData";

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function seed() {
  console.log("Seeding the database 🌱");

  const passwordHash = await getHashedPassword("1234");

  const dbFakeUsers: (typeof users.$inferInsert)[] = [];

  //create fake users
  for (const user of fakeUsers) {
    dbFakeUsers.push({ ...user, passwordHash, dateOfBirth: randomDate() });
  }

  const dbUsers = await db
    .insert(users)
    .values(dbFakeUsers)
    .returning({ id: users.id });

  const [dbMike] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, "michael-crowther"));

  //create friend requests with myself
  for (let i = 1; i < fakeUsers.length - 1; i++) {
    await db.insert(friendRequests).values({
      senderId: randomItem(dbUsers).id,
      receiverId: dbMike.id,
    });
  }
}

seed()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
