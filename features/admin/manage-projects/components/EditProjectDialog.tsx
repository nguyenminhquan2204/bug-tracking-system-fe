'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { manageProjectService } from "../services/manage-project.service";
import { UpdateProjectSchema, UpdateProjectType } from "../schema";
import { useManageProjectStore } from "../stores/useManageProjectStore";
import { useShallow } from "zustand/shallow";

export default function EditProjectDialog({
  open,
  onOpenChange
}: {
   open: boolean,
   onOpenChange: (open: boolean) => void
}) {
   const { selectedProject, adminList, getProjectList } = useManageProjectStore(useShallow((state) => ({
      selectedProject: state.selectedProject,
      adminList: state.adminList,
      getProjectList: state.getProjectList
   })))

   const form = useForm<UpdateProjectType>({
      resolver: zodResolver(UpdateProjectSchema),
      defaultValues: {
         name: "",
         description: "",
         startDate: "",
         endDate: "",
         manageUserId: "",
      },
   });

   useEffect(() => {
      if (!selectedProject) return;

      form.reset({
         name: selectedProject.name,
         description: selectedProject.description || "",
         startDate: selectedProject.startDate.slice(0, 10),
         endDate: selectedProject.endDate.slice(0, 10),
         manageUserId: String(selectedProject.manageUserId),
      });
   }, [selectedProject]);

   const onSubmit = async (values: UpdateProjectType) => {
      try {
         if(!selectedProject) return;

         const payload = {
            name: values.name,
            description: values.description,
            startDate: values.startDate,
            endDate: values.endDate,
            manageUserId: Number(values.manageUserId),
         };

         const response = await manageProjectService.patchUpdateProject(selectedProject.id, payload);

         if (response?.success) {
            toast.success("Updated project successfully");
            getProjectList();
         } else {
            toast.error(response?.message || "Failed to update project");
         }
      } catch (error) {
         toast.error("An error occurred while updating project");
         console.error(error);
      }

      form.reset();
      onOpenChange(false);
   };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Manager */}
            <FormField
              control={form.control}
              name="manageUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Manager</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adminList && adminList.length > 0 && adminList.map((user) => (
                        <SelectItem
                          key={user.id}
                          value={String(user.id)}
                        >
                          {user.userName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
