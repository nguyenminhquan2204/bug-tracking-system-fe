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
import CommentBugDetail from "./CommentBugDetail"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import HistoryBugDetail from "./HistoryBugDetail"
import { useTranslations } from "next-intl"
import { normalizeBugPriorityKey, normalizeBugStatusKey } from "../constants"

interface Props {
  selectedBug: IBug | null
  setSelectedBug: (bug: IBug | null) => void
}

export default function BugDetail({ selectedBug, setSelectedBug }: Props) {
  const t = useTranslations("Developer.MyProjects")

  return (
    <>
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
                </SheetTitle>
                <div className="flex gap-2 pt-2">
                  <Badge variant="outline">
                    {t("fields.priority")}: {t(`priority.options.${normalizeBugPriorityKey(selectedBug.priority)}`)}
                  </Badge>
                  <Badge>
                    {t("fields.status")}: {t(`status.options.${normalizeBugStatusKey(selectedBug.status)}`)}
                  </Badge>
                </div>
              </SheetHeader>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                  {t("fields.description")}
                </h3>
                <div className="rounded-lg border p-3 bg-muted/30">
                    {selectedBug.description ? (
                      <RichTextViewer content={selectedBug.description} />
                    ) : (
                      <p className="text-muted-foreground text-sm">
                          {t("detail.noDescription")}
                      </p>
                    )}
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                    {t("detail.assignedDeveloper")}
                  </h3>
                  <div className="mt-2 rounded-lg border p-3 text-sm bg-muted/20">
                    {selectedBug.developer ? (
                      <>
                        <p className="font-medium">
                          {selectedBug.developer.userName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {selectedBug.developer.email || t("detail.noEmail")}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">{t("detail.unassigned")}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                    {t("detail.reportedBy")}
                  </h3>
                  <div className="mt-2 rounded-lg border p-3 text-sm bg-muted/20">
                    {selectedBug.reporter ? (
                      <>
                        <p className="font-medium">
                          {selectedBug.reporter.userName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {selectedBug.reporter.email || t("detail.noEmail")}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground">{t("detail.unknown")}</p>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              <Tabs defaultValue="comments" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="comments" className="cursor-pointer">{t("detail.tabs.comments")}</TabsTrigger>
                  <TabsTrigger value="history" className="cursor-pointer">{t("detail.tabs.history")}</TabsTrigger>
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
