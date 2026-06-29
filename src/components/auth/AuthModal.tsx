"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Camera, Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction, registerAction } from "@/lib/actions/auth"
import { useLang } from "@/lib/i18n/LanguageProvider"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "login" | "register"
}

export function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
  const { t } = useLang()
  const router = useRouter()
  const [tab, setTab] = useState(defaultTab)
  const [pending, setPending] = useState(false)

  const [loginPhone, setLoginPhone] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [registerData, setRegisterData] = useState({
    username: "",
    phone: "",
    password: "",
    gender: "Groom",
    gotraSelf: "",
    gotraMother: "",
    dob: "",
    district: "Bhopal",
    education: "",
    profession: "",
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error(t("bio.uploadFailed"))
      return
    }
    if (file.size > 30 * 1024 * 1024) {
      toast.error(t("bio.uploadFailed"))
      return
    }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function clearPhoto() {
    setPhotoFile(null)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    const res = await loginAction(loginPhone, loginPassword)
    setPending(false)
    if (!res.success) {
      toast.error(res.error)
      return
    }
    toast.success(t("auth.loginSuccess"))
    onOpenChange(false)
    router.push("/dashboard")
    router.refresh()
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)

    // 1. Register the user + profile
    const res = await registerAction({
      ...registerData,
      profileType: registerData.gender === "Bride" ? "BRIDE" : "GROOM",
    })

    if (!res.success) {
      setPending(false)
      toast.error(res.error)
      return
    }

    // 2. If a photo was chosen, auto-login then upload via the authed route.
    if (photoFile) {
      const loginRes = await loginAction(registerData.phone, registerData.password)
      if (loginRes.success && photoFile) {
        const data = new FormData()
        data.append("file", photoFile)
        try {
          await fetch("/api/profile/upload", { method: "POST", body: data })
        } catch {
          // best-effort; profile is already created
        }
      }
      clearPhoto()
    }

    setPending(false)
    toast.success(t("auth.regSuccess"))
    setTab("login")
    setLoginPhone(registerData.phone)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) clearPhoto() }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("auth.title")}</DialogTitle>
          <DialogDescription>{t("auth.desc")}</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("auth.tabLogin")}</TabsTrigger>
            <TabsTrigger value="register">{t("auth.tabRegister")}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-phone">{t("auth.mobile")}</Label>
                <Input id="login-phone" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} placeholder={t("auth.mobilePh")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">{t("auth.password")}</Label>
                <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder={t("auth.passwordPh")} />
              </div>
              <Button type="submit" className="w-full" disabled={pending}>{pending ? t("auth.verifying") : t("auth.accessDashboard")}</Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="grid gap-3">
              {/* Photo picker */}
              <div className="mb-1 space-y-2">
                <Label>{t("auth.photo")}</Label>
                <p className="text-xs text-muted-foreground">{t("auth.photoHint")}</p>
                {photoPreview ? (
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-gold">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photoPreview} alt="preview" className="h-full w-full object-cover" />
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                      <Camera className="mr-1 h-4 w-4" /> {t("auth.photoChange")}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={clearPhoto}>
                      <X className="mr-1 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gold bg-cream-dark p-4 transition hover:bg-cream">
                    <Upload className="h-5 w-5 text-gold" />
                    <span className="font-semibold text-muted-foreground">{t("auth.photoPick")}</span>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickPhoto} />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">{t("auth.fullName")}</Label>
                  <Input id="reg-name" value={registerData.username} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-gender">{t("auth.gender")}</Label>
                  <select
                    id="reg-gender"
                    className="flex min-h-[52px] w-full rounded-2xl border-2 border-gold-hover bg-white px-4 text-base"
                    value={registerData.gender}
                    onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                  >
                    <option value="Groom">{t("auth.groom")}</option>
                    <option value="Bride">{t("auth.bride")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="reg-gotra-self">{t("auth.gotraSelf")}</Label>
                  <Input id="reg-gotra-self" value={registerData.gotraSelf} onChange={(e) => setRegisterData({ ...registerData, gotraSelf: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-gotra-mother">{t("auth.gotraMother")}</Label>
                  <Input id="reg-gotra-mother" value={registerData.gotraMother} onChange={(e) => setRegisterData({ ...registerData, gotraMother: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="reg-dob">{t("auth.dob")}</Label>
                  <Input id="reg-dob" type="date" value={registerData.dob} onChange={(e) => setRegisterData({ ...registerData, dob: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-district">{t("auth.district")}</Label>
                  <select
                    id="reg-district"
                    className="flex min-h-[52px] w-full rounded-2xl border-2 border-gold-hover bg-white px-4 text-base"
                    value={registerData.district}
                    onChange={(e) => setRegisterData({ ...registerData, district: e.target.value })}
                  >
                    <option>Bhopal</option>
                    <option>Sehore</option>
                    <option>Rajgarh</option>
                    <option>Indore</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="reg-education">{t("auth.education")}</Label>
                  <Input id="reg-education" value={registerData.education} onChange={(e) => setRegisterData({ ...registerData, education: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-profession">{t("auth.profession")}</Label>
                  <Input id="reg-profession" value={registerData.profession} onChange={(e) => setRegisterData({ ...registerData, profession: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="reg-phone">{t("auth.mobile")}</Label>
                  <Input id="reg-phone" value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t("auth.setPassword")}</Label>
                  <Input id="reg-password" type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={pending}>{pending ? t("auth.creating") : t("auth.register")}</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}