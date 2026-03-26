'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { searchProjectSchema, SearchProjectType } from "../schema";
import { useManageProjectStore } from "../stores/useManageProjectStore";
import { useShallow } from "zustand/shallow";
import { DEFAULT_GET_LIST_QUERY } from "@/packages/utils";
import { useTranslations } from "next-intl"
import { IUser } from "@/packages/interfaces";
import { normalizeProjectStatusKey, PROJECT_STATUS_OPTIONS } from "../constants";

interface IProps {
  data: IUser[];
}

export default function FilterSearchProjects({ data }: IProps) {
   const tButton = useTranslations('Button');
   const t = useTranslations('Admin.ManageProject.filters');
   const tStatus = useTranslations('Admin.ManageProject.table.columns.status');
   const { setProjectGetListQuery } = useManageProjectStore(
      useShallow((state) => ({
         setProjectGetListQuery: state.setProjectGetListQuery,
      }))
   );

   const form = useForm<SearchProjectType>({
      resolver: zodResolver(searchProjectSchema),
      defaultValues: {
         name: "",
         status: "",
         startDate: "",
         endDate: "",
         manageUserId: "",
      },
   });

   const onSubmit = (values: SearchProjectType) => {
      const query = {
         ...DEFAULT_GET_LIST_QUERY,
         name: values.name?.trim() || "",
         status: values.status === "all" ? "" : values.status || "",
         startDate: values.startDate || "",
         endDate: values.endDate || "",
         manageUserId:
            values.manageUserId === "all" || !values.manageUserId
            ? null
            : Number(values.manageUserId),
      };

      setProjectGetListQuery(query);
   };

   return (
      <Form {...form}>
         <form
         onSubmit={form.handleSubmit(onSubmit)}
         className="flex flex-wrap items-end gap-4"
         >
         {/* Name */}
         <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
               <FormItem>
               <FormControl>
                  <Input
                     {...field}
                     placeholder={t('namePlaceholder')}
                     className="w-56"
                  />
               </FormControl>
               </FormItem>
            )}
         />

         {/* Status */}
         <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
               <FormItem>
               <Select
                  value={field.value}
                  onValueChange={field.onChange}
               >
                  <FormControl>
                     <SelectTrigger className="w-40">
                     <SelectValue placeholder={t('statusPlaceholder')} />
                     </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     <SelectItem value="all">{t('all')}</SelectItem>
                     {PROJECT_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                           {tStatus(`options.${normalizeProjectStatusKey(status)}`)}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
               </FormItem>
            )}
         />

         {/* Start Date */}
         <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
               <FormItem>
               <FormControl>
                  <Input type="date" {...field} />
               </FormControl>
               </FormItem>
            )}
         />

         {/* End Date */}
         <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
               <FormItem>
               <FormControl>
                  <Input type="date" {...field} />
               </FormControl>
               </FormItem>
            )}
         />

         {/* Manager */}
         <FormField
            control={form.control}
            name="manageUserId"
            render={({ field }) => (
               <FormItem>
               <Select
                  value={field.value}
                  onValueChange={field.onChange}
               >
                  <FormControl>
                     <SelectTrigger className="w-44">
                     <SelectValue placeholder={t('managerPlaceholder')} />
                     </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     <SelectItem value="all">{t('all')}</SelectItem>
                     {data && data.length > 0 && data.map((user) => (
                     <SelectItem
                        key={user.id}
                        value={String(user.id)}
                     >
                        {user.userName}
                     </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
               </FormItem>
            )}
         />

         <Button type="submit" className="cursor-pointer">
            {tButton('search')}
         </Button>
         </form>
      </Form>
   );
}
