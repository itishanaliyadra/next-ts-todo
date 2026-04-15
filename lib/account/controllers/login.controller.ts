import { verifyPassword } from "@/lib/auth/password";
import { signSessionToken } from "@/lib/auth/jwt";
import { AccountModel } from "@/lib/models/account.model";
import type { AuthenticatedUser } from "@/lib/types/auth";

type LoginInput = {
  email: string;
  password: string;
};

export const loginAccount = async ({ email, password }: LoginInput) => {
  const account = await AccountModel.findOne({ email: email.trim().toLowerCase() }).select("+password");

  if (!account) {
    return null;
  }

  if (!verifyPassword(password, account.password)) {
    return null;
  }

  const user: AuthenticatedUser = {
    _id: String(account._id),
    name: account.name,
    email: account.email,
  };

  const token = signSessionToken({
    userId: user._id,
    email: user.email,
    name: user.name,
  });

  return { token, user };
};
