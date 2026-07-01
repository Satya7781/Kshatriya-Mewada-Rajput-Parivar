import { DEFAULT_LANG, type Lang } from "./dictionary"

/**
 * Resolve the preferred language from the value of the `lang` cookie.
 * Accepts the raw cookie value (e.g. "hi") as read via `cookies().get("lang")`.
 * Falls back to DEFAULT_LANG for missing/invalid values.
 */
export function getLangFromCookies(cookieValue: string | null | undefined): Lang {
  if (cookieValue === "en" || cookieValue === "hi") return cookieValue
  return DEFAULT_LANG
}