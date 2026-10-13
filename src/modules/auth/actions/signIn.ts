// src/actions/auth.ts
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { SignInSchema } from "@/schemas/SignIn.schema";

export type SignInState = {
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

export async function signInAction(
  _prevState: SignInState,
  formData: FormData,
  redirectUrl: string | undefined,
): Promise<SignInState> {
  const parsed = SignInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let mustChangePassword = false;
  let role = "DOCTOR";

  try {
    const result = await auth.api.signInEmail({
      body: parsed.data,
      headers: await headers(),
    });
    mustChangePassword = Boolean(result.user.mustChangePassword);
    role = result.user.role;
  } catch (error) {
    if (error instanceof APIError) {
      // Same message for wrong email or wrong password, so you don't reveal which accounts exist
      return { error: "Invalid email or password" };
    }
    throw error;
  }

  // redirect() works by throwing, so it must stay outside the try/catch
  redirect(
    mustChangePassword
      ? "/change-password"
      : role === "ADMIN"
        ? "/doctors"
        : (redirectUrl ?? "/dashboard"),
    "replace",
  );
}
