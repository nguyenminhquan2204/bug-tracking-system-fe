'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { useManageProjectStore } from "../stores/useManageProjectStore"
import { useShallow } from "zustand/shallow"
import DeleteProjectDialog from "./DeleteProjectDialog"
import EditProjectDialog from "./EditProjectDialog"
import InviteMemberDialog from "./InviteMemberDialog"
import { useRouter } from "next/navigation"
import { IProject } from "@/packages/interfaces"
import { useLocale, useTranslations } from "next-intl"
import { normalizeProjectStatusKey } from "../constants"

export default function ProjectTable({ data }: { data: IProject[] }) {
  const t = useTranslations('Admin.ManageProject.table.columns')
  const locale = useLocale()
  const router = useRouter()
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

  const formatDate = (value?: string) =>
    value ? new Intl.DateTimeFormat(locale).format(new Date(value)) : '—'

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
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('description')}</TableHead>
              <TableHead>{t('members')}</TableHead>
              <TableHead>{t('manager')}</TableHead>
              <TableHead>{t('startDate')}</TableHead>
              <TableHead>{t('endDate')}</TableHead>
              <TableHead>{t('bug')}</TableHead>
              <TableHead>{t('status.title')}</TableHead>
              <TableHead>{t('actions.title')}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.length > 0 ? (
              data.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin/manage-projects/${item.id}`)}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {item.description}
                  </TableCell>
                  <TableCell>{item.memberCount}</TableCell>
                  <TableCell>{item.managerUserInfo.userName ?? '—'}</TableCell>
                  <TableCell>{formatDate(item.startDate)}</TableCell>
                  <TableCell>{formatDate(item.endDate)}</TableCell>
                  <TableCell>{item.bugCount ?? 0}</TableCell>
                  <TableCell>
                    {t(`status.options.${normalizeProjectStatusKey(item.status)}`)}
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
                          {t('actions.options.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProject(item)
                            setIsOpenDeleteProjectDialog(true)
                          }}
                        >
                          {t('actions.options.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground">
                  {t('empty')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
