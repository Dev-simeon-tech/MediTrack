// src/app/api/patients/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "DOCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query")?.trim() || undefined; // name or hospital no.
  const condition = searchParams.get("condition")?.trim() || undefined; // chronic condition filter
  const sex = searchParams.get("sex") || undefined;
  const dateFromValue = searchParams.get("dateFrom");
  const dateToValue = searchParams.get("dateTo");
  const dateFrom = dateFromValue ? new Date(dateFromValue) : undefined;
  const dateTo = dateToValue ? new Date(dateToValue) : undefined;
  const validDateFrom =
    dateFrom && !Number.isNaN(dateFrom.getTime()) ? dateFrom : undefined;
  const validDateTo =
    dateTo && !Number.isNaN(dateTo.getTime()) ? dateTo : undefined;
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Number(searchParams.get("pageSize")) || 20);

  const allowedSortFields = ["name", "hospitalNo", "createdAt", "dob"];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const where: Prisma.PatientWhereInput = {
    AND: [
      query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { hospitalNo: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
      condition ? { chronicConditions: { has: condition } } : {},
      sex ? { sex: sex as "MALE" | "FEMALE" } : {},
      validDateFrom || validDateTo
        ? {
            encounters: {
              some: {
                date: {
                  ...(validDateFrom ? { gte: validDateFrom } : {}),
                  ...(validDateTo ? { lte: validDateTo } : {}),
                },
              },
            },
          }
        : {},
    ],
  };

  try {
    const [patients, total, patientsWithConditions] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: { [safeSortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          hospitalNo: true,
          name: true,
          dob: true,
          sex: true,
          phone: true,
          bloodGroup: true,
          allergies: true,
          chronicConditions: true,
          createdAt: true,
          encounters: {
            orderBy: { date: "desc" },
            take: 1,
            select: { date: true },
          },
        },
      }),
      prisma.patient.count({ where }),
      prisma.patient.findMany({ select: { chronicConditions: true } }),
    ]);

    const conditions = Array.from(
      new Set(
        patientsWithConditions.flatMap(
          ({ chronicConditions }) => chronicConditions,
        ),
      ),
    ).sort((a, b) => a.localeCompare(b));

    return NextResponse.json({
      patients: patients.map(({ encounters, ...patient }) => ({
        ...patient,
        lastVisit: encounters[0]?.date ?? null,
      })),
      conditions,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
