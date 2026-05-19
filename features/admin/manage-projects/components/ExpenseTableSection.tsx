/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import ExpenseTable from "./ExpenseTable";
import { useTranslations } from "next-intl";
import PaginationCustom from "@/features/components/PaginationCustom";
import { useManageExpenseStore } from "../stores/useManageExpenseStore";
import { useShallow } from "zustand/shallow";
import { DEFAULT_FIRST_PAGE } from "@/packages/utils";

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
   const { 
      totalItems, 
      expenseGetListQuery,
      setExpenseGetListQuery
   } = useManageExpenseStore(useShallow((state) => ({
      totalItems: state.totalItems,
      expenseGetListQuery: state.expenseGetListQuery,
      setExpenseGetListQuery: state.setExpenseGetListQuery
   })))

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
         <div className="my-4"></div>
         <PaginationCustom 
            totalItems={totalItems}
            currentPage={expenseGetListQuery.page || DEFAULT_FIRST_PAGE}
            limit={expenseGetListQuery.limit || 10}
            onChangePage={(page) => setExpenseGetListQuery({ page })}
            onItemsPerPageChange={(limit) =>
               setExpenseGetListQuery({ limit, page: DEFAULT_FIRST_PAGE })
            }
            itemLabel="expenses"
         />
      </div>
   );
}