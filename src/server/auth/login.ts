"use server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { isPasswordMatch } from "@/server/utils/bcrypt";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { lucia } from "./lucia";
import { cookies } from "next/headers";

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1, "Password is required").trim(),
});

export async function handleLogin(formData: FormData) {
  "use server";

  const parsedData = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!parsedData.success) {
    throw new Error("Invalid cridentials");
  }

  const { email, password } = parsedData.data;

  const user = await db.query.users.findFirst({
    columns: { id: true, name: true, passwordHash: true },
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await isPasswordMatch(password, user.passwordHash);

  if (!isMatch) {
    throw new Error("Invalid cridentials");
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/");
  // return { message: `Hi, ${user.name}!` };
}
