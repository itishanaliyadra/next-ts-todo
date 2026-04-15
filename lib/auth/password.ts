import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const HASH_KEY_LENGTH = 64;
const PASSWORD_PREFIX = "scrypt";

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, HASH_KEY_LENGTH).toString("hex");
  return `${PASSWORD_PREFIX}$${salt}$${hash}`;
};

export const verifyPassword = (password: string, storedHash: string) => {
  const [prefix, salt, hash] = storedHash.split("$");

  if (prefix !== PASSWORD_PREFIX || !salt || !hash) {
    return false;
  }

  const derivedHash = scryptSync(password, salt, HASH_KEY_LENGTH);
  const expectedHash = Buffer.from(hash, "hex");

  if (derivedHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(derivedHash, expectedHash);
};
