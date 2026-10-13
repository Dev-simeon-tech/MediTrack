import { z } from "zod";

const prescriptionSchema = z.object({
  drug: z.string().min(1, "Drug name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  duration: z.string().min(1, "Duration is required"),
});

export const encounterSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().optional(),
  category: z.enum(["CONSULTATION", "FOLLOW_UP", "URGENT_TRIAGE", "PROCEDURE"]),

  complaint: z.string().min(2, "Complaint is required"),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),

  // vitals captured during this visit — all optional since not every visit needs all of them
  bp: z.string().optional(),
  temp: z.coerce.number().positive().optional(),
  weight: z.coerce.number().positive().optional(),
  height: z.coerce.number().positive().optional(),

  prescriptions: z.array(prescriptionSchema).default([]),
});

export type EncounterInput = z.infer<typeof encounterSchema>;
