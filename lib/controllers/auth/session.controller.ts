import { AccountModel } from "@/lib/models/account.model";
import type { AuthenticatedUser } from "@/lib/types/auth";
import { verifySessionToken } from "@/lib/auth/jwt";

export const getAuthenticatedUserFromToken = async (token: string | undefined) => {
  if (!token) {
    return null;
  }

  const session = verifySessionToken(token);

  if (!session) {
    return null;
  }

  const user = await AccountModel.findById(session.userId).lean();

  if (!user) {
    return null;
  }

  const authenticatedUser: AuthenticatedUser = {
    _id: String(user._id),
    email: user.email,
    name: user.name,
  };

  return authenticatedUser;
};
