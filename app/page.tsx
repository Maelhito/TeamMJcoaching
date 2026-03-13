import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  try {
    const session = await auth();
    redirect(session?.user ? "/dashboard" : "/login");
  } catch {
    // Si auth() échoue (ex: AUTH_SECRET manquant), on redirige vers login
    redirect("/login");
  }
}
