import env from "@/env";
import { db } from "@/server/db";
import { users } from "./schema";
import { getHashedPassword } from "../utils/bcrypt";

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

  return await db.insert(users).values([
    {
      name: "Michael Crowther",
      username: "michael-crowther",
      email: "md.crowther@yahoo.com",
      passwordHash,
      phone: "503-412-9620",
      dateOfBirth: randomDate(),
    },
    {
      name: "Billy Bob",
      username: "billy-bob",
      email: "billy.bob@yahoo.com",
      passwordHash,
      phone: "234-768-0945",
      dateOfBirth: randomDate(),
    },
  ]);
}

seed()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
