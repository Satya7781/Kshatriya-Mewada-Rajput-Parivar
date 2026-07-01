"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth/session"
import {
  getSuperAdminStats,
  getAdminAccounts,
  getAuditLogs,
  createAdminAccount,
  demoteAdminToUser,
} from "@/lib/services/superAdminService"

export async function getSuperAdminStatsAction() {
  const session = await getSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Forbidden" }
  }
  const stats = await getSuperAdminStats()
  return { success: true, stats }
}

export async function listAdminsAction() {
  const session = await getSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Forbidden" }
  }
  const admins = await getAdminAccounts()
  return { success: true, admins }
}

export async function listAuditLogsAction() {
  const session = await getSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Forbidden" }
  }
  const logs = await getAuditLogs(50)
  return { success: true, logs }
}

export async function createAdminAction(name: string, phone: string, password: string) {
  const session = await getSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Forbidden" }
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." }
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return { success: false, error: "Phone must be at least 10 digits." }
  }
  try {
    const admin = await createAdminAccount(phone, name, password)
    revalidatePath("/dashboard")
    return { success: true, admin }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create admin." }
  }
}

export async function demoteAdminAction(userId: number) {
  const session = await getSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Forbidden" }
  }
  try {
    await demoteAdminToUser(userId)
    revalidatePath("/dashboard")
    return { success: true }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to demote admin." }
  }
}