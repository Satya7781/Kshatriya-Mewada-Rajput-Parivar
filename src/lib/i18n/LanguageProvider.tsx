"use client"

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react"
import { DEFAULT_LANG, LANG_COOKIE, LANG_LABEL, type Lang, type DictKey, t as translate } from "./dictionary"

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: DictKey, vars?: Record<string, string | number>) => string
}

const Ctx = createContext<LangCtx | null>(null)

function readInitialLang(): Lang {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=([^;]+)`))
    if (match?.[1] === "en" || match?.[1] === "hi") return match[1] as Lang
  }
  return DEFAULT_LANG
}

export function LanguageProvider({ children, initialLang = DEFAULT_LANG }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  // Sync from cookie on client mount (in case server passed a stale default)
  useEffect(() => {
    const fromCookie = readInitialLang()
    if (fromCookie !== lang) setLangState(fromCookie)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply lang attribute + hindi font class to <html> for CSS targeting
  useEffect(() => {
    const html = document.documentElement
    html.lang = lang
    if (lang === "hi") html.classList.add("lang-hi")
    else html.classList.remove("lang-hi")
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    // Persist for 1 year so server components can read it next request
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
  }, [])

  const toggle = useCallback(() => {
    setLang(lang === "en" ? "hi" : "en")
  }, [lang, setLang])

  const t = useCallback(
    (key: DictKey, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang]
  )

  return <Ctx.Provider value={{ lang, setLang, toggle, t }}>{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx)
  if (!ctx) {
    // Safe fallback so server components / unmounted usage never throws
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      toggle: () => {},
      t: (key, vars) => translate(DEFAULT_LANG, key, vars),
    }
  }
  return ctx
}

export { LANG_LABEL }