import { cookies } from "next/headers";
import LoginForm from "@/components/auth/login-form";
import TodoBoard from "@/components/todo-board";
import { connectDB } from "@/lib/configs/dbConnection.config";
import { getAuthenticatedUserFromToken } from "@/lib/controllers/auth/session.controller";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

export default async function Home() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = await getAuthenticatedUserFromToken(token);

  if (!user) {
    return <LoginForm />;
  }

  return <TodoBoard user={user} />;
}
