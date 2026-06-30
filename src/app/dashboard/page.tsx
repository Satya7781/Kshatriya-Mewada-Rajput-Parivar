import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { DashboardClient, DashboardLocked } from "@/components/dashboard/DashboardClient"
import { getSession } from "@/lib/auth/session"
import { getMyProfile } from "@/lib/actions/profile"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "My Dashboard",
  description:
    "Manage your bio-data, review interests, and track your matrimonial connections.",
  alternates: { canonical: "/dashboard" },
  // Dashboard is private; keep it out of search indices.
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    return (
      <>
        <Header />
        <DashboardLocked kind="noSession" />
        <Footer />
      </>
    )
  }

  const profile = await getMyProfile()

  if (!profile) {
    return (
      <>
        <Header />
        <DashboardLocked kind="notFound" />
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <DashboardClient profile={profile} role={session.role} />
      <Footer />
    </>
  )
}