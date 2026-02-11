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
