'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { IBug } from "../interface"
import RichTextViewer from "./RichTextViewer"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useMyProjectStore } from "../stores/useMyProjectStore"
import { useShallow } from "zustand/shallow"
import EditBugDialog from "./EditBugDrawer"
import CommentBugDetail from "./CommentBugDetail"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import HistoryBugDetail from "./HistoryBugDetail"

interface Props {
  selectedBug: IBug | null
  setSelectedBug: (bug: IBug | null) => void
}

export default function BugDetail({ selectedBug, setSelectedBug }: Props) {
  const { setIsOpenDialogEditBug, isOpenDialogEditBug } = useMyProjectStore(useShallow((state) => ({
    setIsOpenDialogEditBug: state.setIsOpenDialogEditBug,
    isOpenDialogEditBug: state.isOpenDialogEditBug
  })))

  return (
    <>
      <EditBugDialog 
        open={isOpenDialogEditBug}
        onOpenChange={setIsOpenDialogEditBug}
        bug={selectedBug}
        onSuccess={() => { setSelectedBug(null)}}
      />
      <Sheet
        open={!!selectedBug}
        onOpenChange={(open) => {
          if (!open) setSelectedBug(null)
        }}
      >
        <SheetContent side="right" className="!max-w-[700px] p-2 overflow-y-auto">
          {selectedBug && (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle className="text-xl font-semibold leading-tight">
                  {selectedBug.title}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                    onClick={() => setIsOpenDialogEditBug(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </SheetTitle>
                <div className="flex gap-2 pt-2">
                  <Badge variant="outline">
                    Priority: {selectedBug.priority}
                  </Badge>
                  <Badge>
                    Status: {selectedBug.status}
                  </Badge>
                </div>
              </SheetHeader>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                  Description
                </h3>
                <div className="rounded-lg border p-3 bg-muted/30">
                    {selectedBug.description ? (
                      <RichTextViewer content={selectedBug.description} />
                    ) : (
                      <p className="text-muted-foreground text-sm">
                          No description provided
                      </p>
                    )}
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                    Assigned Developer
                  </h3>
                  <div className="mt-2 rounded-lg border p-3 text-sm bg-muted/20">
                    {selectedBug.developer ? (
                      <>
                        <p className="font-medium">
                          {selectedBug.developer.userName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {selectedBug.developer.email || "No email"}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Unassigned</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                    Reported By
                  </h3>
                  <div className="mt-2 rounded-lg border p-3 text-sm bg-muted/20">
                    {selectedBug.reporter ? (
                      <>
                        <p className="font-medium">
                          {selectedBug.reporter.userName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {selectedBug.reporter.email || "No email"}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Unknown</p>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <Tabs defaultValue="comments" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="comments" className="cursor-pointer">Comments</TabsTrigger>
                  <TabsTrigger value="history" className="cursor-pointer">History</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="space-y-4 mt-4">
                  <CommentBugDetail selectedBug={selectedBug} />
                </TabsContent>
                <TabsContent value="history" className="space-y-4 mt-4">
                  <HistoryBugDetail selectedBug={selectedBug} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
