import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, autoSignIn: false },
  user: {
    additionalFields: {
      role: { type: "string", input: false },
      mustChangePassword: { type: "boolean", input: false },
    },
  },
  plugins: [nextCookies()],
});
