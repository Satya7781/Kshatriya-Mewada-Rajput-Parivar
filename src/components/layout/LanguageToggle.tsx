"use client"

import { Languages } from "lucide-react"
import { useLang, LANG_LABEL } from "@/lib/i18n/LanguageProvider"
import { cn } from "@/lib/utils"

/**
 * A compact, premium language toggle pill. Cycles EN <-> Hindi.
 * Shows the *other* language's label (so EN view shows "हिं", Hindi shows "EN").
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggle } = useLang()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch language"
      title={lang === "en" ? "हिंदी में देखें" : "View in English"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gold-light bg-white px-3 py-1.5 text-xs font-bold text-maroon transition hover:border-gold hover:bg-gold-light",
        className
      )}
    >
      <Languages className="h-3.5 w-3.5 text-gold" />
      <span>{LANG_LABEL[lang === "en" ? "hi" : "en"]}</span>
    </button>
  )
}