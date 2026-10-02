import { NextResponse } from "next/server";
import { startSession } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/passwords";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    portal?: string;
  };
  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const user = await getUserByEmail(email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  if (body.portal === "admin" && user.role !== "admin") {
    return NextResponse.json(
      {
        error:
          "This page is for admin accounts. Sign in as a student or instructor instead.",
      },
      { status: 403 },
    );
  }

  const started = await startSession({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });
  if (!started) {
    return NextResponse.json(
      { error: "Sign-in is not available right now." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    role: user.role,
    name: `${user.firstName} ${user.lastName}`,
  });
}
