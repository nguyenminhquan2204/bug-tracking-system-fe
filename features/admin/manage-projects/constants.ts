export const PROJECT_API_BASE_PATH = 'project'

export const PROJECT_STATUS_OPTIONS = [
  'INIT',
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'ARCHIVED',
] as const

export const normalizeProjectStatusKey = (status: string) =>
  status.toLowerCase()
