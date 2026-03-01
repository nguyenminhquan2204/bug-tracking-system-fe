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

export function ProjectInfoDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
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
      managerUserInfo, // manageInfo
   } = selectedProject

  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString() : '--'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[700px] p-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            {name}
            <Badge
              variant="outline"
              className={
                status === 'Active'
                  ? 'border-green-500 bg-green-500/10 text-green-600'
                  : status === 'Pending'
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600'
                  : 'border-gray-400 text-gray-500'
              }
            >
              {status}
            </Badge>
          </SheetTitle>
          <SheetDescription>Information project</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 text-sm">
          {/* DESCRIPTION */}
          <div>
            <p className="mb-1 font-medium">Description</p>
            <p className="text-muted-foreground">
              {description || 'No description'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1 font-medium">Start date</p>
              <p className="text-muted-foreground">
                {formatDate(startDate)}
              </p>
            </div>
            <div>
              <p className="mb-1 font-medium">End date</p>
              <p className="text-muted-foreground">
                {formatDate(endDate)}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">Manager</p>

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
              <p className="text-muted-foreground">No manager</p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
