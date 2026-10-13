"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-session";
import { appointmentSchema } from "@/schemas/Appointment.schema";

export type CreateAppointmentState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

export async function createAppointment(
  _previousState: CreateAppointmentState,
  formData: FormData,
): Promise<CreateAppointmentState> {
  const session = await requireRole("DOCTOR");

  const parsed = appointmentSchema.safeParse({
    patientId: formData.get("patientId"),
    date: formData.get("date"),
    reason: formData.get("reason"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const patient = await prisma.patient.findUnique({
    where: { id: data.patientId },
    select: { id: true },
  });

  if (!patient) return { error: "The selected patient could not be found." };

  try {
    await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.create({
        data: {
          patientId: data.patientId,
          doctorId: session.user.id,
          date: new Date(data.date),
          reason: data.reason,
        },
        select: { id: true, date: true, reason: true, status: true },
      });

      await tx.auditLog.create({
        data: {
          tableName: "Appointment",
          recordId: appointment.id,
          userId: session.user.id,
          action: "CREATE",
          patientId: data.patientId,
          newValue: {
            date: appointment.date.toISOString(),
            reason: appointment.reason,
            status: appointment.status,
          },
        },
      });
    });
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return { error: "Unable to schedule this appointment. Please try again." };
  }

  revalidatePath("/appointments");
  revalidatePath(`/patients/${data.patientId}`);
  return { success: true };
}
