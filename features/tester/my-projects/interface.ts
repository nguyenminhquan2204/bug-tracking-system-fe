/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser } from "@/packages/interfaces"
import { BugPriority, BugStatus } from "./constants"

export interface IBug {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: number | null
  updatedBy: number | null
  deletedBy: number | null
  title: string
  description: string
  projectId: number
  reporterId: number
  status: BugStatus
  priority: BugPriority
  developer: IUser
  reporter: IUser
  comments: any
}

export interface IBugs {
  todo: IBug[]
  doing: IBug[]
  pr_in_review: IBug[]
  merged: IBug[]
  ready_for_qc: IBug[]
  qc_in_progress: IBug[]
  done_in_dev: IBug[]
  on_stg: IBug[]
}

export interface IBugHistory {
  id: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: number | null
  updatedBy: number | null
  updatedByUser: IUser
  deletedBy: number | null
  bugId: number | null
  fieldChanged: string
  oldValue: string
  newValue: string 
}