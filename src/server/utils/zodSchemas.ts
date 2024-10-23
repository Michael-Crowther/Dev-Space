//put all zod schemas here, including user update and creates, login and register, etc

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1, "Password is required").trim(),
});
