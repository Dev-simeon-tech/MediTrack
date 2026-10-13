import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import {
  AuditPage,
  type AuditLogPageData,
} from "@/modules/admin/pages/auditPage";

const PAGE_SIZE = 25;

export default async function AuditRoute({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query =
    typeof params.q === "string" ? params.q.trim().slice(0, 120) : "";
  const action = typeof params.action === "string" ? params.action : "";
  const entity = typeof params.entity === "string" ? params.entity : "";
  const requestedPage = Number(params.page);
  const safePage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const searchConditions: Prisma.AuditLogWhereInput[] = query
    ? [
        { action: { contains: query, mode: "insensitive" } },
        { tableName: { contains: query, mode: "insensitive" } },
        { recordId: { contains: query, mode: "insensitive" } },
        { user: { is: { name: { contains: query, mode: "insensitive" } } } },
        { user: { is: { email: { contains: query, mode: "insensitive" } } } },
        { patient: { is: { name: { contains: query, mode: "insensitive" } } } },
        {
          patient: {
            is: { hospitalNo: { contains: query, mode: "insensitive" } },
          },
        },
      ]
    : [];
  const where: Prisma.AuditLogWhereInput = {
    ...(action ? { action } : {}),
    ...(entity ? { tableName: entity } : {}),
    ...(searchConditions.length ? { OR: searchConditions } : {}),
  };
  const since = new Date();
  since.setHours(since.getHours() - 24);

  const [filteredCount, total, last24Hours, actionGroups, entityGroups] =
    await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.count(),
      prisma.auditLog.count({ where: { timestamp: { gte: since } } }),
      prisma.auditLog.groupBy({
        by: ["action"],
        _count: { _all: true },
      }),
      prisma.auditLog.groupBy({
        by: ["tableName"],
        _count: { _all: true },
        orderBy: { tableName: "asc" },
      }),
    ]);

  const totalPages = Math.ceil(filteredCount / PAGE_SIZE);
  const page = Math.min(safePage, Math.max(totalPages, 1));
  const records = await prisma.auditLog.findMany({
    where,
    orderBy: [{ timestamp: "desc" }, { id: "desc" }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      timestamp: true,
      tableName: true,
      recordId: true,
      action: true,
      oldValue: true,
      newValue: true,
      user: { select: { name: true, email: true, role: true } },
      patient: { select: { name: true, hospitalNo: true } },
    },
  });

  const data: AuditLogPageData = {
    logs: records.map((record) => ({
      id: record.id,
      timestamp: record.timestamp.toISOString(),
      tableName: record.tableName,
      recordId: record.recordId,
      action: record.action,
      oldValue:
        record.oldValue === null ? null : JSON.stringify(record.oldValue),
      newValue:
        record.newValue === null ? null : JSON.stringify(record.newValue),
      actor: record.user,
      patient: record.patient,
    })),
    stats: {
      total,
      last24Hours,
      creates:
        actionGroups.find((group) => group.action === "CREATE")?._count._all ??
        0,
      changes: actionGroups
        .filter(
          (group) => group.action === "UPDATE" || group.action === "DELETE",
        )
        .reduce((count, group) => count + group._count._all, 0),
    },
    filters: { query, action, entity, page },
    actions: actionGroups.map((group) => group.action).sort(),
    entities: entityGroups.map((group) => group.tableName),
    totalPages,
    filteredCount,
  };

  return <AuditPage {...data} />;
}
