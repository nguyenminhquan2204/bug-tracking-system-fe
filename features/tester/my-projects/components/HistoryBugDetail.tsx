import { useShallow } from "zustand/shallow";
import { IBug } from "../interface";
import { useMyProjectStore } from "../stores/useMyProjectStore";
import { useEffect } from "react";
import { ArrowRight, User } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HistoryBugDetail({ selectedBug }: { selectedBug: IBug }) {
   const t = useTranslations("Tester.MyProjects.history")
   const { getBugHistoryById, bugHistorys } = useMyProjectStore(
      useShallow((state) => ({
         getBugHistoryById: state.getBugHistoryById,
         bugHistorys: state.bugHistorys,
      }))
   );

   useEffect(() => {
      if (!selectedBug) return;
      getBugHistoryById(selectedBug.id);
   }, [getBugHistoryById, selectedBug]);

   return (
      <div className="mt-4">
         <h3 className="text-sm font-semibold mb-4">{t("title")}</h3>

         {bugHistorys && bugHistorys.length > 0 ? (
            <div className="relative max-h-[350px] overflow-y-auto pr-4 space-y-6">
               {bugHistorys.map((item) => (
                  <div key={item.id} className="relative flex gap-4">
                     <div className="relative z-10 h-3 w-3 mt-3 rounded-full bg-primary" />
                     <div className="flex-1 rounded-xl border bg-background p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2 text-sm font-medium">
                              <User size={14} />
                              {item.updatedByUser?.userName}
                           </div>
                           <span className="text-xs text-muted-foreground">
                              {new Date(item.createdAt).toLocaleString()}
                           </span>
                        </div>
                        <div className="mb-3">
                           <span className="text-xs font-semibold px-2 py-1 rounded-md bg-muted text-foreground">
                              {item.fieldChanged}
                           </span>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
                           <div className="rounded-md border bg-muted/30 p-2">
                              <p className="text-xs text-muted-foreground mb-1">{t("old")}</p>
                              <p className="font-medium break-words">
                                 {item.oldValue || "--"}
                              </p>
                           </div>
                           <ArrowRight size={16} className="text-muted-foreground" />
                           <div className="rounded-md border bg-primary/5 p-2">
                              <p className="text-xs text-muted-foreground mb-1">{t("new")}</p>
                              <p className="font-medium break-words">
                                 {item.newValue || "--"}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <p className="text-muted-foreground text-sm">{t("empty")}</p>
         )}
      </div>
   );
}
