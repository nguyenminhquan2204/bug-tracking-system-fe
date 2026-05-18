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
import CreateExpenseDialog from "../components/CreateExpenseDialog";
import EditExpenseDialog from "../components/EditExpenseDialog";
import DeleteExpenseDialog from "../components/DeleteExpenseDialog";

export function ManageExpensePage() {
  const t = useTranslations("Admin.ManageExpense");
  const tButton = useTranslations("Button");
  const router = useRouter();
  const params = useParams();
  const {
    loading,
    isOpenCreateExpenseDialog,
    setisOpenCreateExpenseDialog,
    isOpenEditExpenseDialog,
    setIsOpenEditExpenseDialog,
    isOpenDeleteExpenseDialog,
    setIsOpenDeleteExpenseDialog,
    getExpenseList,
    getExpenseSummary,
    expenseList,
    totalAmount,
    totalTransactions,
    latestTransaction,
  } = useManageExpenseStore(
    useShallow((state) => ({
      loading: state.loading,
      isOpenCreateExpenseDialog: state.isOpenCreateExpenseDialog,
      setisOpenCreateExpenseDialog: state.setisOpenCreateExpenseDialog,
      isOpenEditExpenseDialog: state.isOpenEditExpenseDialog,
      setIsOpenEditExpenseDialog: state.setIsOpenEditExpenseDialog,
      isOpenDeleteExpenseDialog: state.isOpenDeleteExpenseDialog,
      setIsOpenDeleteExpenseDialog: state.setIsOpenDeleteExpenseDialog,
      getExpenseList: state.getExpenseList,
      getExpenseSummary: state.getExpenseSummary,
      expenseList: state.expenseList,
      totalAmount: state.totalAmount,
      totalTransactions: state.totalTransactions,
      latestTransaction: state.latestTransaction,
    })),
  );

  const openCreateDialog = () => {
    setisOpenCreateExpenseDialog(true);
  };

  useEffect(() => {
    if (!params || !params.id) return;

    const fetchApi = async () => {
      const projectId = Number(params.id);

      await Promise.all([
        getExpenseList(projectId),
        getExpenseSummary(projectId),
      ]);
    };
    fetchApi();
  }, []);

  return (
    <>
      <CreateExpenseDialog
        open={isOpenCreateExpenseDialog}
        onOpenChange={setisOpenCreateExpenseDialog}
        loading={loading}
        projectId={params?.id ? Number(params.id) : undefined}
      />
      <EditExpenseDialog
        open={isOpenEditExpenseDialog}
        onOpenChange={setIsOpenEditExpenseDialog}
        loading={loading}
      />
      <DeleteExpenseDialog
        open={isOpenDeleteExpenseDialog}
        onOpenChange={setIsOpenDeleteExpenseDialog}
        loading={loading}
      />
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <TitleDescription title={t("title")} description={t("description")} />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/admin/manage-projects")}
            >
              {tButton("back")}
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
    </>
  );
}
