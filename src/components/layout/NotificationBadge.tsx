"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { getNotificationCountsAction } from "@/lib/actions/interest"
import { useLang } from "@/lib/i18n/LanguageProvider"

/**
 * Shows a bell with a count badge for pending received interests.
 * Polls once on mount and when the window regains focus — cheap, no WebSocket.
 */
export function NotificationBadge() {
  const { t } = useLang()
  const [pending, setPending] = useState(0)

  async function refresh() {
    const res = await getNotificationCountsAction()
    if (res.success && typeof res.pending === "number") setPending(res.pending)
  }

  useEffect(() => {
    refresh()
    const onFocus = () => refresh()
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [])

  if (pending === 0) return null

  return (
    <span
      className="relative inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-saffron px-1.5 text-xs font-bold text-white"
      title={t("dash.pendingCount", { n: pending })}
    >
      <Bell className="h-3.5 w-3.5" />
      <span className="ml-0.5">{pending > 9 ? "9+" : pending}</span>
    </span>
  )
}