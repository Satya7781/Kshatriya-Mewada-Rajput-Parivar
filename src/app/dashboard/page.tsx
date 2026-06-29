import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { DashboardClient, DashboardLocked } from "@/components/dashboard/DashboardClient"
import { getSession } from "@/lib/auth/session"
import { getMyProfile } from "@/lib/actions/profile"

export const dynamic = "force-dynamic"

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