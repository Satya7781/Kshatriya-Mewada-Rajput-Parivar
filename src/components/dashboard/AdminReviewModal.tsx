"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SafeImage } from "@/components/ui/safe-image"
import { useLang } from "@/lib/i18n/LanguageProvider"
import { CheckCircle2, X, Phone, MapPin, GraduationCap, Briefcase, Users, Home } from "lucide-react"
import type { PublicProfile } from "@/types"

interface AdminReviewModalProps {
  profile: PublicProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: number) => void
  onReject: (id: number) => void
}

export function AdminReviewModal({ profile, open, onOpenChange, onApprove, onReject }: AdminReviewModalProps) {
  const { t } = useLang()
  if (!profile) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-bold text-maroon">
            {t("admin.reviewTitle")}
          </DialogTitle>
          <DialogDescription>
            {profile.username} · {profile.type}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Photo + headline */}
          <div className="flex items-start gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-gold">
              <SafeImage
                src={profile.imageUrl}
                name={profile.username ?? undefined}
                alt={profile.username ?? ""}
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl font-bold text-maroon">{profile.username}</h3>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-saffron">
                {profile.approvalStatus}
              </div>
            </div>
          </div>

          {/* Bio-data grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail icon={Users} label={t("modal.gotraSelf")} value={profile.gotraSelf} />
            <Detail icon={Users} label={t("modal.gotraMother")} value={profile.gotraMother} />
            <Detail icon={Home} label={t("profiles.district")} value={profile.district} />
            <Detail icon={GraduationCap} label={t("modal.education")} value={profile.education} />
            <Detail icon={Briefcase} label={t("modal.profession")} value={profile.profession} />
            <Detail icon={Phone} label={t("admin.phone")} value={profile.phone} />
          </div>

          <div className="rounded-xl border border-gold-light bg-cream/50 p-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-maroon">{t("modal.family")}</div>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div><span className="text-muted-foreground">{t("modal.father")}: </span>{profile.fatherName}</div>
              <div><span className="text-muted-foreground">{t("modal.mother")}: </span>{profile.motherName}</div>
              <div><span className="text-muted-foreground">{t("modal.brothers")}: </span>{profile.brothers}</div>
              <div><span className="text-muted-foreground">{t("modal.sisters")}: </span>{profile.sisters}</div>
              <div className="sm:col-span-2"><span className="text-muted-foreground">{t("modal.parentsOccupation")}: </span>{profile.parentsOccupation}</div>
              <div className="sm:col-span-2"><span className="text-muted-foreground">{t("admin.location")}: </span>{profile.address}</div>
            </div>
          </div>

          {/* Actions */}
          {profile.approvalStatus === "PENDING" && (
            <div className="flex justify-end gap-2 border-t border-gold-light pt-4">
              <Button variant="destructive" onClick={() => { onReject(profile.userId); onOpenChange(false) }}>
                <X className="mr-1 h-4 w-4" /> {t("admin.reject")}
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => { onApprove(profile.userId); onOpenChange(false) }}>
                <CheckCircle2 className="mr-1 h-4 w-4" /> {t("admin.approve")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Detail({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-saffron" />
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-semibold text-maroon">{value && value !== "-" ? value : "—"}</div>
      </div>
    </div>
  )
}