"use server";
import { APIError } from "better-auth/api";
import prisma from "@/lib/prisma";
import { changePasswordSchema } from "@/schemas/ChangePassword.schema";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type ChangePasswordState = {
  error?: string;
  fieldErrors?: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
};

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  // Real auth check: never trust that the page already verified it
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: true, // logs out any other device using the old password
      },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) {
      return {
        fieldErrors: { currentPassword: ["Current password is incorrect"] },
      };
    }
    throw error;
  }

  // Only clear the flag after the password change succeeded
  await prisma.user.update({
    where: { id: session.user.id },
    data: { mustChangePassword: false },
  });

  redirect(
    session.user.role === "ADMIN" ? "/doctors" : "/dashboard",
    "replace",
  );
}
