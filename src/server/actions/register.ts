"use server";
import { z, ZodError } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { getHashedPassword } from "../utils/bcrypt";
import { LibsqlError } from "@libsql/client";

const registerSchema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  email: z.string().trim().email().toLowerCase(),
  displayName: z
    .string()
    .max(20, "Display name must be 20 characters or less")
    .trim(),
  username: z.string().max(20, "Username must be 20 characters or less").trim(),
  password: z.string().min(1).trim(),
});

export async function handleRegister(formData: FormData) {
  "use server";

  try {
    const data = registerSchema.parse(Object.fromEntries(formData.entries()));

    const { firstName, lastName, email, displayName, username, password } =
      data;
    const fullName = firstName + " " + lastName;
    const passwordHash = await getHashedPassword(password);

    await db.insert(users).values({
      name: fullName,
      email,
      displayName,
      username,
      passwordHash,
      dateOfBirth: new Date(),
    });

    return { message: "Account was successfully created" };
  } catch (error) {
    if (error instanceof ZodError) {
      const {
        formErrors: { fieldErrors },
      } = error;

      return { zodErrors: fieldErrors };
    }
    if (error instanceof LibsqlError) {
      return { sqlError: { error: error.name, message: error.message } };
    }
  }
}
