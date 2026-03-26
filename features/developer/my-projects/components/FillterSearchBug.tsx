/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useMyProjectStore } from '../stores/useMyProjectStore'
import { useShallow } from 'zustand/shallow'
import { useTranslations } from 'next-intl'

export default function SearchAndCreateBug() {
   const t = useTranslations('Developer.MyProjects')
   const tButton = useTranslations('Button')
   const { setBugGetListQuery } = useMyProjectStore(useShallow((state) => ({
      setBugGetListQuery: state.setBugGetListQuery
   })))
   
   const form = useForm();

   const onSubmit = (data: any) => {
      setBugGetListQuery({ search: data.userName });
   }

   return (
      <>
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="flex flex-wrap items-end justify-between gap-4"
            >
               <div className="flex items-end gap-2">
                  <FormField
                     control={form.control}
                     name="userName"
                     render={({ field }) => (
                     <FormItem>
                        <FormControl>
                           <Input
                           {...field}
                           placeholder={t('filters.bugNamePlaceholder')}
                           className="w-56"
                           />
                        </FormControl>
                     </FormItem>
                     )}
                  />

                  <Button type="submit">{tButton('search')}</Button>
               </div>
            </form>
         </Form>
      </>
   )
}
