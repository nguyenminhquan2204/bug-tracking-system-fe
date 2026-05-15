import { z } from "zod";

type TranslateFn = (key: string) => string;

export const createProjectSchema = (t: TranslateFn) =>
  z.object({
    name: z.string().min(1, t("nameRequired")),
    description: z.string().optional(),
    startDate: z.string().min(1, t("startDateRequired")),
    endDate: z.string().min(1, t("endDateRequired")),
    manageUserId: z.string().min(1, t("managerRequired")),
  });

export const updateProjectSchema = (t: TranslateFn) =>
  createProjectSchema(t).extend({
    status: z.string().min(1, t("statusRequired")),
  });

export const searchProjectSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  manageUserId: z.string().optional(),
});

export const createExpenseSchema = (t: TranslateFn) =>
  z.object({
    name: z.string().min(1, t("nameRequired")),
    amount: z.number().min(0, t("amountRequired")),
    description: z.string().optional(),
    date: z.string().min(1, t("dateRequired")),
    category: z.string().min(1, t("categoryRequired")),
    projectId: z.string().min(1, t("projectRequired")),
  });

export const updateExpenseSchema = (t: TranslateFn) =>
  createExpenseSchema(t);

export type SearchProjectType = z.infer<typeof searchProjectSchema>;
export type CreateProjectType = z.infer<ReturnType<typeof createProjectSchema>>;
export type UpdateProjectType = z.infer<ReturnType<typeof updateProjectSchema>>;
export type CreateExpenseType = z.infer<ReturnType<typeof createExpenseSchema>>;
export type UpdateExpenseType = z.infer<ReturnType<typeof updateExpenseSchema>>;
