"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface to the browser console for debugging; not sent anywhere by default.
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="max-w-md rounded-3xl border-4 border-double border-maroon bg-white p-10 text-center shadow-lg">
        <div className="rajput-border mx-auto mb-6 w-3/4" />
        <h1 className="mb-2 font-heading text-3xl font-bold text-maroon">Something went wrong</h1>
        <p className="mb-6 text-muted-foreground">
          An unexpected error occurred while rendering this page. You can try again, or return home.
        </p>
        {error.digest && (
          <p className="mb-4 text-xs text-muted-foreground">Reference: {error.digest}</p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/"><Home className="mr-2 h-4 w-4" /> Go home</Link>
          </Button>
        </div>
        <div className="rajput-border mx-auto mt-8 w-3/4" />
      </div>
    </main>
  )
}