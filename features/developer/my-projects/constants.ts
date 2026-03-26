export const PROJECT_PUBLIC_API_BASE_PATH = 'project-public'

export enum BugPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum BugStatus {
  TODO = 'TODO',
  DOING = 'DOING',
  PR_IN_REVIEW = 'PR_IN_REVIEW',
  MERGED = 'MERGED',
  READY_FOR_QC = 'READY_FOR_QC',
  QC_IN_PROGRESS = 'QC_IN_PROGRESS',
  DONE_IN_DEV = 'DONE_IN_DEV',
  ON_STG = 'ON_STG',
}

export const BUG_STATUS_OPTIONS = [
  'todo',
  'doing',
  'pr_in_review',
  'merged',
  'ready_for_qc',
  'qc_in_progress',
  'done_in_dev',
  'on_stg',
] as const

export const normalizeBugStatusKey = (status: string) => status.toLowerCase()
export const normalizeBugPriorityKey = (priority: string) => priority.toLowerCase()
