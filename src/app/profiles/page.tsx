import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Home, ShieldAlert } from "lucide-react"
import { getSession } from "@/lib/auth/session"
import { searchProfiles } from "@/lib/services/profileService"
import { ProfilesClient } from "@/components/profiles/ProfilesClient"
import { ProfileAccessLocked } from "@/components/profiles/ProfileAccessLocked"
import Link from "next/link"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Find Matches",
  description:
    "Browse verified Kshatriya Mewada Rajput matrimonial profiles. Filter by gotra, district, age, and height to find the right family match.",
  alternates: { canonical: "/profiles" },
}

export default async function ProfilesPage() {
  const session = await getSession()

  if (!session) {
    return (
      <>
        <Header />
        <ProfileAccessLocked kind="noSession" />
        <Footer />
      </>
    )
  }

  // Any logged-in user (even pending/unapproved) can explore profiles.
  // Contact details remain gated behind admin-approved contact requests.
  const firstPage = await searchProfiles({ page: 1, pageSize: 12 })

  return (
    <>
      <Header />
      <ProfilesClient
        initialProfiles={firstPage.profiles}
        initialTotal={firstPage.total}
        user={session}
      />
      <Footer />
    </>
  )
}