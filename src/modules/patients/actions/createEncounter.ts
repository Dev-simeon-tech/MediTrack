"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-session";
import { encounterSchema } from "@/schemas/Encounter.schema";

export type CreateEncounterState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: { encounterId: string };
};

export async function createEncounter(
  _prevState: CreateEncounterState,
  formData: FormData,
): Promise<CreateEncounterState> {
  const session = await requireRole("DOCTOR");

  const raw = {
    patientId: formData.get("patientId"),
    appointmentId: formData.get("appointmentId") || undefined,
    category: formData.get("category") || "CONSULTATION",
    complaint: formData.get("complaint"),
    diagnosis: parseDiagnosis(formData.get("diagnosis")),
    notes: formData.get("notes") || undefined,
    bp: formData.get("bp") || undefined,
    temp: formData.get("temp") || undefined,
    weight: formData.get("weight") || undefined,
    height: formData.get("height") || undefined,
    prescriptions: parsePrescriptions(formData.get("prescriptions")),
  };

  const parsed = encounterSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  // Confirm the appointment (if any) actually belongs to this patient before trusting it
  if (data.appointmentId) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: data.appointmentId },
      select: {
        patientId: true,
        doctorId: true,
        status: true,
        encounter: { select: { id: true } },
      },
    });

    if (!appointment || appointment.patientId !== data.patientId) {
      return { error: "Invalid appointment for this patient" };
    }
    if (appointment.doctorId !== session.user.id) {
      return { error: "This appointment is assigned to another doctor" };
    }
    if (appointment.status !== "SCHEDULED") {
      return {
        error: "Only scheduled appointments can be linked to an encounter",
      };
    }
    if (appointment.encounter) {
      return { error: "This appointment already has an encounter recorded" };
    }
  }

  let encounterId: string;

  try {
    encounterId = await prisma.$transaction(async (tx) => {
      const encounter = await tx.encounter.create({
        data: {
          patientId: data.patientId,
          doctorId: session.user.id,
          appointmentId: data.appointmentId || null,
          category: data.category,
          complaint: data.complaint,
          diagnosis: data.diagnosis || null,
          notes: data.notes || null,
          prescriptions: {
            create: data.prescriptions.map((p) => ({
              drug: p.drug,
              dosage: p.dosage,
              duration: p.duration,
            })),
          },
        },
        include: { prescriptions: true },
      });

      // Only create a vitals row if at least one vital was actually entered
      const hasVitals = data.bp || data.temp || data.weight || data.height;
      if (hasVitals) {
        await tx.vital.create({
          data: {
            patientId: data.patientId,
            bp: data.bp || null,
            temp: data.temp ?? null,
            weight: data.weight ?? null,
            height: data.height ?? null,
          },
        });
      }

      if (data.appointmentId) {
        await tx.appointment.update({
          where: { id: data.appointmentId },
          data: { status: "COMPLETED" },
        });
      }

      await tx.auditLog.create({
        data: {
          tableName: "Encounter",
          recordId: encounter.id,
          userId: session.user.id,
          action: "CREATE",
          newValue: encounter,
          patientId: data.patientId,
        },
      });

      return encounter.id;
    });
  } catch (error) {
    console.error("Failed to create encounter:", error);
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/patients/${data.patientId}`);
  return { success: { encounterId } };
}

function parseDiagnosis(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string" || !value) return undefined;

  try {
    const parsed: unknown = JSON.parse(value);
    if (
      Array.isArray(parsed) &&
      parsed.every((item): item is string => typeof item === "string")
    ) {
      return parsed.join("; ") || undefined;
    }
  } catch {
    return value;
  }

  return value;
}

function parsePrescriptions(value: FormDataEntryValue | null): unknown {
  if (typeof value !== "string" || !value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    return parsed;
  } catch {
    return null;
  }
}
