import { z } from "zod";

export const SearchUserSchema = z.object({
   keyword: z.string().optional(),
   role: z.string().optional(),
})

export type SearchUserType = z.infer<typeof SearchUserSchema>;
