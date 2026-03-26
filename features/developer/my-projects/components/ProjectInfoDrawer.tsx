'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useMyProjectStore } from '../stores/useMyProjectStore'
import { useShallow } from 'zustand/shallow'
import { useTranslations } from 'next-intl'
import { normalizeProjectStatusKey } from '@/features/admin/manage-projects/constants'

export function ProjectInfoDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
   const t = useTranslations('Developer.MyProjects.projectInfo')
   const tProjectStatus = useTranslations('Admin.ManageProject.table.columns.status')
   const { selectedProject } = useMyProjectStore(
      useShallow((state) => ({
         selectedProject: state.selectedProject,
      }))
   )

   if (!selectedProject) return null

   const {
      name,
      description,
      status,
      startDate,
      endDate,
      managerUserInfo,
   } = selectedProject

  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString() : '--'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[700px] p-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            {name}
            <Badge variant="outline" className="border-gray-400 text-gray-500">
              {tProjectStatus(`options.${normalizeProjectStatusKey(status)}`)}
            </Badge>
          </SheetTitle>
          <SheetDescription>{t('title')}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 text-sm">
          <div>
            <p className="mb-1 font-medium">{t('description')}</p>
            <p className="text-muted-foreground">
              {description || t('noDescription')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1 font-medium">{t('startDate')}</p>
              <p className="text-muted-foreground">
                {formatDate(startDate)}
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium">{t('endDate')}</p>
              <p className="text-muted-foreground">
                {formatDate(endDate)}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">{t('manager')}</p>

            {managerUserInfo ? (
              <div className="flex items-center gap-3 rounded-md border p-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {managerUserInfo.userName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">{managerUserInfo.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {managerUserInfo.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">{t('noManager')}</p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
