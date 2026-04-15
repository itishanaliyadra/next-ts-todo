import type { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/constants";
import { AuthError } from "@/lib/errors/http-error";
import { verifySessionToken } from "@/lib/auth/jwt";
import type { AuthSession, AuthenticatedUser } from "@/lib/types/auth";
import { AccountModel } from "@/lib/models/account.model";

type CookieSource = {
  get(name: string): { value: string } | undefined;
};

const toAuthenticatedUser = (session: AuthSession): AuthenticatedUser => ({
  _id: session.userId,
  name: session.name,
  email: session.email,
});

export const getSessionFromCookies = (cookies: CookieSource) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
};

export const getAuthenticatedUser = async (cookies: CookieSource) => {
  const session = getSessionFromCookies(cookies);

  if (!session) {
    return null;
  }

  const user = await AccountModel.findById(session.userId).lean();

  if (!user) {
    return null;
  }

  return toAuthenticatedUser(session);
};

export const requireAuthenticatedUser = async (request: NextRequest) => {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    throw new AuthError();
  }

  const session = verifySessionToken(token);

  if (!session) {
    throw new AuthError();
  }

  const user = await AccountModel.findById(session.userId).lean();

  if (!user) {
    throw new AuthError();
  }

  return toAuthenticatedUser(session);
};

export const setSessionCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
};

export const clearSessionCookie = (response: NextResponse) => {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
};
