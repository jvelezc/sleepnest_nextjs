"use client"

import { useState } from "react"
import { Baby } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddChildDialog } from "@/components/add-child-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useChildStore } from "@/lib/store/child"

interface Child {
  id: string
  name: string
}

interface ChildSelectorProps {
  children: Child[]
  caregiverId: string
  onChildAdded: () => void
}

export function ChildSelector({
  children,
  caregiverId,
  onChildAdded
}: ChildSelectorProps) {
  const [addChildOpen, setAddChildOpen] = useState(false)
  const { selectedChild, setSelectedChild } = useChildStore()

  if (children.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Baby className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">No Children Added</h3>
            <p className="text-sm text-muted-foreground">
              Add your first child to start tracking their activities
            </p>
          </div>
          <Button onClick={() => setAddChildOpen(true)}>
            Add Your First Child
          </Button>
          <AddChildDialog
            open={addChildOpen}
            onOpenChange={setAddChildOpen}
            caregiverId={caregiverId}
            onSuccess={() => {
              onChildAdded()
              setAddChildOpen(false)
            }}
          />
        </div>
      </Card>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Select
        value={selectedChild?.id}
        onValueChange={(value) => {
          const child = children.find(c => c.id === value)
          if (child) setSelectedChild(child)
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a child" />
        </SelectTrigger>
        <SelectContent>
          {children.map((child) => (
            <SelectItem key={child.id} value={child.id}>
              {child.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setAddChildOpen(true)}
      >
        <Baby className="h-4 w-4 mr-2" />
        Add Another Child
      </Button>

      <AddChildDialog
        open={addChildOpen}
        onOpenChange={setAddChildOpen}
        caregiverId={caregiverId}
        onSuccess={() => {
          onChildAdded()
          setAddChildOpen(false)
        }}
      />
    </div>
  )
}