import { createHmac } from "crypto";
import { JWT_SECRET } from "@/lib/configs/environment.config";
import type { AuthSession } from "@/lib/types/auth";

type JwtHeader = {
  alg: "HS256";
  typ: "JWT";
};

const header: JwtHeader = {
  alg: "HS256",
  typ: "JWT",
};

const base64UrlEncode = (value: string) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const base64UrlDecode = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
};

export const signSessionToken = (payload: Omit<AuthSession, "iat" | "exp">, ttlSeconds = 60 * 60 * 24 * 7) => {
  const now = Math.floor(Date.now() / 1000);
  const session: AuthSession = {
    ...payload,
    iat: now,
    exp: now + ttlSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(session));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac("sha256", JWT_SECRET).update(data).digest("base64url");

  return `${data}.${signature}`;
};

export const verifySessionToken = (token: string) => {
  const [encodedHeader, encodedPayload, signature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !signature) {
    return null;
  }

  try {
    const data = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = createHmac("sha256", JWT_SECRET).update(data).digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    const parsedHeader = JSON.parse(base64UrlDecode(encodedHeader)) as JwtHeader;
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AuthSession;

    if (parsedHeader.alg !== "HS256" || parsedHeader.typ !== "JWT") {
      return null;
    }

    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) {
      return null;
    }

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.iat !== "number"
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};
