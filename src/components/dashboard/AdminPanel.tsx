"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Shield, UserCheck, AlertTriangle, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminReviewModal } from "@/components/dashboard/AdminReviewModal"
import { listPendingRequestsAction, approveUserAction, rejectUserAction, deleteUserAction } from "@/lib/actions/admin"
import { listApprovedProfilesAction } from "@/lib/actions/profiles"
import { useLang } from "@/lib/i18n/LanguageProvider"
import type { PublicProfile } from "@/types"

export function AdminPanel() {
  const { t } = useLang()
  const [pending, setPending] = useState<PublicProfile[]>([])
  const [approved, setApproved] = useState<PublicProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewProfile, setReviewProfile] = useState<PublicProfile | null>(null)

  async function load() {
    setLoading(true)
    const [pRes, aRes] = await Promise.all([listPendingRequestsAction(), listApprovedProfilesAction()])
    setLoading(false)
    if (pRes.success) setPending(pRes.pending as PublicProfile[])
    if (aRes.success) setApproved(aRes.profiles as PublicProfile[])
  }

  useEffect(() => {
    load()
  }, [])

  async function approve(id: number) {
    const res = await approveUserAction(id)
    if (!res.success) {
      toast.error(res.error)
      return
    }
    toast.success(t("admin.approved"))
    load()
  }

  async function reject(id: number) {
    const res = await rejectUserAction(id)
    if (!res.success) {
      toast.error(res.error)
      return
    }
    toast.info(t("admin.rejected"))
    load()
  }

  async function remove(id: number) {
    if (!confirm(t("admin.confirmDelete"))) return
    const res = await deleteUserAction(id)
    if (!res.success) {
      toast.error(res.error)
      return
    }
    toast.success(t("admin.deleted"))
    load()
  }

  if (loading) return <div className="text-center text-muted-foreground">{t("admin.loading")}</div>

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">{pending.length}</div>
            <div>
              <div className="font-bold text-maroon">{t("admin.pending")}</div>
              <div className="text-sm text-muted-foreground">{t("admin.pendingSub")}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">{approved.length}</div>
            <div>
              <div className="font-bold text-maroon">{t("admin.members")}</div>
              <div className="text-sm text-muted-foreground">{t("admin.membersSub")}</div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold text-maroon">
          <UserCheck className="h-5 w-5 text-saffron" /> {t("admin.pendingTitle")}
        </h3>
        {pending.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">{t("admin.noPending")}</Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.name")}</TableHead>
                <TableHead>{t("admin.phone")}</TableHead>
                <TableHead>{t("admin.gotras")}</TableHead>
                <TableHead>{t("admin.location")}</TableHead>
                <TableHead className="text-right">{t("admin.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((p) => (
                <TableRow key={p.userId}>
                  <TableCell className="font-semibold">{p.username} ({p.type})</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{t("modal.gotraSelf")}: {p.gotraSelf} / {t("modal.gotraMother")}: {p.gotraMother}</TableCell>
                  <TableCell>{p.district}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setReviewProfile(p)}>
                        <Eye className="mr-1 h-3 w-3" /> {t("admin.review")}
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => approve(p.userId)}>
                        <UserCheck className="mr-1 h-3 w-3" /> {t("admin.approve")}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => reject(p.userId)}>
                        <AlertTriangle className="mr-1 h-3 w-3" /> {t("admin.reject")}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold text-maroon">
          <Shield className="h-5 w-5 text-gold" /> {t("admin.manageTitle")}
        </h3>
        {approved.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">{t("admin.noMembers")}</Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.name")}</TableHead>
                <TableHead>{t("admin.phone")}</TableHead>
                <TableHead>{t("admin.status")}</TableHead>
                <TableHead className="text-right">{t("admin.delete")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approved.map((p) => (
                <TableRow key={p.userId}>
                  <TableCell className="font-semibold">{p.username} ({p.type})</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell><span className="font-bold text-green-600">APPROVED</span></TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="destructive" onClick={() => remove(p.userId)}>
                      <Trash2 className="mr-1 h-3 w-3" /> {t("admin.delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AdminReviewModal
        profile={reviewProfile}
        open={!!reviewProfile}
        onOpenChange={(o) => !o && setReviewProfile(null)}
        onApprove={approve}
        onReject={reject}
      />
    </div>
  )
}