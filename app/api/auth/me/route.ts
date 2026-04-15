import { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { connectDB } from "@/lib/configs/dbConnection.config";
import { getAuthenticatedUserFromToken } from "@/lib/controllers/auth/session.controller";
import { jsonError, jsonSuccess, respondWithError } from "@/lib/utils/api";

export const runtime = "nodejs";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const user = await getAuthenticatedUserFromToken(token);

    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    return jsonSuccess(user);
  } catch (error) {
    return respondWithError(error);
  }
};
