import { AccountModel } from "@/lib/models/account.model";
import { hashPassword } from "@/lib/auth/password";

type CreateAccountInput = {
  name: string;
  email: string;
  password: string;
};

export const createAccount = async (input: CreateAccountInput) => {
  return AccountModel.create({
    name: input.name,
    email: input.email.trim().toLowerCase(),
    password: hashPassword(input.password),
  });
};
