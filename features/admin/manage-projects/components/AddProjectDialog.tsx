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
import { useEffect, useState } from "react";
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
import { CreateProjectSchema, CreateProjectType } from "../schema";
import { manageProjectService } from "../services/manage-project.service";
import { useManageProjectStore } from "../stores/useManageProjectStore";
import { useShallow } from "zustand/shallow";
import { IUser } from "@/packages/interfaces";

export default function AddProjectDialog({ data }: { data: IUser[]}) {
   const [open, setOpen] = useState(false);
   const { getProjectList } = useManageProjectStore(useShallow((state) => ({
      getProjectList: state.getProjectList
   })))

   const form = useForm<CreateProjectType>({
      resolver: zodResolver(CreateProjectSchema),
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
            toast.success("Created project successfully");
            getProjectList();
         } else {
            toast.error(response?.message || "Failed to create project");
         }
      } catch (error) {
         toast.error("An error occurred while creating project");
         console.error(error);
      }
      setOpen(false);
      form.reset();
   };

   return (
      <div className="ml-auto">
         <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button className="cursor-pointer">+ Add Project</Button>
         </DialogTrigger>

         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add New Project</DialogTitle>
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
                     <Select onValueChange={field.onChange}>
                        <FormControl>
                           <SelectTrigger>
                           <SelectValue placeholder="Select manager" />
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
                     Cancel
                  </Button>
                  <Button type="submit">Save</Button>
               </DialogFooter>
               </form>
            </Form>
         </DialogContent>
         </Dialog>
      </div>
   );
}
