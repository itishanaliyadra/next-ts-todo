import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

export const runtime = "nodejs";

export const POST = async () => {
  const response = NextResponse.json({ success: true, data: { message: "Logged out" } }, { status: 200 });
  clearSessionCookie(response);
  return response;
};
