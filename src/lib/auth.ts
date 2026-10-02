import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createUserSession,
  getUserById,
  getUserSession,
  revokeUserSession,
} from "./db";
import {
  readSessionCookie,
  roleHomePath,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  sessionIsCurrent,
  signSession,
} from "./session";
import type { SessionUser, UserRole } from "./types";

export { SESSION_COOKIE, roleHomePath } from "./session";

export async function startSession(user: SessionUser): Promise<boolean> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const record = await createUserSession(user.id, expiresAt.toISOString());
  const token = await signSession({
    sid: record.id,
    role: user.role,
    exp: Math.floor(expiresAt.getTime() / 1000),
  });
  if (!token) {
    await revokeUserSession(record.id);
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
  return true;
}

export async function endSession(): Promise<void> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (raw) {
    const claims = await readSessionCookie(raw);
    if (claims) await revokeUserSession(claims.sid);
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const claims = await readSessionCookie(raw);
  if (!claims || !sessionIsCurrent(claims)) return null;

  const record = await getUserSession(claims.sid);
  if (!record || record.revokedAt) return null;
  if (new Date(record.expiresAt).getTime() <= Date.now()) return null;

  const user = await getUserById(record.userId);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(roles: UserRole[]): Promise<SessionUser> {
  const session = await requireSession();
  if (!roles.includes(session.role)) {
    redirect(roleHomePath(session.role));
  }
  return session;
}
