import env from "@/env";
import { db } from "@/server/db";
import { friendRequests, users } from "./schema";
import { getHashedPassword } from "../utils/bcrypt";
import { fakeUsers } from "./seedData";

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

// function randomInteger(min: number, max: number): number {
//   min = Math.ceil(min);
//   max = Math.floor(max);

//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

export function randomDate(days = 7): Date {
  // generates a random date x days before or after the current date
  const currentDate = new Date();
  const range = days * 24 * 60 * 60 * 1000;
  const randomOffset = Math.floor(Math.random() * (2 * range)) - range;
  const randomDate = new Date(currentDate.getTime() + randomOffset);
  return randomDate;
}

async function seed() {
  console.log("Seeding the database 🌱");

  const passwordHash = await getHashedPassword("1234");

  //create fake users
  for (const user of fakeUsers) {
    await db
      .insert(users)
      .values({ ...user, passwordHash, dateOfBirth: randomDate() });
  }

  //create friend requests with myself
  for (let i = 1; i < fakeUsers.length - 1; i++) {
    await db
      .insert(friendRequests)
      .values({ senderId: fakeUsers[i].id, receiverId: fakeUsers[0].id });
  }
}

seed()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
