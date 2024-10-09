import bcrypt from "bcrypt";

export async function getHashedPassword(password: string) {
  const saltRounds = 13;
  return await bcrypt.hash(password, saltRounds);
}

export async function isPasswordMatch(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
