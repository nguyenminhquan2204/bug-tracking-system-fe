/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProfileStore } from "@/packages/features/stores/useProfileStore";
import { useShallow } from "zustand/shallow";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { profileService } from "@/packages/features/services/profile.service";

const schema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export default function EditProfileAdminDialog({ open, onOpenChange }: Props) {
   const [loading, setLoading] = useState(false);
   const [preview, setPreview] = useState<string | null>(null);
   const [imageId, setImageId] = useState<number | null>(null);
   const { profile, getProfile } = useProfileStore(
      useShallow((state) => ({
         profile: state.profile,
         getProfile: state.getProfile,
      }))
   );
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<FormValues>({
      resolver: zodResolver(schema),
   });

   useEffect(() => {
      if (profile && open) {
         reset({
            userName: profile.userName,
            email: profile.email,
         });
      }
   }, [profile, open, reset]);

   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
         const file = e.target.files?.[0];
         if (!file) return;

         // Upload file
         const response = await profileService.changeAvatar(file);
         if(response?.success) {
            toast.success('Change avatar successfully');
            setPreview(response.data.path);
            setImageId(response.data.id);
         } else {
            toast.error(response?.message || 'Failed to change avatar');
         }
      } catch (error) {
         toast.error('An error occurred while creating user');
         console.log(error);
      }
   };

   const onSubmit = async (data: FormValues) => {
      try {
         setLoading(true);

         const response = await profileService.updateProfile({ ... data, imageId });

         if (response?.success) {
           toast.success("Profile updated successfully");
           await getProfile();
           onOpenChange(false);
         } else {
           toast.error(response?.message || "Update failed");
         }
      } catch (error) {
         toast.error("An error occurred");
         console.log(error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="text-center">Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-3 mt-2">
               <Avatar className="h-24 w-24">
                  <AvatarImage src={preview || profile?.avatar?.path || ''} />
                  <AvatarFallback className="text-lg">
                     {profile?.userName?.charAt(0)}
                  </AvatarFallback>
               </Avatar>
               <label className="text-sm text-primary cursor-pointer hover:underline">
                  Change avatar
                  <input
                     type="file"
                     accept="image/*"
                     className="hidden"
                     onChange={handleAvatarChange}
                  />
               </label>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
               <div>
                  <label className="text-sm font-medium">Username</label>
                  <Input {...register("userName")} />
                  {errors.userName && (
                  <p className="text-sm text-red-500 mt-1">
                     {errors.userName.message}
                  </p>
                  )}
               </div>
               <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input readOnly {...register("email")} />
                  {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                     {errors.email.message}
                  </p>
                  )}
               </div>
               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => onOpenChange(false)}
                  >
                     Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                     {loading ? "Saving..." : "Save Changes"}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}