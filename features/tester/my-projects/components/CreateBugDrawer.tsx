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

export function CreateBugDrawer({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
   const params = useParams()
   const { profile } = useProfileStore(useShallow((state) => ({
      profile: state.profile
   })))
   const [priority, setPriority] = useState('')
   const [title, setTitle] = useState('')
   const editor = useEditor({
      extensions: [StarterKit, Image],
      immediatelyRender: false,
   })

   const handleCreate = async () => {
      if(!params.id) return;
      if(!profile) return;
      try {
         const payload = {
            title,
            priority,
            description: editor?.getHTML(),
            projectId: Number(params.id),
            reporterId: profile?.id
         };

         console.log('Log', payload);

         const response = await myProjectService.postCreateBug(payload);

         if (response?.success) {
            toast.success("Created bug successfully");
            setTitle('')
            setPriority('')
            editor?.commands.clearContent()
         } else {
            toast.error(response?.message || "Failed to create bug");
         }
      } catch (error) {
         toast.error("An error occurred while creating bug");
         console.error(error);
      }
      onOpenChange(false);
   }

   return (
      <Sheet open={open} onOpenChange={onOpenChange}>
         <SheetContent
            side="right"
            className="!max-w-[700px] p-4 flex flex-col h-full overflow-hidden"
         >
            <SheetHeader>
               <SheetTitle className="text-[24px]">Create Bug</SheetTitle>
               <SheetDescription>Bug information</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col flex-1 overflow-hidden gap-6 text-sm">
               <div>
                  <p className="mb-1 font-medium">Title</p>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter bug title..." />
               </div>
               <div>
                  <p className="mb-1 font-medium">Priority</p>
                  <Select onValueChange={setPriority}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="flex flex-col flex-1 min-h-0 gap-2">
                  <p className="font-medium">Description</p>

                  {editor && <EditorToolbar editor={editor} />}

                  <div className="flex-1 min-h-0 overflow-y-auto rounded-md border p-3">
                     <EditorContent editor={editor} />
                  </div>
               </div>
            </div>
            <div className="flex items-center justify-end gap-2">
               <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
               <Button disabled={!title || !priority || !editor} onClick={handleCreate}>Create</Button>
            </div>
         </SheetContent>
      </Sheet>
   )
}
