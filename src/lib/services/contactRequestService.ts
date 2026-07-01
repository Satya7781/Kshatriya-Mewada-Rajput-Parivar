"use server"

import { eq, and, desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { contactRequests, users, profiles } from "@/lib/db/schema"
import { cacheDelete, cacheDeletePattern, cacheGet, cacheSet } from "@/lib/cache"

const REQUEST_STATUS_KEY = (requesterId: number, ownerId: number) =>
  `contact_request:${requesterId}:${ownerId}`
const PENDING_REQUESTS_KEY = "contact_requests:pending"

interface ContactRequestRow {
  contactRequests: typeof contactRequests.$inferSelect
  requesterUsers: typeof users.$inferSelect | null
  requesterProfiles: typeof profiles.$inferSelect | null
  ownerUsers: typeof users.$inferSelect | null
  ownerProfiles: typeof profiles.$inferSelect | null
}

export interface ContactRequestWithNames {
  id: number
  requesterId: number
  requesterName: string | null
  requesterPhone: string | null
  ownerId: number
  ownerName: string | null
  ownerPhone: string | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: Date
}

export async function getContactRequestStatus(
  requesterId: number,
  ownerId: number
): Promise<"PENDING" | "APPROVED" | null> {
  const cached = cacheGet<"PENDING" | "APPROVED" | null>(REQUEST_STATUS_KEY(requesterId, ownerId))
  if (cached !== undefined) return cached

  const [row] = await db
    .select()
    .from(contactRequests)
    .where(
      and(
        eq(contactRequests.requesterId, requesterId),
        eq(contactRequests.ownerId, ownerId)
      )
    )
    .limit(1)

  const status = row?.status === "APPROVED" ? "APPROVED" : row?.status === "PENDING" ? "PENDING" : null
  cacheSet(REQUEST_STATUS_KEY(requesterId, ownerId), status)
  return status
}

export async function createContactRequest(
  requesterId: number,
  ownerId: number
): Promise<{ success: boolean; alreadyRequested: boolean; error?: string }> {
  if (requesterId === ownerId) {
    return { success: false, alreadyRequested: false, error: "Cannot request your own contact." }
  }

  const [existing] = await db
    .select()
    .from(contactRequests)
    .where(
      and(
        eq(contactRequests.requesterId, requesterId),
        eq(contactRequests.ownerId, ownerId)
      )
    )
    .limit(1)

  if (existing) {
    return { success: true, alreadyRequested: true }
  }

  await db.insert(contactRequests).values({ requesterId, ownerId })
  cacheDelete(REQUEST_STATUS_KEY(requesterId, ownerId))
  cacheDelete(PENDING_REQUESTS_KEY)
  cacheDeletePattern("contact_requests:")
  return { success: true, alreadyRequested: false }
}

export async function listPendingContactRequests(): Promise<ContactRequestWithNames[]> {
  const cached = cacheGet<ContactRequestWithNames[]>(PENDING_REQUESTS_KEY)
  if (cached) return cached

  const rows = (await db
    .select()
    .from(contactRequests)
    .leftJoin(users, eq(contactRequests.requesterId, users.id))
    .leftJoin(
      profiles,
      eq(contactRequests.requesterId, profiles.userId)
    )
    .where(eq(contactRequests.status, "PENDING"))
    .orderBy(desc(contactRequests.createdAt))) as unknown as ContactRequestRow[]

  const result: ContactRequestWithNames[] = await Promise.all(
    rows.map(async (row) => {
      const owner = await db
        .select({
          username: users.username,
          phone: users.phone,
        })
        .from(users)
        .where(eq(users.id, row.contactRequests.ownerId))
        .limit(1)

      return {
        id: row.contactRequests.id,
        requesterId: row.contactRequests.requesterId,
        requesterName: row.requesterUsers?.username ?? null,
        requesterPhone: row.requesterUsers?.phone ?? null,
        ownerId: row.contactRequests.ownerId,
        ownerName: owner[0]?.username ?? null,
        ownerPhone: owner[0]?.phone ?? null,
        status: row.contactRequests.status,
        createdAt: row.contactRequests.createdAt,
      }
    })
  )

  cacheSet(PENDING_REQUESTS_KEY, result, 1000 * 60 * 2)
  return result
}

export async function approveContactRequest(
  adminId: number,
  requestId: number
): Promise<void> {
  const [req] = await db
    .update(contactRequests)
    .set({ status: "APPROVED" })
    .where(eq(contactRequests.id, requestId))
    .returning()

  if (req) {
    cacheDelete(REQUEST_STATUS_KEY(req.requesterId, req.ownerId))
    cacheDelete(PENDING_REQUESTS_KEY)
    cacheDeletePattern("contact_requests:")
  }
}

export async function rejectContactRequest(
  adminId: number,
  requestId: number
): Promise<void> {
  const [req] = await db
    .update(contactRequests)
    .set({ status: "REJECTED" })
    .where(eq(contactRequests.id, requestId))
    .returning()

  if (req) {
    cacheDelete(REQUEST_STATUS_KEY(req.requesterId, req.ownerId))
    cacheDelete(PENDING_REQUESTS_KEY)
    cacheDeletePattern("contact_requests:")
  }
}
