"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth/session"
import {
  getReceivedInterests,
  getSentInterests,
  getAcceptedInterestsReceived,
  getAcceptedInterestsSent,
  sendInterest,
  updateInterestStatus,
  countReceivedInterests,
  countPendingReceivedInterests,
  countAcceptedInterestsReceived,
} from "@/lib/services/interestService"

export async function getMyInterestsAction() {
  const session = await getSession()
  if (!session) return { success: false, error: "Not authenticated" }
  const interests = await getReceivedInterests(session.id)
  const count = await countReceivedInterests(session.id)
  return { success: true, interests, count }
}

export async function getMySentInterestsAction() {
  const session = await getSession()
  if (!session) return { success: false, error: "Not authenticated" }
  const interests = await getSentInterests(session.id)
  return { success: true, interests }
}

export async function getMyAcceptedInterestsAction() {
  const session = await getSession()
  if (!session) return { success: false, error: "Not authenticated" }
  const received = await getAcceptedInterestsReceived(session.id)
  const sent = await getAcceptedInterestsSent(session.id)
  return { success: true, received, sent }
}

export async function getNotificationCountsAction() {
  const session = await getSession()
  if (!session) return { success: false, error: "Not authenticated" }
  const pending = await countPendingReceivedInterests(session.id)
  const accepted = await countAcceptedInterestsReceived(session.id)
  return { success: true, pending, accepted }
}

export async function sendInterestAction(receiverId: number) {
  const session = await getSession()
  if (!session) return { success: false, error: "Not authenticated" }
  const { alreadySent } = await sendInterest(session.id, receiverId)
  revalidatePath("/profiles")
  if (alreadySent) {
    return { success: true, alreadySent: true }
  }
  return { success: true, alreadySent: false }
}

export async function acceptInterestAction(interestId: number) {
  const session = await getSession()
  if (!session) return { success: false, error: "Not authenticated" }
  await updateInterestStatus(interestId, session.id, "ACCEPTED")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function declineInterestAction(interestId: number) {
  const session = await getSession()
  if (!session) return { success: false, error: "Not authenticated" }
  await updateInterestStatus(interestId, session.id, "DECLINED")
  revalidatePath("/dashboard")
  return { success: true }
}