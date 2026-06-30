"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth/session"
import { approveUser, rejectUser, deleteUserAsAdmin } from "@/lib/services/adminService"
import { listPendingProfiles, listRejectedProfiles, listAllProfiles } from "@/lib/services/profileService"

export async function listPendingRequestsAction() {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Forbidden" }
  }
  const pending = await listPendingProfiles()
  return { success: true, pending }
}

export async function listRejectedRequestsAction() {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Forbidden" }
  }
  const rejected = await listRejectedProfiles()
  return { success: true, rejected }
}

export async function listAllMembersAction() {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Forbidden" }
  }
  const members = await listAllProfiles()
  return { success: true, members }
}

export async function approveUserAction(userId: number) {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Forbidden" }
  }
  await approveUser(session.id, userId)
  revalidatePath("/dashboard")
  return { success: true }
}

export async function rejectUserAction(userId: number) {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Forbidden" }
  }
  await rejectUser(session.id, userId)
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteUserAction(userId: number) {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Forbidden" }
  }
  await deleteUserAsAdmin(session.id, userId)
  revalidatePath("/dashboard")
  return { success: true }
}
