import { z } from "zod";

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Choose a patient"),
  date: z.string().datetime("Choose a valid appointment date and time"),
  reason: z
    .string()
    .trim()
    .min(2, "Enter an appointment reason")
    .max(240, "Reason must be 240 characters or fewer"),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
