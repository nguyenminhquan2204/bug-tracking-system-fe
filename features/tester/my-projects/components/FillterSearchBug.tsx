/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useMyProjectStore } from '../stores/useMyProjectStore'
import { useShallow } from 'zustand/shallow'
import { CreateBugDrawer } from './CreateBugDrawer'

export default function SearchAndCreateBug() {
   const { setIsOpenDrawerCreateBug, isOpenDrawerCreateBug } = useMyProjectStore(useShallow((state) => ({
      setIsOpenDrawerCreateBug: state.setIsOpenDrawerCreateBug,
      isOpenDrawerCreateBug: state.isOpenDrawerCreateBug
   })))
   
   const form = useForm();

   const onSubmit = () => {
      
   }

   return (
      <>
         <CreateBugDrawer 
            open={isOpenDrawerCreateBug}
            onOpenChange={setIsOpenDrawerCreateBug}
         />
         <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-wrap items-end justify-between gap-4"
            >
            {/* LEFT: SEARCH */}
            <div className="flex items-end gap-2">
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

               <Button type="submit">Search</Button>
            </div>
            <Button onClick={() => setIsOpenDrawerCreateBug(true)}>+ Create new</Button>
            </form>
         </Form>
      </>
   )
}
