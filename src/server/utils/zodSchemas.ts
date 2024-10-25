import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1, "Password is required").trim(),
});

export const registerSchema = z.object({
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

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(1, "Required"),
  confirmNewPassword: z.string().min(1, "Required"),
});

export const updateDisplayNameSchema = z.object({
  name: z.string().max(20, "Display name must be 20 characters or less"),
});

export const updateUsernameSchema = z.object({
  name: z
    .string()
    .min(1, "Username is required")
    .max(20, "Username must be 20 characters or less")
    .trim(),
});
