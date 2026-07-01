"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

/**
 * Count up from 0 to `target` once the element scrolls into view.
 * Respects prefers-reduced-motion (jumps to target instantly).
 * Pure rAF, no dependencies.
 *
 * `ref` is typed as `HTMLDivElement` to match the most common attach target.
 * Cast at the call site if you attach to a different element type.
 */
export function useCountUp(target: number, durationMs = 1600) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      setValue(target)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true
            const start = performance.now()
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / durationMs)
              // easeOutExpo for a premium settle
              const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
              setValue(Math.round(eased * target))
              if (p < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
            io.disconnect()
          }
        }
      },
      { threshold: 0.3 }
    )

    io.observe(node)
    return () => io.disconnect()
  }, [target, durationMs])

  return { value, ref: ref as RefObject<HTMLDivElement | null> }
}