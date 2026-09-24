import { NextResponse } from "next/server";
import { startSession } from "@/lib/auth";
import { registerUser } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };

  if (body.role !== "student" && body.role !== "instructor") {
    return NextResponse.json(
      { error: "Choose a student or instructor account." },
      { status: 400 },
    );
  }

  const result = await registerUser({
    email: body.email ?? "",
    password: body.password ?? "",
    firstName: body.firstName ?? "",
    lastName: body.lastName ?? "",
    role: body.role,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { user } = result;
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
