'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { IProject } from "../interface"
import { useManageProjectStore } from "../stores/useManageProjectStore"
import { useShallow } from "zustand/shallow"
import DeleteProjectDialog from "./DeleteProjectDialog"
import EditProjectDialog from "./EditProjectDialog"
import InviteMemberDialog from "./InviteMemberDialog"
import { useRouter } from "next/navigation"

export default function ProjectTable({ data }: { data: IProject[] }) {
  const router = useRouter();
  const {
    setSelectedProject,
    isOpenEditProjectDialog,
    setIsOpenEditProjectDialog,
    isOpenDeleteProjectDialog,
    setIsOpenDeleteProjectDialog,
    isOpenInviteMemberProjectDialog,
    setIsOpenInviteMemberProjectDialog
  } = useManageProjectStore(
    useShallow((state) => ({
      setSelectedProject: state.setSelectedProject,
      isOpenEditProjectDialog: state.isOpenEditProjectDialog,
      setIsOpenEditProjectDialog: state.setIsOpenEditProjectDialog,
      isOpenDeleteProjectDialog: state.isOpenDeleteProjectDialog,
      setIsOpenDeleteProjectDialog: state.setIsOpenDeleteProjectDialog,
      isOpenInviteMemberProjectDialog: state.isOpenInviteMemberProjectDialog,
      setIsOpenInviteMemberProjectDialog: state.setIsOpenInviteMemberProjectDialog
    }))
  )

  return (
    <>
      <EditProjectDialog
        open={isOpenEditProjectDialog}
        onOpenChange={setIsOpenEditProjectDialog}
      />
      <DeleteProjectDialog
        open={isOpenDeleteProjectDialog}
        onOpenChange={setIsOpenDeleteProjectDialog}
      />
      <InviteMemberDialog 
        open={isOpenInviteMemberProjectDialog}
        onOpenChange={setIsOpenInviteMemberProjectDialog}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Bug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.length > 0 &&
              data.map((item, index) => (
                <TableRow 
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/manage-projects/${item.id}`)}
                >
                  <TableCell>{index + 1}</TableCell>

                  <TableCell className="font-medium">
                    {item.name}
                  </TableCell>

                  <TableCell className="max-w-[300px] truncate">
                    {item.description}
                  </TableCell>

                  <TableCell>
                    {item.managerUserInfo.userName ?? '—'}
                  </TableCell>

                  <TableCell>
                    {new Date(item.startDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    {item.endDate
                      ? new Date(item.endDate).toLocaleDateString()
                      : '—'}
                  </TableCell>

                  <TableCell>
                    {item.bugCount ?? 0}
                  </TableCell>

                  <TableCell>
                    {item.status}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProject(item)
                            setIsOpenEditProjectDialog(true)
                          }}
                        >
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProject(item)
                            setIsOpenDeleteProjectDialog(true)
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
