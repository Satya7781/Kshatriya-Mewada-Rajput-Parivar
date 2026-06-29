"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { RotateCcw, Search, SlidersHorizontal, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ProfileCard } from "./ProfileCard"
import { ProfileModal } from "./ProfileModal"
import { sendInterestAction } from "@/lib/actions/interest"
import { useLang } from "@/lib/i18n/LanguageProvider"
import type { PublicProfile, SessionUser } from "@/types"

interface ProfilesClientProps {
  initialProfiles: PublicProfile[]
  user: SessionUser | null
}

type SortKey = "default" | "ageAsc" | "ageDesc" | "heightAsc" | "heightDesc" | "verifiedFirst"

// Inches used for height comparison. Heights look like "5'10\"".
function heightToInches(h: string | null): number {
  if (!h) return 0
  const m = h.match(/(\d+)['’]\s*(\d+)/)
  if (m) return Number(m[1]) * 12 + Number(m[2])
  const cm = h.match(/(\d+)\s*cm/i)
  if (cm) return Math.round(Number(cm[1]) / 2.54)
  return 0
}

const HEIGHT_FILTER_OPTIONS = [
  { value: 0, labelKey: "profiles.anyHeight" as const },
  { value: 60, label: "5'0\"" },
  { value: 63, label: "5'3\"" },
  { value: 66, label: "5'6\"" },
  { value: 69, label: "5'9\"" },
  { value: 72, label: "6'0\"" },
]

export function ProfilesClient({ initialProfiles, user }: ProfilesClientProps) {
  const { t } = useLang()
  const router = useRouter()
  const [profiles] = useState(initialProfiles)
  const [selected, setSelected] = useState<PublicProfile | null>(null)

  const [gender, setGender] = useState("all")
  const [ageMin, setAgeMin] = useState(18)
  const [ageMax, setAgeMax] = useState(35)
  const [community, setCommunity] = useState("all")
  const [district, setDistrict] = useState("all")
  const [gotraQuery, setGotraQuery] = useState("")
  const [gotraExclude, setGotraExclude] = useState("")
  const [keyword, setKeyword] = useState("")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [heightMin, setHeightMin] = useState(0)
  const [sort, setSort] = useState<SortKey>("default")

  const filtered = useMemo(() => {
    const result = profiles.filter((p) => {
      if (gender !== "all" && p.type.toLowerCase() !== gender.toLowerCase()) return false
      if (p.age && (p.age < ageMin || p.age > ageMax)) return false
      if (community !== "all" && p.community !== community) return false
      if (district !== "all" && p.district !== district) return false
      if (verifiedOnly && p.approvalStatus !== "APPROVED") return false
      if (heightMin > 0 && heightToInches(p.height) < heightMin) return false

      const q = gotraQuery.toLowerCase()
      if (q) {
        const g = `${p.gotraSelf || ""} ${p.gotraMother || ""}`.toLowerCase()
        if (!g.includes(q)) return false
      }

      const ex = gotraExclude.toLowerCase()
      if (ex) {
        const g = `${p.gotraSelf || ""} ${p.gotraMother || ""}`.toLowerCase()
        if (g.includes(ex)) return false
      }

      const k = keyword.toLowerCase()
      if (k) {
        const text = `${p.education || ""} ${p.profession || ""}`.toLowerCase()
        if (!text.includes(k)) return false
      }

      return true
    })

    switch (sort) {
      case "ageAsc":
        result.sort((a, b) => (a.age ?? 999) - (b.age ?? 999))
        break
      case "ageDesc":
        result.sort((a, b) => (b.age ?? 0) - (a.age ?? 0))
        break
      case "heightAsc":
        result.sort((a, b) => heightToInches(a.height) - heightToInches(b.height))
        break
      case "heightDesc":
        result.sort((a, b) => heightToInches(b.height) - heightToInches(a.height))
        break
      case "verifiedFirst":
        result.sort((a, b) => {
          const av = a.approvalStatus === "APPROVED" ? 0 : 1
          const bv = b.approvalStatus === "APPROVED" ? 0 : 1
          return av - bv
        })
        break
      default:
        break
    }

    return result
  }, [profiles, gender, ageMin, ageMax, community, district, gotraQuery, gotraExclude, keyword, verifiedOnly, heightMin, sort])

  function resetFilters() {
    setGender("all")
    setAgeMin(18)
    setAgeMax(35)
    setCommunity("all")
    setDistrict("all")
    setGotraQuery("")
    setGotraExclude("")
    setKeyword("")
    setVerifiedOnly(false)
    setHeightMin(0)
    setSort("default")
  }

  async function handleInterest(profile: PublicProfile) {
    if (!user) {
      toast.info(t("profiles.loginToSend"))
      return
    }
    const res = await sendInterestAction(profile.userId)
    if (!res.success) {
      toast.error(res.error)
      return
    }
    toast.success(t("profiles.interestSent", { name: profile.username ?? "" }))
  }

  return (
    <>
      <section className="bg-cream py-10 pt-[120px]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-maroon">{t("profiles.title")}</h1>
            <p className="mt-2 text-muted-foreground">{t("profiles.subtitle")}</p>
          </div>

          {user && (
            <div className="mb-6 flex items-center justify-center gap-2 rounded-full border border-gold bg-white px-4 py-2 text-sm font-bold text-gold">
              <Unlock className="h-4 w-4" />
              {t("profiles.verifiedAccess")}
            </div>
          )}

          <Card className="mb-8 p-6">
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-maroon" />
              <h2 className="font-heading text-xl font-bold text-maroon">{t("profiles.filterTitle")}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <FilterGroup label={t("profiles.lookingFor")}>
                <select className="input-style" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="all">{t("profiles.all")}</option>
                  <option value="groom">{t("profiles.groom")}</option>
                  <option value="bride">{t("profiles.bride")}</option>
                </select>
              </FilterGroup>

              <FilterGroup label={t("profiles.ageRange")}>
                <div className="flex items-center gap-2">
                  <Input type="number" value={ageMin} onChange={(e) => setAgeMin(Number(e.target.value))} className="min-h-10" />
                  <span className="text-gold">-</span>
                  <Input type="number" value={ageMax} onChange={(e) => setAgeMax(Number(e.target.value))} className="min-h-10" />
                </div>
              </FilterGroup>

              <FilterGroup label={t("profiles.heightMin")}>
                <select className="input-style" value={heightMin} onChange={(e) => setHeightMin(Number(e.target.value))}>
                  {HEIGHT_FILTER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.labelKey ? t(o.labelKey) : o.label}
                    </option>
                  ))}
                </select>
              </FilterGroup>

              <FilterGroup label={t("profiles.sortBy")}>
                <select className="input-style" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  <option value="default">{t("profiles.sort.default")}</option>
                  <option value="ageAsc">{t("profiles.sort.ageAsc")}</option>
                  <option value="ageDesc">{t("profiles.sort.ageDesc")}</option>
                  <option value="heightAsc">{t("profiles.sort.heightAsc")}</option>
                  <option value="heightDesc">{t("profiles.sort.heightDesc")}</option>
                  <option value="verifiedFirst">{t("profiles.sort.verifiedFirst")}</option>
                </select>
              </FilterGroup>

              <FilterGroup label={t("profiles.community")}>
                <select className="input-style" value={community} onChange={(e) => setCommunity(e.target.value)}>
                  <option value="all">{t("profiles.allCommunities")}</option>
                  <option>Mewada</option>
                  <option>Rajput</option>
                </select>
              </FilterGroup>

              <FilterGroup label={t("profiles.district")}>
                <select className="input-style" value={district} onChange={(e) => setDistrict(e.target.value)}>
                  <option value="all">{t("profiles.allDistricts")}</option>
                  <option>Bhopal</option>
                  <option>Sehore</option>
                  <option>Rajgarh</option>
                  <option>Indore</option>
                </select>
              </FilterGroup>

              <FilterGroup label={t("profiles.searchGotra")}>
                <Input value={gotraQuery} onChange={(e) => setGotraQuery(e.target.value)} placeholder={t("profiles.searchGotra")} />
              </FilterGroup>

              <FilterGroup label={t("profiles.excludeGotra")}>
                <Input value={gotraExclude} onChange={(e) => setGotraExclude(e.target.value)} placeholder={t("profiles.excludeGotra")} />
              </FilterGroup>

              <FilterGroup label={t("profiles.keyword")}>
                <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={t("profiles.keyword")} />
              </FilterGroup>

              <div className="flex items-end gap-3">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="h-5 w-5 accent-maroon" />
                  <span className="font-semibold text-maroon">{t("profiles.verifiedOnly")}</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={resetFilters}>
                <RotateCcw className="mr-2 h-4 w-4" /> {t("profiles.reset")}
              </Button>
              <Button onClick={() => toast.success(t("profiles.foundMatches", { n: filtered.length }))}>
                <Search className="mr-2 h-4 w-4" /> {t("profiles.apply")}
              </Button>
            </div>
          </Card>

          <div className="mb-4 flex items-center justify-between border-b-2 border-gold-light pb-3">
            <h3 className="font-heading text-2xl font-bold text-maroon">{t("profiles.results")}</h3>
            <span className="text-sm font-semibold text-muted-foreground">
              {filtered.length} {t("profiles.matchesFound")}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gold bg-white p-12 text-center">
              <h4 className="font-heading text-xl font-bold text-maroon">{t("profiles.noMatches")}</h4>
              <p className="mt-2 text-muted-foreground">{t("profiles.noMatchesDesc")}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((profile) => (
                <ProfileCard
                  key={profile.userId}
                  profile={profile}
                  isLoggedIn={!!user}
                  onView={() => setSelected(profile)}
                  onInterest={() => handleInterest(profile)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ProfileModal
        profile={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        isLoggedIn={!!user}
        onSendInterest={() => selected && handleInterest(selected)}
      />
    </>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  )
}