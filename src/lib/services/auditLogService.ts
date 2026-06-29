import { eq, desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { adminActionLogs, users, type AdminActionLog } from "@/lib/db/schema"
import type { ActionType } from "@/types"

export async function logAction(adminId: number, actionType: ActionType, targetUserId: number): Promise<AdminActionLog> {
  const [log] = await db
    .insert(adminActionLogs)
    .values({ adminId, actionType, targetUserId })
    .returning()
  return log
}

export async function listLogs(limit = 100): Promise<AdminActionLog[]> {
  return db.select().from(adminActionLogs).orderBy(desc(adminActionLogs.timestamp)).limit(limit)
}

export interface AuditLogWithName {
  id: number
  adminId: number | null
  adminName: string | null
  actionType: string
  targetUserId: number | null
  targetName: string | null
  timestamp: Date
}

/**
 * List recent audit logs with admin and target usernames resolved via joins.
 * Names may be null if the user was deleted (FK is ON DELETE SET NULL).
 */
export async function listLogsWithNames(limit = 50): Promise<AuditLogWithName[]> {
  const rows = await db
    .select({
      id: adminActionLogs.id,
      adminId: adminActionLogs.adminId,
      adminName: users.username,
      actionType: adminActionLogs.actionType,
      targetUserId: adminActionLogs.targetUserId,
      targetName: users.username,
      timestamp: adminActionLogs.timestamp,
    })
    .from(adminActionLogs)
    .leftJoin(users, eq(adminActionLogs.adminId, users.id))
    .orderBy(desc(adminActionLogs.timestamp))
    .limit(limit)

  // The single join above aliases both admin and target to the same users.username.
  // To resolve the target name separately, run a second lightweight lookup.
  const targetIds = [...new Set(rows.map((r) => r.targetUserId).filter((x): x is number => x != null))]
  const targetNames = new Map<number, string | null>()
  if (targetIds.length) {
    const targets = await db.select({ id: users.id, username: users.username }).from(users)
    for (const t of targets) targetNames.set(t.id, t.username)
  }

  return rows.map((r) => ({
    id: r.id,
    adminId: r.adminId,
    adminName: r.adminName,
    actionType: r.actionType,
    targetUserId: r.targetUserId,
    targetName: r.targetUserId ? (targetNames.get(r.targetUserId) ?? null) : null,
    timestamp: r.timestamp,
  }))
}