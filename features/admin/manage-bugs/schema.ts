import z from "zod";

export const filterSchema = z
   .object({
      projectId: z.string().min(1, "Please select project"),
      fromDate: z.string().min(1, "Please select start date"),
      toDate: z.string().min(1, "Please select end date"),
   })
   .refine(
      (data) => new Date(data.fromDate) <= new Date(data.toDate),
      {
         message: "End date must be greater than or equal start date",
         path: ["toDate"],
      }
   );

export type FilterFormType = z.infer<typeof filterSchema>;