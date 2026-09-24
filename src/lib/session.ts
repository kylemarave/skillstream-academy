import type { SessionUser } from "./types";
export { destinationAfterAuth, roleHomePath, rolePrefix } from "./roleHome";

export const SESSION_COOKIE = "ssa_session";

export function encodeSession(user: SessionUser): string {
  return Buffer.from(JSON.stringify(user)).toString("base64url");
}

export function decodeSession(value: string): SessionUser | null {
  try {
    const json = Buffer.from(value, "base64url").toString("utf-8");
    return JSON.parse(json) as SessionUser;
  } catch {
    return null;
  }
}

