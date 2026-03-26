'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import EditorToolbar from './EditorToolbar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useProfileStore } from '@/packages/features/stores/useProfileStore'
import { useShallow } from 'zustand/shallow'
import { myProjectService } from '../services/myProject.service'
import { useMyProjectStore } from '../stores/useMyProjectStore'
import { useTranslations } from 'next-intl'
import { BUG_PRIORITY_OPTIONS, normalizeBugPriorityKey } from '../constants'

export function CreateBugDrawer({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
   const t = useTranslations('Tester.MyProjects')
   const tButton = useTranslations('Button')
   const params = useParams()
   const { profile } = useProfileStore(useShallow((state) => ({
      profile: state.profile
   })))
   const { getDevelopersInProject, developerList, getBugs } = useMyProjectStore(useShallow((state) => ({
      getDevelopersInProject: state.getDevelopersInProject,
      developerList: state.developerList,
      getBugs: state.getBugs
   })))
   const [priority, setPriority] = useState('')
   const [developer, setDeveloper] = useState('')
   const [title, setTitle] = useState('')
   const editor = useEditor({
      extensions: [StarterKit, Image],
      immediatelyRender: false,
   })

   const handleCreate = async () => {
      if(!params.id || !profile) return;
      try {
         const payload = {
            title,
            description: editor?.getHTML(),
            projectId: Number(params.id),
            reporterId: profile?.id,
            priority,
            developerId: Number(developer)
         };

         const response = await myProjectService.postCreateBug(payload);

         if (response?.success) {
            toast.success(t('notifications.createSuccess'));
            getBugs(Number(params.id));
         } else {
            toast.error(response?.message || t('notifications.createError'));
         }
      } catch (error) {
         toast.error(t('notifications.createException'));
         console.error(error);
      }
      setTitle('')
      setPriority('')
      setDeveloper('')
      editor?.commands.clearContent()
      onOpenChange(false);
   }

   useEffect(() => {
      if(!params.id) return;
      getDevelopersInProject(Number(params.id))
   }, [getDevelopersInProject, params.id])

   return (
      <Sheet open={open} onOpenChange={onOpenChange}>
         <SheetContent
            side="right"
            className="!max-w-[700px] p-4 flex flex-col h-full overflow-hidden"
         >
            <SheetHeader>
               <SheetTitle className="text-[24px]">{t('drawer.create.title')}</SheetTitle>
               <SheetDescription>{t('drawer.create.description')}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col flex-1 overflow-hidden gap-6 text-sm">
               <div>
                  <p className="mb-1 font-medium">{t('fields.title')}</p>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('fields.titlePlaceholder')} />
               </div>
               <div className='flex flex-row gap-4'>
                  <div>
                     <p className="mb-1 font-medium">{t('fields.priority')}</p>
                     <Select onValueChange={setPriority}>
                        <SelectTrigger className='w-40'>
                           <SelectValue placeholder={t('fields.selectPriority')} />
                        </SelectTrigger>
                        <SelectContent>
                           {BUG_PRIORITY_OPTIONS.map((item) => (
                              <SelectItem key={item} value={item}>
                                 {t(`priority.options.${normalizeBugPriorityKey(item)}`)}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div>
                     <p className="mb-1 font-medium">{t('fields.developer')}</p>
                     <Select onValueChange={setDeveloper}>
                        <SelectTrigger className='w-40'>
                           <SelectValue placeholder={t('fields.selectDeveloper')} />
                        </SelectTrigger>
                        <SelectContent>
                           {developerList && developerList.length > 0 && developerList.map((item) => {
                              return (
                                 <SelectItem key={item.id} value={String(item.id)}>{item.userName}</SelectItem>
                              )
                           })}
                        </SelectContent>
                     </Select>
                  </div>
               </div>
               <div className="flex flex-col flex-1 min-h-0 gap-2">
                  <p className="font-medium">{t('fields.description')}</p>

                  {editor && <EditorToolbar editor={editor} />}

                  <div className="flex-1 min-h-0 overflow-y-auto rounded-md border p-3">
                     <EditorContent editor={editor} />
                  </div>
               </div>
            </div>
            <div className="flex items-center justify-end gap-2">
               <Button variant="outline" onClick={() => onOpenChange(false)}>{tButton('cancel')}</Button>
               <Button disabled={!title || !priority || !editor || !developer} onClick={handleCreate}>{t('actions.create')}</Button>
            </div>
         </SheetContent>
      </Sheet>
   )
}
