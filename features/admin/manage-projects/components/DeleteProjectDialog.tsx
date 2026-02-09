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

export default function DeleteProjectDialog({
  open,
  onOpenChange,
}: { open: boolean, onOpenChange: (open: boolean) => void }) {

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
        toast.success("Deleted project successfully");
        getProjectList();
        onOpenChange(false);
      } else {
        toast.error(response?.message || "Failed to delete project");
      }
    } catch (error) {
      toast.error("An error occurred while deleting project");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
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
