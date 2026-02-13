'use client'

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"

import { IBug } from "../interface"
import { useMyProjectStore } from "../stores/useMyProjectStore"
import { useShallow } from "zustand/shallow"
import { toast } from "sonner"
import EditorToolbar from "./EditorToolbar"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  priority: z.string(),
  developerId: z.string().nullable(),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function EditBugSheet({
  open,
  onOpenChange,
  bug,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bug: IBug | null
}) {

  const { developerList } = useMyProjectStore(
    useShallow((state) => ({
      developerList: state.developerList,
    }))
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      priority: "LOW",
      developerId: null,
      description: "",
    },
  })

  const editor = useEditor({
    extensions: [StarterKit, Image],
    immediatelyRender: false,
    onUpdate({ editor }) {
      form.setValue("description", editor.getHTML())
    },
  })

  useEffect(() => {
    if (bug) {
      form.reset({
        title: bug.title,
        priority: bug.priority,
        developerId: bug.developer?.id?.toString() || null,
        description: bug.description || "",
      })

      editor?.commands.setContent(bug.description || "")
    }
  }, [bug, editor])

  const onSubmit = async (values: FormValues) => {
    if (!bug) return

    try {
      console.log(values)

      // await bugService.updateBug(bug.id, {
      //   title: values.title,
      //   description: values.description || "",
      //   priority: values.priority,
      //   developerId: values.developerId
      //     ? Number(values.developerId)
      //     : null,
      // })

      toast.success("Bug updated successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Update failed")
    }
  }

  if (!bug) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!max-w-[700px] p-4 flex flex-col h-full overflow-hidden"
      >
        <SheetHeader>
          <SheetTitle className="text-[24px]">Edit Bug</SheetTitle>
          <SheetDescription>Update bug information</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 gap-6 overflow-hidden text-sm"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="developerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign Developer</FormLabel>
                    <Select
                      value={field.value || "none"}
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? null : value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select dev" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {developerList?.map((dev) => (
                          <SelectItem
                            key={dev.id}
                            value={dev.id.toString()}
                          >
                            {dev.userName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={() => (
                <FormItem className="flex flex-col flex-1 min-h-0 gap-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div>
                      {editor && <EditorToolbar editor={editor} />}

                      <div className="flex-1 min-h-0 overflow-y-auto rounded-md border p-3">
                        <EditorContent editor={editor} />
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}