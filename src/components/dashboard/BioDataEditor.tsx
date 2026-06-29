"use client"

import { useState, useRef, useCallback } from "react"
import { toast } from "sonner"
import { Save, Printer, Camera, ShieldCheck, Clock, AlertTriangle, Info, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { SafeImage } from "@/components/ui/safe-image"
import { updateMyProfile, requestApprovalAction } from "@/lib/actions/profile"
import { useLang } from "@/lib/i18n/LanguageProvider"
import type { PublicProfile, Role } from "@/types"

interface BioDataEditorProps {
  profile: PublicProfile
  role: Role
}

export function BioDataEditor({ profile, role }: BioDataEditorProps) {
  const { t } = useLang()
  const [form, setForm] = useState({
    username: profile.username || "",
    dob: profile.dob || "",
    height: profile.height || "5'10\"",
    type: profile.type,
    district: profile.district || "Bhopal",
    gotraSelf: profile.gotraSelf || "",
    gotraMother: profile.gotraMother || "",
    education: profile.education || "",
    profession: profile.profession || "",
    address: profile.address || "",
    contact: profile.contact || "",
  })
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN"
  const locked = (profile.approvalStatus === "APPROVED" || profile.approvalStatus === "PENDING") && !isAdmin

  function formatDob(dob: string) {
    if (!dob || dob === "-") return "-"
    const d = new Date(dob)
    if (isNaN(d.getTime())) return dob
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
  }

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error(t("bio.uploadFailed"))
      return
    }
    if (file.size > 30 * 1024 * 1024) {
      toast.error(t("bio.uploadFailed"))
      return
    }
    const data = new FormData()
    data.append("file", file)
    const res = await fetch("/api/profile/upload", { method: "POST", body: data })
    const json = await res.json()
    if (!json.success) {
      toast.error(json.error || t("bio.uploadFailed"))
      return
    }
    toast.success(t("bio.photoUploaded"))
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      if (locked) return
      const file = e.dataTransfer.files?.[0]
      if (file) uploadFile(file)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locked]
  )

  async function handleSave() {
    const res = await updateMyProfile(form)
    if (!res.success) {
      toast.error(res.error)
      return
    }
    toast.success(t("bio.saved"))
  }

  async function handleRequestApproval() {
    const res = await requestApprovalAction()
    if (!res.success) {
      toast.error(res.error)
      return
    }
    toast.success(t("bio.submitted"))
  }

  let statusConfig = {
    icon: Info,
    color: "text-gold",
    bg: "bg-white border-gold-light",
    text: t("bio.draft"),
    showButton: true,
  }

  if (isAdmin) {
    statusConfig = {
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
      text: t("bio.adminAccount"),
      showButton: false,
    }
  } else if (profile.approvalStatus === "APPROVED") {
    statusConfig = {
      icon: ShieldCheck,
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
      text: t("bio.verified"),
      showButton: false,
    }
  } else if (profile.approvalStatus === "PENDING") {
    statusConfig = {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50 border-yellow-200",
      text: t("bio.pending"),
      showButton: false,
    }
  } else if (profile.approvalStatus === "REJECTED") {
    statusConfig = {
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
      text: t("bio.rejected"),
      showButton: true,
    }
  }

  const StatusIcon = statusConfig.icon

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h2 className="mb-2 font-heading text-2xl font-bold text-maroon">{t("bio.editTitle")}</h2>

        <div className={`mb-6 flex items-center justify-between gap-4 rounded-xl border p-4 ${statusConfig.bg}`}>
          <div className="flex items-center gap-3">
            <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
            <span className={`font-bold ${statusConfig.color}`}>{statusConfig.text}</span>
          </div>
          {statusConfig.showButton && (
            <Button size="sm" onClick={handleRequestApproval}>{t("bio.submit")}</Button>
          )}
        </div>

        <div className="mb-6">
          <Label className="mb-2">{t("bio.profilePhoto")}</Label>
          <div
            onDragOver={(e) => { e.preventDefault(); if (!locked) setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !locked && fileRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 transition ${
              locked ? "pointer-events-none opacity-60" : ""
            } ${dragging ? "border-saffron bg-saffron-light" : "border-gold bg-cream-dark hover:bg-cream"}`}
          >
            <UploadCloud className="h-8 w-8 text-gold" />
            <span className="text-center text-sm font-semibold text-muted-foreground">{t("bio.dropHere")}</span>
            <span className="flex items-center gap-1 text-xs text-maroon">
              <Camera className="h-3.5 w-3.5" /> {t("bio.changePhoto")}
            </span>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={locked} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t("bio.fullName")} value={form.username} onChange={(v) => setForm({ ...form, username: v })} disabled={locked} />
          <Field label={t("bio.gender")}>
            <select className="input-style" value={form.type} disabled={locked} onChange={(e) => setForm({ ...form, type: e.target.value as any })} >
              <option value="GROOM">{t("auth.groom")}</option>
              <option value="BRIDE">{t("auth.bride")}</option>
            </select>
          </Field>
          <Field label={t("bio.dob")} value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} disabled={locked} type="date" />
          <Field label={t("bio.height")} value={form.height} onChange={(v) => setForm({ ...form, height: v })} disabled={locked} />
          <Field label={t("bio.gotraSelf")} value={form.gotraSelf} onChange={(v) => setForm({ ...form, gotraSelf: v })} disabled={locked} />
          <Field label={t("bio.gotraMother")} value={form.gotraMother} onChange={(v) => setForm({ ...form, gotraMother: v })} disabled={locked} />
          <Field label={t("bio.education")} value={form.education} onChange={(v) => setForm({ ...form, education: v })} disabled={locked} />
          <Field label={t("bio.profession")} value={form.profession} onChange={(v) => setForm({ ...form, profession: v })} disabled={locked} />
          <Field label={t("bio.district")} value={form.district} onChange={(v) => setForm({ ...form, district: v })} disabled={locked} />
          <Field label={t("bio.contact")} value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} disabled={locked} />
          <div className="md:col-span-2">
            <Field label={t("bio.address")} value={form.address} onChange={(v) => setForm({ ...form, address: v })} disabled={locked} />
          </div>
        </div>

        {!locked && (
          <Button className="mt-6 w-full" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> {t("bio.save")}
          </Button>
        )}
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-maroon">{t("bio.preview")}</h2>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> {t("bio.print")}
          </Button>
        </div>

        <div id="biodata-card" className="rounded-2xl border-8 border-double border-maroon bg-cream p-6 md:p-8">
          <div className="text-center">
            <div className="mb-2 text-lg font-bold text-maroon">॥ श्री गणेशाय नमः ॥</div>
            <div className="font-heading text-2xl font-bold text-maroon">{t("bio.biodataTitle")}</div>
            <div className="text-gold">{t("bio.kshatriya")}</div>
          </div>

          <div className="mx-auto my-6 flex justify-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gold">
              <SafeImage
                src={profile.imageUrl}
                name={profile.username ?? undefined}
                alt={profile.username ?? ""}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          </div>

          <table className="w-full text-sm">
            <tbody className="divide-y divide-gold-light">
              <PreviewRow label={t("bio.name")} value={form.username} />
              <PreviewRow label={t("bio.birthDate")} value={formatDob(form.dob)} />
              <PreviewRow label={t("bio.height")} value={form.height} />
              <PreviewRow label={t("bio.gender")} value={form.type} />
              <PreviewRow label={t("bio.district")} value={form.district} />
              <PreviewRow label={t("modal.gotraSelf")} value={form.gotraSelf} />
              <PreviewRow label={t("modal.gotraMother")} value={form.gotraMother} />
              <PreviewRow label={t("bio.education")} value={form.education} />
              <PreviewRow label={t("bio.profession")} value={form.profession} />
              <PreviewRow label={t("bio.nativePlace")} value={form.address} />
              <PreviewRow label={t("bio.contact")} value={form.contact} />
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  children,
}: {
  label: string
  value?: string
  onChange?: (v: string) => void
  disabled?: boolean
  type?: string
  children?: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children || (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
        />
      )}
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string | null }) {
  return (
    <tr>
      <td className="py-2 font-semibold text-maroon">{label}</td>
      <td className="py-2 text-right">{value || "-"}</td>
    </tr>
  )
}