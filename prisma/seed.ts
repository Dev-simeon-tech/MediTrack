import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (existingAdmin) {
    console.log("An admin already exists. Skipping seed.");
    return;
  }

  const result = await auth.api.signUpEmail({
    body: {
      name: "System Admin",
      email: "admin@meditrack.com",
      password: "123456!!", // you'll change this on first login
    },
  });

  await prisma.user.update({
    where: { id: result.user.id },
    data: { role: "ADMIN", mustChangePassword: true },
  });

  console.log("First admin created:", result.user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
