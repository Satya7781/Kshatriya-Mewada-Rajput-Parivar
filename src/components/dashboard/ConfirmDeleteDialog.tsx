"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"
import { useLang } from "@/lib/i18n/LanguageProvider"

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetName: string | null
  onConfirm: () => void
}

/**
 * Destructive-action guard: requires the admin to type the member's exact
 * name before the delete button enables. Prevents misclicks from destroying
 * a family's profile (now a soft-delete, but still gated for intent).
 */
export function ConfirmDeleteDialog({ open, onOpenChange, targetName, onConfirm }: ConfirmDeleteDialogProps) {
  const { t } = useLang()
  const [typed, setTyped] = useState("")
  const expected = (targetName ?? "").trim()
  const matches = typed.trim() === expected && expected.length > 0

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setTyped("")
        onOpenChange(o)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading text-xl font-bold text-maroon">
            <AlertTriangle className="h-5 w-5 text-red-600" /> {t("admin.delete")}
          </DialogTitle>
          <DialogDescription>
            {t("admin.confirmDelete")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>
            {t("admin.typeToConfirm")} <span className="font-bold text-maroon">{expected}</span>
          </Label>
          <Input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={expected}
            autoFocus
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("admin.cancel")}
          </Button>
          <Button
            variant="destructive"
            disabled={!matches}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {t("admin.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}