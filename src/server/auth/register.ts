"use server";

import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { getHashedPassword } from "../utils/bcrypt";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  email: z.string().trim().email().toLowerCase(),
  displayName: z.string().trim(),
  username: z.string().trim(),
  password: z.string().min(1, "Password is required").trim(),
});

export async function handleRegister(formData: FormData) {
  "use server";

  const parsedData = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!parsedData.success) {
    throw new Error("Invalid form fields");
  }

  const { firstName, lastName, email, displayName, username, password } =
    parsedData.data;
  const fullName = firstName + " " + lastName;
  const now = new Date();
  const passwordHash = await getHashedPassword(password);

  await db.insert(users).values({
    name: fullName,
    email,
    displayName,
    username,
    passwordHash,
    dateOfBirth: now,
    createdAt: now,
    updatedAt: now,
  });

  redirect("/login");
  //   return { message: "Your account was successfully created" };
}
