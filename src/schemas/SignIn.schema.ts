import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email("Enter a valid email address").min(1, "Email is required"),
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type SignInInput = z.infer<typeof SignInSchema>;
