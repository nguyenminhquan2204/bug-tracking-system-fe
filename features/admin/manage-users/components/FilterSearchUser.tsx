/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { SearchUserSchema, SearchUserType } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { IRole } from "../inferface";
import { useManageUserStore } from "../stores/useManageUserStore";
import { useShallow } from "zustand/shallow";
import { DEFAULT_GET_LIST_QUERY } from "@/packages/utils";

export default function FilterSearchUser({ data }: { data: IRole[] }) {
   const { setUserGetListQuery } = useManageUserStore(useShallow((state) => ({
      setUserGetListQuery: state.setUserGetListQuery
   })))

   const form = useForm<SearchUserType>({
      resolver: zodResolver(SearchUserSchema),
      defaultValues: {
         userName: "",
         role: "",
      },
   });
   
   const onSubmit = (values: SearchUserType) => {
      const query: any = {
         ...DEFAULT_GET_LIST_QUERY,
         userName: values.userName?.trim() ?? ''
      } 
      if(values.role && values.role !== 'all') {
         query.roleId = Number(values.role);
      } else if(values.role === 'all') {
         query.roleId = null;
      }

      setUserGetListQuery(query);
   };

   return (
      <Form {...form}>
         <form
         onSubmit={form.handleSubmit(onSubmit)}
         className="flex flex-wrap items-end gap-4"
         >
         <div className="flex flex-col gap-1">
            <div className="flex gap-2">
               <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                     <FormItem>
                        <FormControl>
                        <Input
                           {...field}
                           placeholder="Username"
                           className="w-56"
                        />
                        </FormControl>
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                     <FormItem>
                        <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        >
                        <FormControl>
                           <SelectTrigger className="w-40">
                              <SelectValue placeholder="Role" />
                           </SelectTrigger>
                        </FormControl>
                           <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              {data && data.length > 0 && data.map((item, index) => {
                                 return (
                                 <SelectItem key={item.id} value={"" + item.id}>{item.name}</SelectItem>
                              )
                           })}
                        </SelectContent>
                     </Select>
                  </FormItem>
               )}
               />

               <Button className="cursor-pointer" type="submit">Search</Button>
            </div>
         </div>
         </form>
      </Form>
   )
}