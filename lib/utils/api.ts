import { NextResponse } from "next/server";
import { HttpError } from "@/lib/errors/http-error";

type SuccessPayload<T> = {
  success: true;
  data: T;
};

type ErrorPayload = {
  success: false;
  message: string;
};

export const jsonSuccess = <T>(data: T, status = 200) => {
  return NextResponse.json<SuccessPayload<T>>({ success: true, data }, { status });
};

export const jsonError = (message: string, status = 500) => {
  return NextResponse.json<ErrorPayload>({ success: false, message }, { status });
};

export const getStatusCode = (error: unknown) => {
  if (error instanceof HttpError) {
    return error.statusCode;
  }

  if (error instanceof Error) {
    if (error.name === "AuthError") {
      return 401;
    }

    if (error.name === "ValidationError") {
      return 400;
    }

    if (error.name === "CastError") {
      return 400;
    }
  }

  return 500;
};

export const respondWithError = (error: unknown, fallbackMessage = "Internal server error") => {
  const message = error instanceof Error && error.message ? error.message : fallbackMessage;
  return jsonError(message, getStatusCode(error));
};
