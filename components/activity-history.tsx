"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeedingHistory } from "@/components/feeding-history"
import { NapHistory } from "@/components/nap-tracker/nap-history"
import { Card } from "@/components/ui/card"

export function ActivityHistory() {
  return (
    <Card>
      <Tabs defaultValue="feeding" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="feeding">Feedings</TabsTrigger>
          <TabsTrigger value="naps">Naps</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
        </TabsList>
        <TabsContent value="feeding">
          <FeedingHistory />
        </TabsContent>
        <TabsContent value="naps">
          <NapHistory />
        </TabsContent>
        <TabsContent value="sleep">
          <div className="text-center py-6 text-muted-foreground">
            Sleep tracking coming soon
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}