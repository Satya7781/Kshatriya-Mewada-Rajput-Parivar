"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Heart, CheckCircle2, X, HeartOff, Phone, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SafeImage } from "@/components/ui/safe-image"
import {
  getMyInterestsAction,
  getMySentInterestsAction,
  getMyAcceptedInterestsAction,
  acceptInterestAction,
  declineInterestAction,
} from "@/lib/actions/interest"
import { useLang } from "@/lib/i18n/LanguageProvider"

interface InterestItem {
  id: number
  senderId: number
  receiverId: number
  name: string | null
  imageUrl: string | null
  type: string | null
  age: number | null
  gotraSelf: string | null
  gotraMother: string | null
  district: string | null
  contact: string | null
  status: string
  createdAt: Date
}

export function InterestsList() {
  const { t } = useLang()
  const [received, setReceived] = useState<InterestItem[]>([])
  const [sent, setSent] = useState<InterestItem[]>([])
  const [acceptedReceived, setAcceptedReceived] = useState<InterestItem[]>([])
  const [acceptedSent, setAcceptedSent] = useState<InterestItem[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const [rRes, sRes, aRes] = await Promise.all([
      getMyInterestsAction(),
      getMySentInterestsAction(),
      getMyAcceptedInterestsAction(),
    ])
    setLoading(false)
    if (rRes.success) setReceived(rRes.interests as InterestItem[])
    if (sRes.success) setSent(sRes.interests as InterestItem[])
    if (aRes.success) {
      setAcceptedReceived(aRes.received as InterestItem[])
      setAcceptedSent(aRes.sent as InterestItem[])
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function accept(id: number) {
    const res = await acceptInterestAction(id)
    if (!res.success) {
      toast.error(res.error)
      return
    }
    toast.success(t("int.accepted"))
    load()
  }

  async function decline(id: number) {
    const res = await declineInterestAction(id)
    if (!res.success) {
      toast.error(res.error)
      return
    }
    toast.info(t("int.declined"))
    load()
  }

  if (loading) return <div className="text-center text-muted-foreground">{t("int.loading")}</div>

  return (
    <Tabs defaultValue="received" className="w-full">
      <TabsList className="mb-6 flex w-full flex-wrap justify-center gap-2">
        <TabsTrigger value="received">{t("int.tabReceived")} ({received.length})</TabsTrigger>
        <TabsTrigger value="sent">{t("int.tabSent")} ({sent.length})</TabsTrigger>
        <TabsTrigger value="accepted">{t("int.tabAccepted")} ({acceptedReceived.length + acceptedSent.length})</TabsTrigger>
      </TabsList>

      {/* Received — pending ones need action */}
      <TabsContent value="received">
        {received.length === 0 ? (
          <EmptyState icon={HeartOff} text={t("int.none")} />
        ) : (
          <div className="space-y-4">
            {received.map((item) => (
              <InterestRow
                key={item.id}
                item={item}
                showContact={item.status === "ACCEPTED"}
                actions={
                  item.status === "PENDING" ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => decline(item.id)}>
                        <X className="mr-1 h-4 w-4" /> {t("int.decline")}
                      </Button>
                      <Button size="sm" onClick={() => accept(item.id)}>
                        <Heart className="mr-1 h-4 w-4" /> {t("int.accept")}
                      </Button>
                    </>
                  ) : (
                    <StatusBadge status={item.status} t={t} />
                  )
                }
                t={t}
              />
            ))}
          </div>
        )}
      </TabsContent>

      {/* Sent — track outgoing */}
      <TabsContent value="sent">
        {sent.length === 0 ? (
          <EmptyState icon={Send} text={t("int.sentNone")} />
        ) : (
          <div className="space-y-4">
            {sent.map((item) => (
              <InterestRow
                key={item.id}
                item={item}
                showContact={item.status === "ACCEPTED"}
                actions={<StatusBadge status={item.status} t={t} />}
                t={t}
              />
            ))}
          </div>
        )}
      </TabsContent>

      {/* Accepted — connections with contact revealed */}
      <TabsContent value="accepted">
        {acceptedReceived.length + acceptedSent.length === 0 ? (
          <EmptyState icon={Heart} text={t("int.acceptedNone")} />
        ) : (
          <div className="space-y-6">
            {acceptedReceived.length > 0 && (
              <div>
                <h4 className="mb-3 font-heading text-lg font-bold text-maroon">{t("int.tabReceived")}</h4>
                <div className="space-y-4">
                  {acceptedReceived.map((item) => (
                    <InterestRow key={item.id} item={item} showContact actions={null} t={t} />
                  ))}
                </div>
              </div>
            )}
            {acceptedSent.length > 0 && (
              <div>
                <h4 className="mb-3 font-heading text-lg font-bold text-maroon">{t("int.tabSent")}</h4>
                <div className="space-y-4">
                  {acceptedSent.map((item) => (
                    <InterestRow key={item.id} item={item} showContact actions={null} t={t} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

function InterestRow({
  item,
  showContact,
  actions,
  t,
}: {
  item: InterestItem
  showContact: boolean
  actions: React.ReactNode
  t: (key: any, vars?: Record<string, string | number>) => string
}) {
  return (
    <Card className="flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-gold">
          <SafeImage
            src={item.imageUrl}
            name={item.name ?? undefined}
            alt={item.name ?? ""}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="font-heading text-lg font-bold text-maroon">{item.name}</div>
          <div className="text-sm text-muted-foreground">
            {item.age ?? "-"} {t("profiles.yrs")} · {t("modal.gotraSelf")}: {item.gotraSelf} ({t("modal.gotraMother")}: {item.gotraMother}) · {t("profiles.district")}: {item.district}
          </div>
          {showContact && item.contact && (
            <a href={`tel:+91${item.contact}`} className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-saffron">
              <Phone className="h-3.5 w-3.5" /> +91 {item.contact}
            </a>
          )}
        </div>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </Card>
  )
}

function StatusBadge({ status, t }: { status: string; t: (key: any) => string }) {
  const label = status === "ACCEPTED" ? t("int.acceptedBadge") : status === "DECLINED" ? t("int.declinedBadge") : t("int.pending")
  const color = status === "ACCEPTED" ? "bg-green-100 text-green-700" : status === "DECLINED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${color}`}>
      {status === "ACCEPTED" && <CheckCircle2 className="h-3 w-3" />}
      {label}
    </span>
  )
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <Card className="p-8 text-center">
      <Icon className="mx-auto mb-3 h-10 w-10 text-gold" />
      <p className="font-semibold text-muted-foreground">{text}</p>
    </Card>
  )
}