/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import ExpenseTable from "./ExpenseTable";
import { useTranslations } from "next-intl";

type ExpenseTableSectionProps = {
  expenses: any[];
  onCreate: () => void;
};

export default function ExpenseTableSection({
  expenses,
  onCreate,
}: ExpenseTableSectionProps) {
   const t = useTranslations('Admin.ManageExpense.table');
   const tButton = useTranslations('Button');

   return (
      <div className="rounded-md border bg-card p-4">
         <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
         <div>
            <h2 className="text-lg font-semibold">
               {t('title')}
            </h2>

            <p className="text-sm text-muted-foreground">
               {t('description')}
            </p>
         </div>
         <Button onClick={onCreate}>
            {tButton('create')}
         </Button>
         </div>

         <ExpenseTable data={expenses} />
      </div>
   );
}