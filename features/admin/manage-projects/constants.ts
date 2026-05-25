export const PROJECT_API_BASE_PATH = "project";

export const EXPENSE_API_BASE_PATH = "expense";

export const PROJECT_STATUS_OPTIONS = [
  "INIT",
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "ARCHIVED",
] as const;

export const normalizeProjectStatusKey = (status?: string) =>
  status.toLowerCase();

export const EXPENSE_CATEGORY_OPTIONS = [
  "DEVELOPMENT",
  "TESTING",
  "INFRASTRUCTURE",
  "MARKETING",
  "OTHER",
] as const;

export const normalizeExpenseCategoryKey = (category: string) =>
  category.toLowerCase();
