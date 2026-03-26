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
import { useShallow } from "zustand/shallow";
import { useManageProjectStore } from "../stores/useManageProjectStore";
import { manageProjectService } from "../services/manage-project.service";
import { useTranslations } from "next-intl";

export default function DeleteProjectDialog({
  open,
  onOpenChange,
}: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const t = useTranslations('Admin.ManageProject.dialogs.deleteProject');
  const tButton = useTranslations('Button');
  const tNoti = useTranslations('Admin.ManageProject.notifications');

  const { selectedProject, getProjectList } = useManageProjectStore(
    useShallow((state) => ({
      selectedProject: state.selectedProject,
      getProjectList: state.getProjectList,
    }))
  );

  const handleDelete = async () => {
    try {
      if (!selectedProject) return;

      const response = await manageProjectService.deleteProject(selectedProject.id);

      if (response?.success) {
        toast.success(tNoti('deleteSuccess'));
        getProjectList();
        onOpenChange(false);
      } else {
        toast.error(response?.message || tNoti('deleteError'));
      }
    } catch (error) {
      toast.error(tNoti('deleteException'));
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
            {selectedProject?.name}
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
