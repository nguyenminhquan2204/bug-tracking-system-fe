"use client";

import { useTranslations } from "next-intl";
import { IExpense } from "../interface";


type ExpenseSummaryProps = {
  totalAmount: number;
  expenseCount: number;
  lastExpense: IExpense | null;
};

export default function ExpenseSummary({
  totalAmount,
  expenseCount,
  lastExpense,
}: ExpenseSummaryProps) {
   const t = useTranslations('Admin.ManageExpense');

   return (
      <div className="grid gap-4 sm:grid-cols-3">
         <div className="rounded-lg border bg-background p-4 shadow-sm">
         <p className="text-sm text-muted-foreground">{t('subtitle.totalExpense')}</p>

         <p className="mt-2 text-3xl font-semibold text-foreground">
            {totalAmount}
         </p>
         </div>

         <div className="rounded-lg border bg-background p-4 shadow-sm">
         <p className="text-sm text-muted-foreground">{t('subtitle.expenseCount')}</p>

         <p className="mt-2 text-3xl font-semibold text-foreground">
            {expenseCount}
         </p>
         </div>

         <div className="rounded-lg border bg-background p-4 shadow-sm">
         <p className="text-sm text-muted-foreground">
            {t('subtitle.lastExpense')}
         </p>

         <p className="mt-2 text-lg font-medium text-foreground">
            {lastExpense
               ? `${lastExpense.amount}`
               : "Chưa có"}
         </p>

         <p className="text-sm text-muted-foreground">
            {lastExpense
               ? new Date(lastExpense.paymentDate).toLocaleDateString()
               : "-"}
         </p>
         </div>
      </div>
   );
}