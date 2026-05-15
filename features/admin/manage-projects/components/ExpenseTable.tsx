"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useManageExpenseStore } from "../stores/useManageExpenseStore";
import { useShallow } from "zustand/shallow";
import { useLocale, useTranslations } from "next-intl";
import { IExpense } from "../interface";
export default function ExpenseTable({ data }: { data: IExpense[] }) {
  const t = useTranslations("Admin.ManageExpense.table.columns");
  const locale = useLocale();
  const {
    setSelectedExpense,
    isOpenEditExpenseDialog,
    setIsOpenEditExpenseDialog,
    isOpenDeleteExpenseDialog,
    setIsOpenDeleteExpenseDialog,
  } = useManageExpenseStore(
    useShallow((state) => ({
      setSelectedExpense: state.setSelectedExpense,
      isOpenEditExpenseDialog: state.isOpenEditExpenseDialog,
      setIsOpenEditExpenseDialog: state.setIsOpenEditExpenseDialog,
      isOpenDeleteExpenseDialog: state.isOpenDeleteExpenseDialog,
      setIsOpenDeleteExpenseDialog: state.setIsOpenDeleteExpenseDialog,
    })),
  );

  const formatDate = (value?: string) =>
    value ? new Intl.DateTimeFormat(locale).format(new Date(value)) : "—";

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("paymentDate")}</TableHead>
              <TableHead>{t("amount")}</TableHead>
              <TableHead>{t("currency")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("buyer")}</TableHead>
              <TableHead>{t("manager")}</TableHead>
              <TableHead>{t("actions.title")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {item.description || "—"}
                  </TableCell>
                  <TableCell>{formatDate(item.paymentDate)}</TableCell>
                  <TableCell>{formatCurrency(item.amount)}</TableCell>
                  <TableCell>{item.currency}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item?.buyer.userName || "-"}</TableCell>
                  <TableCell>{item?.manager.userName || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedExpense(item);
                            setIsOpenEditExpenseDialog(true);
                          }}
                        >
                          {t("actions.options.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedExpense(item);
                            setIsOpenDeleteExpenseDialog(true);
                          }}
                        >
                          {t("actions.options.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  {t("empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
