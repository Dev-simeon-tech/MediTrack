// src/app/api/patients/[patientId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ patientId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "DOCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { patientId } = await params;

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        encounters: {
          orderBy: { date: "desc" },
          include: {
            doctor: { select: { id: true, name: true } },
            prescriptions: true,
          },
        },
        vitals: {
          orderBy: { date: "desc" },
        },
        documents: {
          orderBy: { uploadedAt: "desc" },
        },
        appointments: {
          orderBy: { date: "desc" },
          include: {
            doctor: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ patient });
  } catch (error) {
    console.error("Failed to fetch patient:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
