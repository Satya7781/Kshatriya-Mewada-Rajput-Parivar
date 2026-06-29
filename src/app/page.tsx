import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HomeClient } from "@/components/home/HomeClient"
import { listApprovedProfiles } from "@/lib/services/profileService"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const featured = (await listApprovedProfiles()).slice(0, 3)

  return (
    <>
      <Header />
      <HomeClient featured={featured} />
      <Footer />
    </>
  )
}