import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserById } from "./db";
import {
  decodeSession,
  encodeSession,
  roleHomePath,
  SESSION_COOKIE,
} from "./session";
import type { SessionUser, UserRole } from "./types";

export { encodeSession, SESSION_COOKIE, roleHomePath } from "./session";

export async function startSession(user: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const session = decodeSession(raw);
  if (!session) return null;

  const user = await getUserById(session.id);
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
