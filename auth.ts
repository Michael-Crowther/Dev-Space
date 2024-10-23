import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./src/server/utils/zodSchemas";
import { eq } from "drizzle-orm";
import { db } from "./src/server/db";
import { users } from "./src/server/db/schema";
import { isPasswordMatch } from "./src/server/utils/bcrypt";
import NextAuth from "next-auth";

async function getUser(email: string) {
  try {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const isMatch = await isPasswordMatch(password, user.passwordHash);
          if (isMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  //this extends session with the userId
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
