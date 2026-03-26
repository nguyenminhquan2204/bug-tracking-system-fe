'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { manageUserService } from "../services/manage-user.service";
import { useManageUserStore } from "../stores/useManageUserStore";
import { useShallow } from "zustand/shallow";
import { useTranslations } from "next-intl";

export default function DeleteUserDialog({
  open,
  onOpenChange,
}: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const t = useTranslations('Admin.ManageUser.dialogs.deleteUser');
  const tButton = useTranslations('Button');
  const { selectedUser, getUserList } = useManageUserStore(
    useShallow((state) => ({
      selectedUser: state.selectedUser,
      getUserList: state.getUserList,
    }))
  );

  const handleDelete = async () => {
    try {
      if (!selectedUser) return;

      const response = await manageUserService.deleteUser(selectedUser.id);

      if (response?.success) {
        toast.success("Deleted user successfully");
        getUserList();
        onOpenChange(false);
      } else {
        toast.error(response?.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred while deleting user");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground">
          {t('description')}{" "}
          <span className="font-medium text-foreground">
            {selectedUser?.userName}
          </span>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            {tButton('cancel')}
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            className="cursor-pointer"
          >
            {tButton('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
