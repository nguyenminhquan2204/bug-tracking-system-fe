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
import { useState } from "react";
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
import { createProjectSchema, CreateProjectType } from "../schema";
import { manageProjectService } from "../services/manage-project.service";
import { useManageProjectStore } from "../stores/useManageProjectStore";
import { useShallow } from "zustand/shallow";
import { IUser } from "@/packages/interfaces";
import { useTranslations } from "next-intl";

export default function AddProjectDialog({ data }: { data: IUser[]}) {
   const tButton = useTranslations('Button');
   const t = useTranslations('Admin.ManageProject.dialogs.addProject');
   const tValidation = useTranslations('Admin.ManageProject.validation');
   const tNoti = useTranslations('Admin.ManageProject.notifications');
   const [open, setOpen] = useState(false);
   const { getProjectList } = useManageProjectStore(useShallow((state) => ({
      getProjectList: state.getProjectList
   })))

   const form = useForm<CreateProjectType>({
      resolver: zodResolver(createProjectSchema(tValidation)),
      defaultValues: {
         name: "",
         description: "",
         startDate: "",
         endDate: "",
         manageUserId: "",
      },
   });

   const onSubmit = async (values: CreateProjectType) => {
      try {
         const payload = {
            name: values.name,
            description: values.description,
            startDate: values.startDate,
            endDate: values.endDate,
            manageUserId: Number(values.manageUserId),
         };

         const response = await manageProjectService.postCreateProject(payload);

         if (response?.success) {
            toast.success(tNoti('createSuccess'));
            getProjectList();
         } else {
            toast.error(response?.message || tNoti('createError'));
         }
      } catch (error) {
         toast.error(tNoti('createException'));
         console.error(error);
      }
      setOpen(false);
      form.reset();
   };

   return (
      <div className="ml-auto">
         <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button className="cursor-pointer">{tButton('addProject')}</Button>
         </DialogTrigger>

         <DialogContent>
            <DialogHeader>
               <DialogTitle>{t('title')}</DialogTitle>
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
                     <FormLabel>{t('name')}</FormLabel>
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
                     <FormLabel>{t('description')}</FormLabel>
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
                     <FormLabel>{t('startDate')}</FormLabel>
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
                     <FormLabel>{t('endDate')}</FormLabel>
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
                     <FormLabel>{t('manager')}</FormLabel>
                     <Select onValueChange={field.onChange}>
                        <FormControl>
                           <SelectTrigger>
                           <SelectValue placeholder={t('managerPlaceholder')} />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {data  && data.length > 0 && data.map((user) => (
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
                     onClick={() => setOpen(false)}
                  >
                     {tButton('cancel')}
                  </Button>
                  <Button type="submit">{tButton('save')}</Button>
               </DialogFooter>
               </form>
            </Form>
         </DialogContent>
         </Dialog>
      </div>
   );
}
