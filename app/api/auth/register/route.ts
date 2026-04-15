import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/configs/dbConnection.config";
import { createAccount } from "@/lib/account/controllers/create.controller";
import { loginAccount } from "@/lib/account/controllers/login.controller";
import { jsonError, respondWithError } from "@/lib/utils/api";
import { readJsonBody } from "@/lib/utils/request";
import { setSessionCookie } from "@/lib/auth/session";
import { AccountModel } from "@/lib/models/account.model";

export const runtime = "nodejs";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await readJsonBody<RegisterBody>(request);

    if (!body?.name || !body.email || !body.password) {
      return jsonError("Name, email and password are required.", 400);
    }

    const normalizedEmail = body.email.trim().toLowerCase();
    const existingAccount = await AccountModel.findOne({ email: normalizedEmail }).lean();

    if (existingAccount) {
      return jsonError("An account with this email already exists.", 409);
    }

    await createAccount({
      name: body.name,
      email: normalizedEmail,
      password: body.password,
    });

    const result = await loginAccount({
      email: normalizedEmail,
      password: body.password,
    });

    if (!result) {
      return jsonError("Registration failed.", 500);
    }

    const response = NextResponse.json({ success: true, data: result.user }, { status: 201 });
    setSessionCookie(response, result.token);
    return response;
  } catch (error) {
    return respondWithError(error);
  }
};
