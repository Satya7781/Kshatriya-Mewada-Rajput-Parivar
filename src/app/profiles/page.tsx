import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Home, ShieldAlert } from "lucide-react"
import { getSession } from "@/lib/auth/session"
import { listApprovedProfiles } from "@/lib/services/profileService"
import { ProfilesClient } from "@/components/profiles/ProfilesClient"
import { ProfileAccessLocked } from "@/components/profiles/ProfileAccessLocked"
import Link from "next/link"

export const dynamic = "force-dynamic"

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

  if (!session.isApproved && session.role === "USER") {
    return (
      <>
        <Header />
        <ProfileAccessLocked kind="pending" />
        <Footer />
      </>
    )
  }

  const profiles = await listApprovedProfiles()

  return (
    <>
      <Header />
      <ProfilesClient initialProfiles={profiles} user={session} />
      <Footer />
    </>
  )
}