import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/configs/dbConnection.config";
import { loginAccount } from "@/lib/account/controllers/login.controller";
import { jsonError, respondWithError } from "@/lib/utils/api";
import { readJsonBody } from "@/lib/utils/request";
import { setSessionCookie } from "@/lib/auth/session";

export const runtime = "nodejs";

type LoginBody = {
  email?: string;
  password?: string;
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await readJsonBody<LoginBody>(request);

    if (!body?.email || !body.password) {
      return jsonError("Email and password are required.", 400);
    }

    const result = await loginAccount({
      email: body.email,
      password: body.password,
    });

    if (!result) {
      return jsonError("Invalid email or password.", 401);
    }

    const response = NextResponse.json({ success: true, data: result.user }, { status: 200 });
    setSessionCookie(response, result.token);

    return response;
  } catch (error) {
    return respondWithError(error);
  }
};
