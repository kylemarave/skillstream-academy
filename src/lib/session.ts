import type { UserRole } from "./types";

export { destinationAfterAuth, roleHomePath, rolePrefix } from "./roleHome";

export const SESSION_COOKIE = "ssa_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type SessionClaims = {
  sid: string;
  role: UserRole;
  exp: number;
};

function secretKey(): ArrayBuffer | null {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret) return null;
  const bytes = new TextEncoder().encode(secret);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function toBase64Url(data: Uint8Array | string): string {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(value: string): string {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function sign(payload: string): Promise<string | null> {
  const raw = secretKey();
  if (!raw) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    raw,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(new Uint8Array(mac));
}

function signaturesMatch(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function signSession(claims: SessionClaims): Promise<string | null> {
  const payload = toBase64Url(JSON.stringify(claims));
  const mac = await sign(payload);
  if (!mac) return null;
  return `${payload}.${mac}`;
}

export async function readSessionCookie(value: string): Promise<SessionClaims | null> {
  const splitAt = value.lastIndexOf(".");
  if (splitAt <= 0) return null;
  const payload = value.slice(0, splitAt);
  const mac = value.slice(splitAt + 1);
  const expected = await sign(payload);
  if (!expected || !signaturesMatch(mac, expected)) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as Partial<SessionClaims>;
    if (typeof parsed.sid !== "string" || !parsed.sid) return null;
    if (
      parsed.role !== "student" &&
      parsed.role !== "instructor" &&
      parsed.role !== "admin"
    ) {
      return null;
    }
    if (typeof parsed.exp !== "number" || !Number.isFinite(parsed.exp)) return null;
    return { sid: parsed.sid, role: parsed.role, exp: parsed.exp };
  } catch {
    return null;
  }
}

export function sessionIsCurrent(claims: SessionClaims, now = Date.now()): boolean {
  return claims.exp * 1000 > now;
}
