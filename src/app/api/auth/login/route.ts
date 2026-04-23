import { NextResponse } from "next/server";
import { findDemoUser } from "@/lib/auth/demo-users";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/constants";
import { encodeSessionPayload } from "@/lib/auth/cookie-payload";
import type { SessionPayload } from "@/lib/auth/types";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSONの形式が不正です" }, { status: 400 });
  }

  const email = body.email;
  const password = body.password;
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "メールアドレスまたはパスワードが入力されていません" }, { status: 400 });
  }

  const user = findDemoUser(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "メールアドレスまたはパスワードが正しくありません" },
      { status: 401 }
    );
  }

  const payload: SessionPayload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const token = encodeSessionPayload(payload);

  const res = NextResponse.json({ role: user.role, name: user.name });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
