export const { MONGO_URI } = process.env;
export const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
export const AUTH_COOKIE_NAME = "todo_atlas_session";
export const DEFAULT_AUTH_EMAIL = process.env.DEFAULT_AUTH_EMAIL ?? "demo@todoatlas.app";
export const DEFAULT_AUTH_PASSWORD = process.env.DEFAULT_AUTH_PASSWORD ?? "Password123!";
export const DEFAULT_AUTH_NAME = process.env.DEFAULT_AUTH_NAME ?? "Demo User";
