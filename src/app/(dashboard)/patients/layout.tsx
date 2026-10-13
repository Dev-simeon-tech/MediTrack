import { requireRole } from "@/lib/auth-session";

export default async function DoctorPatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("DOCTOR");
  return children;
}
