"use server";
import { ZodError } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { getHashedPassword } from "../utils/bcrypt";
import { LibsqlError } from "@libsql/client";
import { registerSchema } from "../utils/zodSchemas";

export async function register(formData: FormData) {
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
