"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth-session";
import { patientSchema } from "@/schemas/patient.schema";

export type CreatePatientState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

// Generates something like MTK-2026-000042
async function generateHospitalNo() {
  const year = new Date().getFullYear();
  const count = await prisma.patient.count();
  const sequence = String(count + 1).padStart(6, "0");
  return `MTK-${year}-${sequence}`;
}

export async function createPatient(
  _prevState: CreatePatientState,
  formData: FormData,
): Promise<CreatePatientState> {
  const session = await requireRole("DOCTOR");

  const raw = {
    name: formData.get("name"),
    dob: formData.get("dob"),
    sex: formData.get("sex"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    emergencyName: formData.get("emergencyName"),
    emergencyPhone: formData.get("emergencyPhone"),
    bloodGroup: formData.get("bloodGroup") || undefined,
    allergies: JSON.parse((formData.get("allergies") as string) || "[]"),
    chronicConditions: JSON.parse(
      (formData.get("chronicConditions") as string) || "[]",
    ),
  };

  const parsed = patientSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  let patientId: string;

  try {
    const hospitalNo = await generateHospitalNo();

    const patient = await prisma.patient.create({
      data: {
        hospitalNo,
        name: data.name,
        dob: new Date(data.dob),
        sex: data.sex,
        phone: data.phone || null,
        address: data.address || null,
        emergencyName: data.emergencyName || null,
        emergencyPhone: data.emergencyPhone || null,
        bloodGroup: data.bloodGroup || null,
        allergies: data.allergies,
        chronicConditions: data.chronicConditions,
      },
    });

    patientId = patient.id;

    await prisma.auditLog.create({
      data: {
        tableName: "Patient",
        recordId: patient.id,
        userId: session.user.id,
        action: "CREATE",
        newValue: patient,
        patientId: patient.id,
      },
    });
  } catch (error) {
    console.error("Failed to create patient:", error);
    return { error: "Something went wrong. Please try again." };
  }

  redirect(`/patients/${patientId}`);
}
