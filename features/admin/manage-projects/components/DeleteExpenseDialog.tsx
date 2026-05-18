"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useManageExpenseStore } from "../stores/useManageExpenseStore";
import { manageExpenseService } from "../services/manage-expense.service";
import { useShallow } from "zustand/shallow";

interface IDeleteExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
}

export default function DeleteExpenseDialog({
  open,
  onOpenChange,
  loading = false,
}: IDeleteExpenseDialogProps) {
  const tNotification = useTranslations("Admin.ManageExpense");
  const params = useParams();

  const selectedExpense = useManageExpenseStore(
    (state) => state.selectedExpense,
  );

  const { getExpenseList, getExpenseSummary } = useManageExpenseStore(
    useShallow((state) => ({
      getExpenseList: state.getExpenseList,
      getExpenseSummary: state.getExpenseSummary,
    })),
  );

  const handleDelete = async () => {
    if (!params.id || !selectedExpense?.id) return;

    try {
      const response = await manageExpenseService.deleteExpense(
        selectedExpense.id,
      );

      if (response?.success) {
        toast.success(tNotification("notifications.deleteSuccess"));

        getExpenseList(Number(params.id));
        getExpenseSummary(Number(params.id));

        onOpenChange(false);
      } else {
        toast.error(
          response?.message || tNotification("notifications.deleteError"),
        );
      }
    } catch (error) {
      toast.error(tNotification("notifications.deleteException"));

      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Expense</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this expense?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border bg-muted/50 p-4">
          <p className="font-medium">{selectedExpense?.name}</p>

          <p className="text-sm text-muted-foreground">
            Amount: {selectedExpense?.amount} {selectedExpense?.currency}
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading ? "Deleting..." : "Delete Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
