import { useShallow } from "zustand/shallow"
import { useManageBugStore } from "../stores/useManageBugStore"

export function HeaderBugSummary() {
   const { summary } = useManageBugStore(useShallow((state) => ({
      summary: state.summary
   })))  

   return (
      <>
         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
               <p className="text-sm text-gray-500">Total Bugs</p>
               <h2 className="mt-3 text-3xl font-bold">{summary?.totalBug}</h2>
               <p className="mt-2 text-sm text-green-600">+{summary?.bugCreatedThisWeek} this week</p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
               <p className="text-sm text-gray-500">Open Bugs</p>
               <h2 className="mt-3 text-3xl font-bold">{summary?.todoBug}</h2>
               <p className="mt-2 text-sm text-red-600">{summary?.criticalBug} critical issues</p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
               <p className="text-sm text-gray-500">Resolved</p>
               <h2 className="mt-3 text-3xl font-bold">{summary?.doneInDevBug}</h2>
               <p className="mt-2 text-sm text-green-600">{summary?.completionPercentage}% resolution rate</p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
               <p className="text-sm text-gray-500">Avg Fix Time</p>
               <h2 className="mt-3 text-3xl font-bold">{summary?.averageFixTimeHours}</h2>
               <p className="mt-2 text-sm text-gray-500">Last 30 days</p>
            </div>
         </div>
      </>
   )
}