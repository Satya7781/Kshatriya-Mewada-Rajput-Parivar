"use client"

import Link from "next/link"
import { Home, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLang } from "@/lib/i18n/LanguageProvider"

export function ProfileAccessLocked({ kind }: { kind: "noSession" | "pending" }) {
  const { t } = useLang()
  if (kind === "noSession") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6 pt-[76px]">
        <div className="max-w-md rounded-3xl border-4 border-double border-maroon bg-white p-10 text-center shadow-lg">
          <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-maroon" />
          <h2 className="mb-2 font-heading text-2xl font-bold text-maroon">{t("dash.accessOnly")}</h2>
          <p className="mb-6 text-muted-foreground">{t("dash.accessDesc")}</p>
          <Button asChild className="w-full">
            <Link href="/"><Home className="mr-2 h-4 w-4" /> {t("dash.goHome")}</Link>
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 pt-[76px]">
      <div className="max-w-lg rounded-3xl border-2 border-dashed border-gold bg-white p-10 text-center">
        <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-gold" />
        <h2 className="mb-2 font-heading text-2xl font-bold text-maroon">{t("dash.verificationPending")}</h2>
        <p className="mb-6 text-muted-foreground">{t("dash.verificationDesc")}</p>
        <Button asChild className="w-full">
          <Link href="/dashboard">{t("dash.goDashboard")}</Link>
        </Button>
      </div>
    </div>
  )
}