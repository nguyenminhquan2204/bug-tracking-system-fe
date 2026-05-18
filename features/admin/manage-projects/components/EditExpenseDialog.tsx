"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/shallow";
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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import {
  createExpenseSchema,
  CreateExpenseType,
  updateExpenseSchema,
  UpdateExpenseType,
} from "../schema";

import { useManageProjectStore } from "../stores/useManageProjectStore";
import { useManageExpenseStore } from "../stores/useManageExpenseStore";
import { manageExpenseService } from "../services/manage-expense.service";

interface IUpdateExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
}

export default function EditExpenseDialog({
  open,
  onOpenChange,
  loading = false,
}: IUpdateExpenseDialogProps) {
  const tValidation = useTranslations("Admin.ManageExpense");
  const tNotification = useTranslations("Admin.ManageExpense");
  const params = useParams();
  const selectedExpense = useManageExpenseStore(
    (state) => state.selectedExpense,
  );
  const { usersList, getUsersList } = useManageProjectStore(
    useShallow((state) => ({
      usersList: state.usersList,
      getUsersList: state.getUsersList,
    })),
  );

  const { getExpenseList, getExpenseSummary } = useManageExpenseStore(
    useShallow((state) => ({
      getExpenseList: state.getExpenseList,
      getExpenseSummary: state.getExpenseSummary,
    })),
  );

  const form = useForm<UpdateExpenseType>({
    resolver: zodResolver(updateExpenseSchema(tValidation)),
    defaultValues: {
      name: "",
      description: "",
      paymentDate: "",
      amount: 0,
      currency: "VND",
      status: "PENDING",
      receiptUrl: "",
      buyerId: 0,
      managerId: 0,
      projectId: 0,
    },
  });

  useEffect(() => {
    getUsersList();
  }, []);

  useEffect(() => {
    if (open && selectedExpense) {
      form.reset({
        name: selectedExpense.name ?? "",
        description: selectedExpense.description ?? "",
        paymentDate: selectedExpense.paymentDate ?? "",
        amount: Number(selectedExpense.amount) ?? 0,
        currency: selectedExpense.currency ?? "VND",
        status: selectedExpense.status as "PENDING" | "PAID" | "CANCELLED",
        receiptUrl: selectedExpense.receiptUrl ?? "",
        buyerId: Number(selectedExpense.buyerId) ?? 0,
        managerId: Number(selectedExpense.managerId) ?? 0,
        projectId: Number(selectedExpense.projectId) ?? 0,
      });
    }
  }, [open, selectedExpense, form]);

  const handleSubmit = async (values: UpdateExpenseType) => {
    if (!params.id || !selectedExpense?.id) return;

    try {
      const response = await manageExpenseService.updateExpense(
        selectedExpense.id,
        values,
      );

      if (response?.success) {
        toast.success(tNotification("notifications.updateSuccess"));

        getExpenseList(Number(params.id));
        getExpenseSummary(Number(params.id));

        onOpenChange(false);
      } else {
        toast.error(
          response?.message || tNotification("notifications.updateError"),
        );
      }
    } catch (error) {
      toast.error(tNotification("notifications.updateException"));
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Update Expense</DialogTitle>

          <DialogDescription>Update expense information.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expense Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter expense name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="VND">VND</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="receiptUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buyerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyer</FormLabel>

                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select buyer" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {usersList?.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.userName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="managerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manager</FormLabel>

                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {usersList?.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.userName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
