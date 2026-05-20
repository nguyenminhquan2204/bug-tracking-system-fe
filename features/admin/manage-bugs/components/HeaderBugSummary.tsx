import { useShallow } from "zustand/shallow"
import { useManageBugStore } from "../stores/useManageBugStore"
import { useTranslations } from "next-intl"

export function HeaderBugSummary() {
   const t = useTranslations('Admin.ManageBug.header');
   const { summary } = useManageBugStore(useShallow((state) => ({
      summary: state.summary
   })))  

   return (
      <>
         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
               <p className="text-sm text-gray-500">{t('totalBug')}</p>
               <h2 className="mt-3 text-3xl font-bold">{summary?.totalBug}</h2>
               <p className="mt-2 text-sm text-green-600">+{summary?.bugCreatedThisWeek} {t('thisWeek')}</p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
               <p className="text-sm text-gray-500">{t('openBug')}</p>
               <h2 className="mt-3 text-3xl font-bold">{summary?.todoBug}</h2>
               <p className="mt-2 text-sm text-red-600">{summary?.criticalBug} {t('critical')}</p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
               <p className="text-sm text-gray-500">{t('resolve')}</p>
               <h2 className="mt-3 text-3xl font-bold">{summary?.doneInDevBug}</h2>
               <p className="mt-2 text-sm text-green-600">{summary?.completionPercentage}% {t('resolutionRate')}</p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
               <p className="text-sm text-gray-500">{t('avg')}</p>
               <h2 className="mt-3 text-3xl font-bold">{summary?.averageFixTimeHours}</h2>
               <p className="mt-2 text-sm text-gray-500">{t('last30Day')}</p>
            </div>
         </div>
      </>
   )
}