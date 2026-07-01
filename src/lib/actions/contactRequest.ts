"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth/session"
import {
  createContactRequest,
  getContactRequestStatus,
  listPendingContactRequests,
  approveContactRequest,
  rejectContactRequest,
} from "@/lib/services/contactRequestService"

export async function requestContactAction(ownerId: number) {
  const session = await getSession()
  if (!session) return { success: false, error: "Not authenticated" }

  const result = await createContactRequest(session.id, ownerId)
  if (!result.success) {
    return { success: false, error: result.error }
  }

  revalidatePath("/profiles")
  return { success: true, alreadyRequested: result.alreadyRequested }
}

export async function getContactStatusAction(ownerId: number) {
  const session = await getSession()
  if (!session) return { success: true, status: null }

  const status = await getContactRequestStatus(session.id, ownerId)
  return { success: true, status }
}

export async function listPendingContactRequestsAction() {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Forbidden" }
  }

  const requests = await listPendingContactRequests()
  return { success: true, requests }
}

export async function approveContactRequestAction(requestId: number) {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Forbidden" }
  }

  await approveContactRequest(session.id, requestId)
  revalidatePath("/dashboard")
  return { success: true }
}

export async function rejectContactRequestAction(requestId: number) {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return { success: false, error: "Forbidden" }
  }

  await rejectContactRequest(session.id, requestId)
  revalidatePath("/dashboard")
  return { success: true }
}
