/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/packages/features/stores/useAuthStore'
import { useShallow } from 'zustand/shallow'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Email invalid'),
  password: z.string().min(4, 'Password must be at least 4 characters long'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
   const router = useRouter()
   const [loading, setLoading] = useState(false)
   const { login } = useAuthStore(useShallow((state) => ({
      login: state.login
   })))

   const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: '',
         password: '',
      },
   })

   const onSubmit = async (values: LoginFormValues) => {
      setLoading(true)
      try {
         const response: any = await login(values)
         if(response?.success) {
            toast.success('Login successfully!');
            const role = response?.data?.role;
            switch(role) {
               case 'Admin':
                  router.replace('admin/manage-projects');
                  break;
               case 'Tester':
                  router.replace('tester/my-projects');
                  break;
               default:
                  router.replace('/')
            }
         } else {
            toast.error(response?.message || 'Failed to login')
         }
      } catch (error) {
         toast.error('An error occurred while login system');
         console.log(error);
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
         <Card className="w-full max-w-md">
         <CardHeader>
            <CardTitle className="text-center text-2xl">Bug Tracker 🐞</CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input placeholder="admin@gmail.com" {...field} />
                     </FormControl>
                     <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                     <FormItem>
                     <FormLabel>Password</FormLabel>
                     <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                     </FormControl>
                     <FormMessage />
                     </FormItem>
                  )}
               />

               <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
               </Button>
               </form>
            </Form>
         </CardContent>
         </Card>
      </div>
   )
}