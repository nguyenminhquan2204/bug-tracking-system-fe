'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const existingMembers = [
  { id: 1, name: 'Nguyen Van A', role: 'developer' },
  { id: 2, name: 'Tran Thi B', role: 'tester' },
  { id: 5, name: 'Hoang Van E', role: 'developer' },
]

const availableUsers = [
  { id: 3, name: 'Le Van C' },
  { id: 4, name: 'Pham Thi D' },
]

type Role = 'tester' | 'developer'

export default function InviteMemberDialog({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {

   const [activeRole, setActiveRole] = React.useState<Role>('tester')
   const [selectedUsers, setSelectedUsers] = React.useState<{
      tester: { id: number; name: string }[]
      developer: { id: number; name: string }[]
   }>({
      tester: [],
      developer: [],
   })


   const handleSelectUser = (userId: string) => {
      const user = availableUsers.find(u => String(u.id) === userId)
      if (!user) return

      setSelectedUsers(prev => {
         const exists = prev[activeRole].some(u => u.id === user.id)
         if (exists) return prev

         return {
            ...prev,
            [activeRole]: [...prev[activeRole], user],
         }
      })
   }

   const handleRemoveUser = (userId: number) => {
      setSelectedUsers(prev => ({
         ...prev,
         [activeRole]: prev[activeRole].filter(u => u.id !== userId),
      }))
   }

   const handleInvite = () => {
      if (selectedUsers[activeRole].length === 0) return

      console.log('Invite:', {
         role: activeRole,
         users: selectedUsers[activeRole].map(u => u.id),
      })
   }

   const renderInviteTab = (role: Role) => (
      <div className="space-y-3">
         {/* Selected users */}
         <div className="rounded-md border p-3">
            {selectedUsers[role].length > 0 ? (
            <div className="flex flex-wrap gap-2">
               {selectedUsers[role].map(user => (
                  <Badge
                  key={user.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                  >
                  {user.name}
                  <button
                     onClick={() => handleRemoveUser(user.id)}
                     className="ml-1 text-xs hover:text-destructive"
                  >
                     ✕
                  </button>
                  </Badge>
               ))}
            </div>
            ) : (
            <span className="text-sm text-muted-foreground">
               No user selected
            </span>
            )}
         </div>

         {/* Select user */}
         <Select onValueChange={handleSelectUser}>
            <SelectTrigger>
            <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
            {availableUsers.map(user => {
               const disabled = selectedUsers[role].some(u => u.id === user.id)

               return (
                  <SelectItem
                  key={user.id}
                  value={String(user.id)}
                  disabled={disabled}
                  >
                  {user.name}
                  </SelectItem>
               )
            })}
            </SelectContent>
         </Select>

         <div className="flex justify-end">
            <Button
               onClick={handleInvite}
               disabled={selectedUsers[role].length === 0}
            >
               Send invite
            </Button>
         </div>
      </div>
   )

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogTrigger asChild />

         <DialogContent className="sm:max-w-[520px] space-y-6">
         <DialogHeader>
            <DialogTitle>Invite members to project</DialogTitle>
         </DialogHeader>

         {/* CURRENT MEMBERS */}
         <div className="space-y-3">
            <p className="text-sm font-medium">Current members</p>

            <ScrollArea className="h-40 rounded-md border p-3">
               <div className="space-y-4">
               {/* Developers */}
               <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                     Developers
                  </p>
                  {existingMembers
                     .filter(m => m.role === 'developer')
                     .map(member => (
                     <div
                        key={member.id}
                        className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted"
                     >
                        <div className="flex items-center gap-2">
                           <Avatar className="h-7 w-7">
                           <AvatarFallback>
                              {member.name
                                 .split(' ')
                                 .map(w => w[0])
                                 .slice(0, 2)
                                 .join('')}
                           </AvatarFallback>
                           </Avatar>
                           <span className="text-sm">{member.name}</span>
                        </div>
                        <Badge>Developer</Badge>
                     </div>
                     ))}
               </div>

               {/* Testers */}
               <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                     Testers
                  </p>
                  {existingMembers
                     .filter(m => m.role === 'tester')
                     .map(member => (
                     <div
                        key={member.id}
                        className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted"
                     >
                        <div className="flex items-center gap-2">
                           <Avatar className="h-7 w-7">
                           <AvatarFallback>
                              {member.name
                                 .split(' ')
                                 .map(w => w[0])
                                 .slice(0, 2)
                                 .join('')}
                           </AvatarFallback>
                           </Avatar>
                           <span className="text-sm">{member.name}</span>
                        </div>
                        <Badge variant="secondary">Tester</Badge>
                     </div>
                     ))}
               </div>
               </div>
            </ScrollArea>
         </div>

         <div className="space-y-3">
            <p className="text-sm font-medium">Invite new member</p>
            <Tabs
               defaultValue="tester"
               onValueChange={v => setActiveRole(v as Role)}
            >
               <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tester">Tester</TabsTrigger>
                  <TabsTrigger value="developer">Developer</TabsTrigger>
               </TabsList>

               <TabsContent value="tester">
                  {renderInviteTab('tester')}
               </TabsContent>
               <TabsContent value="developer">
                  {renderInviteTab('developer')}
               </TabsContent>
            </Tabs>
         </div>
         </DialogContent>
      </Dialog>
   )
}