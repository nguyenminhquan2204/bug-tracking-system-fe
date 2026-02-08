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

export default function DeleteUserDialog({
  open,
  onOpenChange,
}: { open: boolean, onOpenChange: (open: boolean) => void }) {

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
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
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
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            className="cursor-pointer"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
