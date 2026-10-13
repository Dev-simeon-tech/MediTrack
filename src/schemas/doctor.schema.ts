import { z } from "zod";

export const doctorSchema = z.object({
  name: z.string().trim().min(2, "Enter the doctor's full name"),
  email: z
    .string()
    .trim()
    .email("Enter a valid hospital email address")
    .toLowerCase(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
  medicalLicenseNo: z
    .string()
    .trim()
    .min(3, "Enter a valid medical license number")
    .max(80),
  specialization: z.string().trim().min(2, "Select a specialization"),
  dateOfBirth: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || !Number.isNaN(Date.parse(value)),
      "Enter a valid date of birth",
    )
    .refine(
      (value) => !value || new Date(value) <= new Date(),
      "Date of birth cannot be in the future",
    ),
  gender: z
    .enum(["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY"])
    .optional()
    .or(z.literal("")),
  assignedUnit: z.string().trim().max(120).optional().or(z.literal("")),
  temporaryPassword: z
    .string()
    .min(6, "Generate a temporary password with at least 6 characters")
    .max(128),
});

export type DoctorInput = z.infer<typeof doctorSchema>;
