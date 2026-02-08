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
import { CreateUserSchema, CreateUserType } from "../schema";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useManageUserStore } from "../stores/useManageUserStore";
import { useShallow } from "zustand/shallow";
import { manageUserService } from "../services/manage-user.service";
import { IRole } from "../inferface";
import { toast } from "sonner";

export default function AddUserDialog({ data }: { data: IRole[] }) {
   const [open, setOpen] = useState(false)
   const { getUserList } = useManageUserStore(useShallow((state) => ({
      getUserList: state.getUserList
   })))

   const form = useForm<CreateUserType>({
      resolver: zodResolver(CreateUserSchema),
         defaultValues: {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
         },
   })

   const onSubmit = async (values: CreateUserType) => {
      try {
         const payload = {
            userName: values.userName,
            email: values.email,
            roleId: Number(values.role),
            password: values.password
         }
         const response = await manageUserService.postCreateUser(payload);
         if(response?.success) {
            toast.success('Created user successfully')
            getUserList()
         } else {
            toast.error(response?.message || 'Failed to create user');
         }
      } catch(error) {
         toast.error('An error occurred while creating user');
         console.log(error);
      }
      form.reset()
      setOpen(false)
   }

   return(
      <div className="ml-auto">
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
               <Button className="cursor-pointer">+ Add User</Button>
            </DialogTrigger>

            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
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
                                 <Input type="email" {...field} />
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
                                 onValueChange={field.onChange}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {data && data.length > 0 && data.map((item, index) => {
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
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <Input type="password" {...field} />
                           </FormControl>
                           <FormMessage />
                           </FormItem>
                        )}
                     >
                     </FormField>
                     <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                           <FormItem>
                           <FormLabel>Confirm Password</FormLabel>
                           <FormControl>
                              <Input type="password" {...field} />
                           </FormControl>
                           <FormMessage />
                           </FormItem>
                        )}
                     >
                     </FormField>

                     <DialogFooter>
                        <Button
                           type="button"
                           variant="outline"
                           className="cursor-pointer"
                           onClick={() => setOpen(false)}
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