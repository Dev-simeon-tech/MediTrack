import { requireRole } from "@/lib/auth-session";

export default async function DoctorAppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("DOCTOR");
  return children;
}
