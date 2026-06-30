import Link from "next/link"
import { Home, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="max-w-md rounded-3xl border-4 border-double border-maroon bg-white p-10 text-center shadow-lg">
        <div className="rajput-border mx-auto mb-6 w-3/4" />
        <Compass className="mx-auto mb-4 h-12 w-12 text-saffron" />
        <h1 className="mb-2 font-heading text-3xl font-bold text-maroon">Page not found</h1>
        <p className="mb-6 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Button asChild>
          <Link href="/"><Home className="mr-2 h-4 w-4" /> Return home</Link>
        </Button>
        <div className="rajput-border mx-auto mt-8 w-3/4" />
      </div>
    </main>
  )
}