import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date")
    .refine(
      (val) => new Date(val) <= new Date(),
      "Date of birth cannot be in the future",
    ),

  sex: z.enum(["MALE", "FEMALE"], {
    message: "Select a sex",
  }),

  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),

  address: z.string().optional(),

  emergencyName: z.string().optional(),

  emergencyPhone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),

  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),

  allergies: z.array(z.string().min(1)).default([]),

  chronicConditions: z.array(z.string().min(1)).default([]),
});

export type PatientInput = z.infer<typeof patientSchema>;
