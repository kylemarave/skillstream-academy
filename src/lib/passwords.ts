import bcrypt from "bcryptjs";

const ROUNDS = 10;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  if (!password || !passwordHash.startsWith("$2")) return Promise.resolve(false);
  return bcrypt.compare(password, passwordHash);
}
