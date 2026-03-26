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
import { useParams } from "next/navigation"
import { useProfileStore } from "@/packages/features/stores/useProfileStore"
import { myProjectService } from "../services/myProject.service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl"
import { BUG_PRIORITY_OPTIONS, normalizeBugPriorityKey } from "../constants"

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
  onSuccess
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  bug: IBug | null
  onSuccess: () => void
}) {
  const t = useTranslations("Tester.MyProjects")
  const tButton = useTranslations("Button")
  const params = useParams()
  const { developerList, getBugs } = useMyProjectStore(
    useShallow((state) => ({
      developerList: state.developerList,
      getBugs: state.getBugs,
    }))
  )
  const { profile } = useProfileStore(useShallow((state) => ({
    profile: state.profile
  })))

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
  }, [bug, editor, form])

  const onSubmit = async (values: FormValues) => {
    if (!bug || !params.id || !profile) return

    try {
      const payload = {
        title: values.title,
        description: values.description,
        projectId: Number(params.id),
        reporterId: bug.reporter.id,
        priority: values.priority,
        developerId: values.developerId,
      }

      const response = await myProjectService.patchEditBug(bug.id, payload);
      if(response?.success) {
        toast.success(t("notifications.updateSuccess"));
        getBugs(Number(params.id));
        onSuccess();
      } else {
        toast.error(response?.message || t("notifications.updateError"));
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(t("notifications.updateException"));
      console.log(error);
    }
  }

  const handleDelete = async () => {
    if (!bug || !params.id) return

    try {
      const response = await myProjectService.deleteBug(bug.id)

      if (response?.success) {
        toast.success(t("notifications.deleteSuccess"))
        getBugs(Number(params.id))
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(response?.message || t("notifications.deleteError"))
      }
    } catch (error) {
      toast.error(t("notifications.deleteException"))
      console.log(error)
    }
  }

  if (!bug) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!max-w-[700px] p-4 flex flex-col flex-1 min-h-0 overflow-hidden"
      >
        <SheetHeader>
          <SheetTitle className="text-[24px]">{t("drawer.edit.title")}</SheetTitle>
          <SheetDescription>{t("drawer.edit.description")}</SheetDescription>
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
                  <FormLabel>{t("fields.title")}</FormLabel>
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
                    <FormLabel>{t("fields.priority")}</FormLabel>
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
                        {BUG_PRIORITY_OPTIONS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {t(`priority.options.${normalizeBugPriorityKey(item)}`)}
                          </SelectItem>
                        ))}
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
                    <FormLabel>{t("fields.assignDeveloper")}</FormLabel>
                    <Select
                      value={field.value || "none"}
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? null : value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder={t("fields.selectDeveloper")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">{t("detail.unassigned")}</SelectItem>
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
                  <FormLabel>{t("fields.description")}</FormLabel>
                  <FormControl className="flex flex-col flex-1 min-h-0">
                    <div className="flex flex-col flex-1 min-h-0">
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
                {tButton("cancel")}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                  >
                    {tButton("delete")}
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("deleteDialog.description")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>{tButton("cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {t("deleteDialog.confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type="submit">
                {tButton("save")}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
