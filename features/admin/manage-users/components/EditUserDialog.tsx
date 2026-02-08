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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useManageUserStore } from "../stores/useManageUserStore";
import { useShallow } from "zustand/shallow";
import { manageUserService } from "../services/manage-user.service";
import { toast } from "sonner";
import { UpdateUserSchema, UpdateUserType } from "../schema";
import { useEffect } from "react";
import { Switch } from "@/components/ui/switch";

export default function EditUserDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
   const { getUserList, roleList, selectedUser } = useManageUserStore(useShallow((state) => ({
      getUserList: state.getUserList,
      roleList: state.roleList,
      selectedUser: state.selectedUser
   })))

   const form = useForm<UpdateUserType>({ resolver: zodResolver(UpdateUserSchema) });

   const onSubmit = async (values: UpdateUserType) => {
      try {
         if(!selectedUser) return;

         const payload = {
            userName: values.userName,
            email: values.email,
            roleId: Number(values.role),
            isActive: values.isActive
         }
         const response = await manageUserService.patchUpdateUser(selectedUser.id, payload);
         if(response?.success) {
            toast.success('Updated user successfully');
            getUserList();
            onOpenChange(false);
         } else {
            toast.error(response?.message || 'Failed to update user');
         }
      } catch(error) {
         toast.error('An error occurred while updating user');
         console.log(error);
      }
      form.reset()
   }

   useEffect(() => {
      if (selectedUser) {
         form.reset({
            userName: selectedUser.userName ?? "",
            email: selectedUser.email ?? "",
            role: String(selectedUser.roleId ?? ""),
            isActive: selectedUser?.isActive ?? true,
         });
      }
   }, [selectedUser]);

   return(
      <div className="ml-auto">
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild></DialogTrigger>

            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
               </DialogHeader>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-4"
                  >  
                     <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>User Name</FormLabel>
                              <FormControl>
                                 <Input {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     >
                     </FormField>
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                 <Input readOnly type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     >
                     </FormField>
                     <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select
                                 value={field.value}
                                 onValueChange={field.onChange}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {roleList && roleList.length > 0 && roleList.map((item, index) => {
                                       return (
                                          <SelectItem key={item.id} value={"" + item.id}>{item.name}</SelectItem>
                                       )
                                    })}
                                 </SelectContent>
                                 </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     >
                     </FormField>

                     <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                           <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                              <FormLabel>Active</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                 User can login and use the system
                              </div>
                              </div>
                              <FormControl>
                              <Switch
                                 checked={field.value}
                                 onCheckedChange={field.onChange}
                              />
                              </FormControl>
                           </FormItem>
                        )}
                     >
                     </FormField>

                     <DialogFooter>
                        <Button
                           type="button"
                           variant="outline"
                           className="cursor-pointer"
                           onClick={() => onOpenChange(false)}
                        >
                           Cancel
                        </Button>
                        <Button className="cursor-pointer" type="submit">Save</Button>
                     </DialogFooter>
                  </form>
               </Form>
            </DialogContent>
         </Dialog>
      </div>
   )
}