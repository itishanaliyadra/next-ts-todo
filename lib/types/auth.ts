export type AuthenticatedUser = {
  _id: string;
  name: string;
  email: string;
};

export type AuthSession = {
  userId: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
};
