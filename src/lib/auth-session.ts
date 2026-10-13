import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  return session;
}

export async function requireRole(role: "ADMIN" | "DOCTOR") {
  const session = await requireSession();
  if (session.user.role !== role) {
    redirect(session.user.role === "ADMIN" ? "/doctors" : "/dashboard");
  }
  return session;
}
