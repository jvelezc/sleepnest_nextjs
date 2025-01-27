"use client"

import { Baby, Milk, PillBottle as BabyBottle, UtensilsCrossed } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { useChildStore } from "@/lib/store/child"

interface FeedingTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectType: (type: 'breastfeeding' | 'bottle' | 'formula' | 'solids') => void
}

export function FeedingTypeDialog({
  open,
  onOpenChange,
  onSelectType,
}: FeedingTypeDialogProps) {
  const { selectedChild } = useChildStore()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {selectedChild ? `Let's track ${selectedChild.name}'s feeding session together` : "Let's track a feeding session together"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          <Card 
            className="p-6 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onSelectType('breastfeeding')}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Baby className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Breastfeeding</h3>
                <p className="text-sm text-muted-foreground">Track a breastfeeding session</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onSelectType('bottle')}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Milk className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Bottle</h3>
                <p className="text-sm text-muted-foreground">Track a bottle feeding</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onSelectType('formula')}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BabyBottle className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Formula</h3>
                <p className="text-sm text-muted-foreground">Track a formula feeding</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onSelectType('solids')}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Solids</h3>
                <p className="text-sm text-muted-foreground">Track solid food meals</p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}