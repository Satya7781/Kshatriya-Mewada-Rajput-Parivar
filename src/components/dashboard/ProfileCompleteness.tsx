"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useLang } from "@/lib/i18n/LanguageProvider"
import type { PublicProfile } from "@/types"

interface ProfileCompletenessProps {
  profile: PublicProfile
}

interface CheckItem {
  key: string
  done: boolean
}

/**
 * A profile completeness checklist + progress bar. Nudges users to fill the
 * fields that make a bio-data dignified (photo, family, contact, address,
 * height). No schema change — all fields already exist.
 */
export function ProfileCompleteness({ profile }: ProfileCompletenessProps) {
  const { t } = useLang()

  const checks: CheckItem[] = [
    { key: "dash.addPhoto", done: !!profile.imageUrl },
    { key: "dash.addHeight", done: !!profile.height && profile.height.trim().length > 0 },
    { key: "dash.addFamily", done: !!(profile.fatherName && profile.motherName && (profile.brothers || profile.sisters)) },
    { key: "dash.addContact", done: !!profile.contact && profile.contact !== "-" },
    { key: "dash.addAddress", done: !!profile.address && profile.address !== "-" },
  ]

  const doneCount = checks.filter((c) => c.done).length
  const pct = Math.round((doneCount / checks.length) * 100)
  const isComplete = doneCount === checks.length

  return (
    <Card className="mb-6 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-maroon">{t("dash.completeness")}</h3>
          <p className="text-xs text-muted-foreground">{t("dash.completenessHint")}</p>
        </div>
        <div className="text-right">
          <div className="font-heading text-2xl font-bold text-saffron">{pct}%</div>
          {isComplete && <div className="text-xs font-bold text-green-600">{t("dash.complete")}</div>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-cream-dark">
        <div
          className="h-full rounded-full bg-gradient-to-r from-saffron to-maroon transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Checklist */}
      <ul className="grid gap-2 sm:grid-cols-2">
        {checks.map((c) => (
          <li key={c.key} className="flex items-center gap-2 text-sm">
            {c.done ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-gold" />
            )}
            <span className={c.done ? "text-muted-foreground line-through" : "font-semibold text-maroon"}>
              {t(c.key as any)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}