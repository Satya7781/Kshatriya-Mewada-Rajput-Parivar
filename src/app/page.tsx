import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HomeClient } from "@/components/home/HomeClient"
import { listApprovedProfiles } from "@/lib/services/profileService"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Home · Preserving Heritage, Uniting Families",
  description:
    "A trusted matrimonial platform for the Kshatriya Mewada Rajput community. Verified profiles, gotra-aware matching, and a dignified bio-data experience.",
  alternates: { canonical: "/" },
}

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