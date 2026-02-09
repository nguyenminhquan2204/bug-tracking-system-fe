import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  manageUserId: z.string().min(1, "Manager is required"),
});

export const UpdateProjectSchema = CreateProjectSchema;

export const SearchProjectSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  manageUserId: z.string().optional(),
});

export type SearchProjectType = z.infer<typeof SearchProjectSchema>;
export type CreateProjectType = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectType = z.infer<typeof UpdateProjectSchema>;
