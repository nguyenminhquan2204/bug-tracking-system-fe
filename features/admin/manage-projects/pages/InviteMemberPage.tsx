'use client'

import { useEffect, useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useParams } from 'next/navigation'
import TitleDescription from '@/features/components/TitleDescription'
import { useManageProjectStore } from '../stores/useManageProjectStore'
import { useShallow } from 'zustand/shallow'
import { IMember } from '../../manage-users/inferface'
import { toast } from 'sonner'
import { manageProjectService } from '../services/manage-project.service'
import { X } from 'lucide-react'
import { IUser } from '@/packages/interfaces'
import { useTranslations } from 'next-intl'

function MemberList({
  members,
  onRemove,
}: {
  members: IMember[]
  onRemove?: (memberId: number) => void
}) {
  if (!members || members.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {members.map((item) => (
        <div
          key={item.id}
          className="group relative flex items-center gap-3 rounded-md border p-2"
        >
          {onRemove && (
            <Button
              size="icon"
              variant="ghost"
              className="
                absolute right-1 top-1 h-6 w-6
                opacity-0 group-hover:opacity-100
                transition
              "
              onClick={() => onRemove(item?.user.id)}
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          )}

          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {item?.user?.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="truncate">
            <p className="text-sm font-medium truncate">
              {item?.user?.userName}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function InviteSection({
  allUsers,
  selected,
  setSelected,
  selectPlaceholder,
}: {
  allUsers: IUser[]
  selected: IUser[]
  setSelected: React.Dispatch<React.SetStateAction<IUser[]>>
  selectPlaceholder: string
}) {
  const availableUsers = allUsers.filter(
    (u) => !selected.some((s) => s.id === u.id),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selected.map((user) => (
          <Badge
            key={user.id}
            variant="secondary"
            className="cursor-pointer"
            onClick={() =>
              setSelected((prev) =>
                prev.filter((u) => u.id !== user.id),
              )
            }
          >
            {user.userName} x
          </Badge>
        ))}
      </div>

      <Select
        onValueChange={(value) => {
          const user = allUsers.find(
            (u) => u.id === Number(value),
          )
          if (user) {
            setSelected((prev) => [...prev, user])
          }
        }}
      >
        <SelectTrigger className="cursor-pointer">
          <SelectValue placeholder={selectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {availableUsers.map((user) => (
            <SelectItem
              key={user.id}
              value={String(user.id)}
              className="cursor-pointer"
            >
              {user.userName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function InviteMemberPage() {
  const tButton = useTranslations('Button')
  const t = useTranslations('Admin.ManageProject.inviteMemberPage')
  const tNoti = useTranslations('Admin.ManageProject.notifications')
  const params = useParams()
  const [selectedTesters, setSelectedTesters] = useState<IUser[]>([])
  const [selectedDevelopers, setSelectedDevelopers] = useState<IUser[]>([])

  const {
    getTesterList,
    getDeveloperList,
    testerList,
    developerList,
    getProjectMembers,
    testersCurrent,
    developersCurrent
  } = useManageProjectStore(
    useShallow((state) => ({
      getTesterList: state.getTesterList,
      getDeveloperList: state.getDeveloperList,
      testerList: state.testerList,
      developerList: state.developerList,
      getProjectMembers: state.getProjectMembers,
      testersCurrent: state.testersCurrent,
      developersCurrent: state.developersCurrent
    })),
  )

  useEffect(() => {
    if (!params.id) return
    const fetchApi = async () => {
      await Promise.all([
        getTesterList(),
        getDeveloperList(),
        getProjectMembers(Number(params.id))
      ])
    }
    fetchApi()
  }, [getDeveloperList, getProjectMembers, getTesterList, params.id])

  const handleInvite = async () => {
    if (!params.id) return
    try {
      const [response] = await Promise.all([
        manageProjectService.addMembers(+params.id, selectedTesters),
        manageProjectService.addMembers(+params.id, selectedDevelopers),
      ])
      if (response?.success) {
        toast.success(tNoti('inviteMembersSuccess'))
        setSelectedTesters([])
        setSelectedDevelopers([])
        getProjectMembers(Number(params.id))
      } else {
        toast.error(response?.message || tNoti('inviteMembersError'))
      }
    } catch (error) {
      toast.error(tNoti('inviteMembersException'))
      console.error(error)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    if (!params.id) return
    try {
      const response = await manageProjectService.removeMember(+params.id, memberId)
      if (response?.success) {
        toast.success(tNoti('removeMemberSuccess'))
        getProjectMembers(Number(params.id))
      } else {
        toast.error(response?.message || tNoti('removeMemberError'))
      }
    } catch (error) {
      toast.error(tNoti('removeMemberException'))
      console.error(error)
    }
  }

  return (
    <>
      <TitleDescription
        title={t('title')}
        description={t('description')}
      />

      <div className="mt-5">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('cardTitle')}</CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="tester">
              <TabsList className="w-full mb-4">
                <TabsTrigger className='cursor-pointer' value="tester">{t('testerTab')}</TabsTrigger>
                <TabsTrigger className='cursor-pointer' value="developer">{t('developerTab')}</TabsTrigger>
              </TabsList>
              <TabsContent value="tester" className="space-y-6">
                <div>
                  <h3 className="mb-2 font-semibold">
                    {t('testerCurrent')}
                  </h3>
                  <MemberList members={testersCurrent} onRemove={handleRemoveMember} />
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">
                    {t('inviteTester')}
                  </h3>
                  <InviteSection
                    allUsers={testerList}
                    selected={selectedTesters}
                    setSelected={setSelectedTesters}
                    selectPlaceholder={t('selectUser')}
                  />
                </div>
              </TabsContent>
              <TabsContent
                value="developer"
                className="space-y-6"
              >
                <div>
                  <h3 className="mb-2 font-semibold">
                    {t('developerCurrent')}
                  </h3>
                  <MemberList members={developersCurrent} onRemove={handleRemoveMember} />
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">
                    {t('inviteDeveloper')}
                  </h3>
                  <InviteSection
                    allUsers={developerList}
                    selected={selectedDevelopers}
                    setSelected={setSelectedDevelopers}
                    selectPlaceholder={t('selectUser')}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => handleInvite()}>{tButton('invite')}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
