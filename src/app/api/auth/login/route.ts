import { NextResponse } from "next/server";
import { startSession } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db";

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
  if (!user || user.password !== password) {
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

  await startSession({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });

  return NextResponse.json({
    role: user.role,
    name: `${user.firstName} ${user.lastName}`,
  });
}
