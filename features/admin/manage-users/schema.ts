import { z } from "zod";

export const SearchUserSchema = z.object({
   userName: z.string().optional(),
   role: z.string().optional(),
})

export const CreateUserSchema = z.object({
   userName: z.string().min(1, "Username is required"),
   email: z.string().email("Invalid email"),
   role: z.string(),
   password: z.string().min(6, "Password must be at least 6 characters"),
   confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
   message: "Passwords do not match",
   path: ["confirmPassword"],
})

export const UpdateUserSchema = z.object({
   userName: z.string().min(1, 'User Name is required'),
   email: z.string().email('Invalid email'),
   role: z.string().nonempty(),
   isActive: z.boolean(),
})

export type SearchUserType = z.infer<typeof SearchUserSchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
