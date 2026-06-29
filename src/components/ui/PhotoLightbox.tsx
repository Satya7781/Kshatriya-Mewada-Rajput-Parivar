"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { SafeImage } from "@/components/ui/safe-image"

interface PhotoLightboxProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string | null | undefined
  name?: string
}

/**
 * Full-screen photo viewer built on the existing Radix Dialog primitive.
 * Centered image on a dark, scroll-locked overlay with an explicit close
 * affordance. Focus-trap and ESC-to-close come from Dialog for free.
 */
export function PhotoLightbox({ open, onOpenChange, src, name }: PhotoLightboxProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none max-h-none w-screen h-screen translate-x-0 translate-y-0 left-0 top-0 rounded-none border-0 bg-black/95 p-0 sm:rounded-none">
        <DialogTitle className="sr-only">{name ? `Photo of ${name}` : "Photo"}</DialogTitle>
        <button
          aria-label="Close"
          onClick={() => onOpenChange(false)}
          className="fixed right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex h-full w-full items-center justify-center p-6 sm:p-12">
          <div className="relative h-full w-full max-h-[90vh] max-w-[90vw]">
            <SafeImage
              src={src}
              name={name}
              alt={name ? `Photo of ${name}` : "Profile photo"}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}