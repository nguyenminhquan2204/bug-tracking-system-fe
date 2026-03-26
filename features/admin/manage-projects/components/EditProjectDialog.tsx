'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { updateProjectSchema, UpdateProjectType } from "../schema";
import { useManageProjectStore } from "../stores/useManageProjectStore";
import { useShallow } from "zustand/shallow";
import { useTranslations } from "next-intl";
import { normalizeProjectStatusKey, PROJECT_STATUS_OPTIONS } from "../constants";

export default function EditProjectDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const tButton = useTranslations('Button');
  const t = useTranslations('Admin.ManageProject.dialogs.editProject');
  const tValidation = useTranslations('Admin.ManageProject.validation');
  const tNoti = useTranslations('Admin.ManageProject.notifications');
  const tStatus = useTranslations('Admin.ManageProject.table.columns.status');
  const { selectedProject, adminList, getProjectList } = useManageProjectStore(useShallow((state) => ({
    selectedProject: state.selectedProject,
    adminList: state.adminList,
    getProjectList: state.getProjectList
  })))

  const form = useForm<UpdateProjectType>({
    resolver: zodResolver(updateProjectSchema(tValidation)),
    defaultValues: {
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        manageUserId: "",
        status: "",
    },
  });

  useEffect(() => {
    if (!selectedProject) return;
    form.reset({
        name: selectedProject.name,
        description: selectedProject.description || "",
        startDate: selectedProject.startDate.slice(0, 10),
        endDate: selectedProject.endDate?.slice(0, 10) || "",
        manageUserId: String(selectedProject.manageUserId),
        status: selectedProject.status,
    });
  }, [form, selectedProject]);

  const onSubmit = async (values: UpdateProjectType) => {
    try {
        if(!selectedProject) return;

        const payload = {
          name: values.name,
          description: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          manageUserId: Number(values.manageUserId),
          status: values.status,
        };

        const response = await manageProjectService.patchUpdateProject(selectedProject.id, payload);

        if (response?.success) {
          toast.success(tNoti('updateSuccess'));
          getProjectList();
        } else {
          toast.error(response?.message || tNoti('updateError'));
        }
    } catch (error) {
        toast.error(tNoti('updateException'));
        console.error(error);
    }

    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('startDate')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('endDate')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row gap-3">
              <FormField
                control={form.control}
                name="manageUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('manager')}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('managerPlaceholder')} />
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
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('status')}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('statusPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROJECT_STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {tStatus(`options.${normalizeProjectStatusKey(status)}`)}
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
                {tButton('cancel')}
              </Button>
              <Button type="submit">{tButton('save')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
