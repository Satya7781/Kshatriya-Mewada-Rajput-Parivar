"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShieldCheck, Users, Lock, Search, Landmark, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SafeImage } from "@/components/ui/safe-image"
import { PhotoLightbox } from "@/components/ui/PhotoLightbox"
import { useCountUp } from "@/lib/hooks/useCountUp"
import { useLang } from "@/lib/i18n/LanguageProvider"
import type { PublicProfile } from "@/types"

interface HomeClientProps {
  featured: PublicProfile[]
}

const STATS = [
  { target: 8500, suffix: "+", key: "home.stat.profiles" as const },
  { target: 1200, suffix: "+", key: "home.stat.unions" as const },
  { target: 10000, suffix: "+", key: "home.stat.families" as const },
  { target: 15, suffix: "+", key: "home.stat.years" as const },
]

const VALUES = [
  { icon: "⚔", hi: "वीरता", key: "home.values.veerta" as const },
  { icon: "🙏", hi: "सम्मान", key: "home.values.samman" as const },
  { icon: "🤝", hi: "विश्वास", key: "home.values.vishwas" as const },
  { icon: "🏛", hi: "परंपरा", key: "home.values.parampara" as const },
]

export function HomeClient({ featured }: HomeClientProps) {
  const { t } = useLang()
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [lightboxName, setLightboxName] = useState<string | undefined>(undefined)

  const openLightbox = (src: string | null, name?: string) => {
    setLightboxSrc(src)
    setLightboxName(name)
  }

  return (
    <main className="pt-[76px]">
      {/* Hero */}
      <section
        className="relative flex min-h-[700px] items-center justify-center bg-cover bg-center px-6 py-24"
        style={{ backgroundImage: "url('/images/ram_sita_vivah.png')" }}
      >
        <div className="absolute inset-0 bg-maroon/70" />
        <div className="relative z-10 mx-auto max-w-4xl text-center text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/60 bg-gold/20 px-5 py-2 text-xs font-bold uppercase tracking-widest text-gold">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
            {t("home.badge")}
          </div>

          <h1 className="mb-6 font-heading text-4xl font-extrabold leading-tight text-white md:text-6xl">
            {t("home.title")}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-cream-dark">{t("home.subtitle")}</p>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
            <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> {t("home.gotraVerified")}</span>
            <span className="text-gold">•</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {t("home.elderApproved")}</span>
            <span className="text-gold">•</span>
            <span className="flex items-center gap-1"><Lock className="h-4 w-4" /> {t("home.private")}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/profiles"><Search className="h-5 w-5" /> {t("home.browseProfiles")}</Link>
            </Button>
            <Button variant="gold" asChild size="lg">
              <Link href="#legacy"><Landmark className="h-5 w-5" /> {t("home.exploreLegacy")}</Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <StatBox key={s.key} target={s.target} suffix={s.suffix} label={t(s.key)} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream-dark py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-6 md:grid-cols-5">
            <Step num="01" title={t("home.step1.title")} desc={t("home.step1.desc")} />
            <div className="hidden text-center text-2xl text-gold md:block"><ArrowRight className="mx-auto h-6 w-6" /></div>
            <Step num="02" title={t("home.step2.title")} desc={t("home.step2.desc")} />
            <div className="hidden text-center text-2xl text-gold md:block"><ArrowRight className="mx-auto h-6 w-6" /></div>
            <Step num="03" title={t("home.step3.title")} desc={t("home.step3.desc")} />
          </div>
        </div>
      </section>

      {/* Legacy */}
      <section id="legacy" className="bg-maroon py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 md:flex-row">
          <div className="flex-1">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-gold bg-white/5">
              <Landmark className="h-8 w-8 text-gold" />
            </div>
            <h2 className="mb-4 font-heading text-3xl font-bold text-white">{t("home.legacyTitle")}</h2>
            <p className="leading-relaxed text-cream-dark">{t("home.legacyDesc")}</p>
            <div className="my-6 flex items-center justify-center gap-4 text-gold">
              <span className="h-px w-20 bg-gradient-to-r from-transparent to-gold" />
              <span>❋</span>
              <span className="h-px w-20 bg-gradient-to-l from-transparent to-gold" />
            </div>
          </div>
          <div className="flex-1">
            <Image src="/images/maharana_pratap.png" alt="Maharana Pratap" width={500} height={400} className="rounded-2xl border-4 border-gold shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Featured profiles */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron">
              <span className="h-px w-6 bg-saffron" /> {t("home.featuredTag")}
              <span className="h-px w-6 bg-saffron" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-maroon">{t("home.featuredTitle")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("home.featuredSub")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((profile) => (
              <Card key={profile.userId} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => openLightbox(profile.imageUrl, profile.username ?? undefined)}
                  className="relative block h-64 w-full cursor-zoom-in"
                  aria-label={`View photo of ${profile.username}`}
                >
                  <SafeImage
                    src={profile.imageUrl}
                    name={profile.username ?? undefined}
                    alt={profile.username ?? ""}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-saffron px-3 py-1 text-xs font-bold text-white">{profile.type}</div>
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-maroon px-3 py-1 text-xs font-bold text-white">
                    <ShieldCheck className="h-3 w-3" /> {t("modal.verified")}
                  </div>
                </button>
                <CardContent className="p-5">
                  <h3 className="mb-2 font-heading text-xl font-bold text-maroon">{profile.username}</h3>
                  <p className="mb-1 text-sm text-muted-foreground">{profile.age} yrs • {profile.height}</p>
                  <p className="mb-1 text-sm"><span className="font-semibold text-maroon">{t("modal.gotraSelf")}:</span> {profile.gotraSelf}</p>
                  <p className="mb-4 text-sm"><span className="font-semibold text-maroon">{t("card.education")}:</span> {profile.education}</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/profiles">{t("home.viewDetails")}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gradient-to-br from-saffron to-maroon py-16 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="mb-10 font-heading text-3xl font-bold text-white">{t("home.valuesTitle")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.key} className="rounded-2xl border border-white/30 bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-2 font-heading text-3xl font-bold text-gold">{v.hi}</div>
                <div className="text-sm text-cream-dark">{t(v.key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border-4 border-double border-maroon bg-white p-10 text-center shadow-lg">
          <h2 className="mb-4 font-heading text-3xl font-bold text-maroon">{t("home.ctaTitle")}</h2>
          <p className="mb-8 text-muted-foreground">{t("home.ctaSub")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/profiles"><Search className="h-5 w-5" /> {t("home.browseNow")}</Link>
            </Button>
            <Button variant="gold" size="lg">
              <Sparkles className="h-5 w-5" /> {t("home.createFree")}
            </Button>
          </div>
        </div>
      </section>

      <PhotoLightbox
        open={!!lightboxSrc || !!lightboxName}
        onOpenChange={(o) => !o && openLightbox(null, undefined)}
        src={lightboxSrc}
        name={lightboxName}
      />
    </main>
  )
}

function StatBox({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { value, ref } = useCountUp(target)
  return (
    <div className="rounded-2xl border border-gold-light bg-white/10 p-4 backdrop-blur-sm">
      <div ref={ref} className="font-heading text-3xl font-bold text-gold">
        {value.toLocaleString("en-IN")}{suffix}
      </div>
      <div className="text-sm text-cream-dark">{label}</div>
    </div>
  )
}

function Step({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-gold-light bg-white p-6 shadow-sm">
      <div className="mb-3 font-heading text-2xl font-bold text-saffron">{num}</div>
      <h3 className="mb-2 font-heading text-lg font-bold text-maroon">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}