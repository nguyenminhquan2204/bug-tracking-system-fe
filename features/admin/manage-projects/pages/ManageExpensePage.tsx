"use client";

import { useParams, useRouter } from "next/navigation";
import TitleDescription from "@/features/components/TitleDescription";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import ExpenseTableSection from "../components/ExpenseTableSection";
import ExpenseSummary from "../components/ExpenseSummary";
import { useManageExpenseStore } from "../stores/useManageExpenseStore";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";

export function ManageExpensePage() {
  const t = useTranslations('Admin.ManageExpense');
  const tButton = useTranslations('Button');
  const router = useRouter();
  const params = useParams();
  const { 
    getExpenseList, 
    getExpenseSumanry,
    expenseList, 
    totalItems, 
    totalAmount,
    totalTransactions,
    latestTransaction
  } = useManageExpenseStore(useShallow((state) => ({
    getExpenseList: state.getExpenseList,
    getExpenseSumanry: state.getExpenseSumanry,
    expenseList: state.expenseList,
    totalItems: state.totalItems,
    totalAmount: state.totalAmount,
    totalTransactions: state.totalTransactions,
    latestTransaction: state.latestTransaction,
  })))

  const openCreateDialog = () => {
    alert("Open create expense dialog");
  }

  useEffect(() => {
    if(!params || !params.id) return;

    const fetchApi = async () => {
      const projectId = Number(params.id);
      
      await Promise.all([
        getExpenseList(projectId),
        getExpenseSumanry(projectId),
      ])
    }
    fetchApi();
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <TitleDescription
          title={t('title')}
          description={t('description')}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/admin/manage-projects")}
          >
            {tButton('back')}
          </Button>
        </div>
      </div>
      <ExpenseSummary
        totalAmount={totalAmount}
        expenseCount={totalTransactions}
        lastExpense={latestTransaction}
      />

      <ExpenseTableSection
        expenses={expenseList}
        onCreate={openCreateDialog}
      />
    </div>
  );
}
