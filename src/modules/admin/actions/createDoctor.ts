"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { doctorSchema } from "@/schemas/doctor.schema";
//hkG7XFy$EFoEPKK6diU2
export type CreateDoctorState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: { name: string; email: string };
};

export async function createDoctor(
  _previousState: CreateDoctorState,
  formData: FormData,
): Promise<CreateDoctorState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const parsed = doctorSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    medicalLicenseNo: formData.get("medicalLicenseNo"),
    specialization: formData.get("specialization"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    assignedUnit: formData.get("assignedUnit"),
    temporaryPassword: formData.get("temporaryPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  let createdUserId: string | undefined;

  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.temporaryPassword,
      },
    });
    createdUserId = result.user.id;

    await prisma.doctorProfile.create({
      data: {
        userId: result.user.id,
        phone: data.phone,
        medicalLicenseNo: data.medicalLicenseNo,
        specialization: data.specialization,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender || null,
        assignedUnit: data.assignedUnit || null,
      },
    });
  } catch (error) {
    if (createdUserId) {
      try {
        await prisma.user.delete({ where: { id: createdUserId } });
      } catch (cleanupError) {
        console.error(
          "Failed to clean up an incomplete doctor account:",
          cleanupError,
        );
      }
    }

    console.error("Failed to create doctor account:", error);
    return {
      error:
        "Could not create the account. Check that the email and license number are not already in use.",
    };
  }

  revalidatePath("/doctors");
  return { success: { name: data.name, email: data.email } };
}
