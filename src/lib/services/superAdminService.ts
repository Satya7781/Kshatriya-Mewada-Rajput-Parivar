import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { createUser, listAdmins, updateUserRole, deleteUser, countUsers, countApprovedUsers, countAdmins, countSuperAdmins, getUserById } from "./userService"
import { listLogs, listLogsWithNames, type AuditLogWithName } from "./auditLogService"
import { listPendingProfiles } from "./profileService"
import type { SuperAdminStats, User } from "@/types"

export async function getSuperAdminStats(): Promise<SuperAdminStats> {
  const totalUsers = await countUsers()
  const approvedUsers = await countApprovedUsers()
  const pending = await listPendingProfiles()
  const totalAdmins = await countAdmins()
  const logs = await listLogs(1000)

  return {
    totalUsers,
    approvedUsers,
    pendingApprovals: pending.length,
    totalAdmins,
    totalActions: logs.length,
    approvedCount: logs.filter((l) => l.actionType === "APPROVE").length,
    rejectedCount: logs.filter((l) => l.actionType === "REJECT").length,
    deletedCount: logs.filter((l) => l.actionType === "DELETE").length,
  }
}

export async function getAdminAccounts(): Promise<User[]> {
  return listAdmins()
}

export async function getAuditLogs(limit = 50): Promise<AuditLogWithName[]> {
  return listLogsWithNames(limit)
}

export async function createAdminAccount(phone: string, username: string, password: string): Promise<User> {
  return createUser({ phone, username, password, role: "ADMIN", isApproved: true })
}

/**
 * Demote an admin to USER. Refuses if the target is not an admin, or if the
 * target is the last remaining SUPER_ADMIN (would lock everyone out of
 * super-admin functions permanently).
 */
export async function demoteAdminToUser(userId: number): Promise<User> {
  const target = await getUserById(userId)
  if (!target) {
    throw new Error("Target user does not exist.")
  }
  if (target.role !== "ADMIN" && target.role !== "SUPER_ADMIN") {
    throw new Error("Target is not an administrator.")
  }
  if (target.role === "SUPER_ADMIN") {
    const superAdminCount = await countSuperAdmins()
    if (superAdminCount <= 1) {
      throw new Error("Cannot demote the last remaining Super Admin.")
    }
  }
  return updateUserRole(userId, "USER")
}

export async function removeAdminAccount(userId: number): Promise<void> {
  await deleteUser(userId)
}

// Re-exported for any callers that need raw logs (unused now but keeps API stable)
export { listLogs }