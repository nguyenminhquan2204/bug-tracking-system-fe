/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { myProjectService } from "../services/myProject.service"
import { toast } from "sonner"
import { Paperclip, X } from "lucide-react"
import { useMyProjectStore } from "../stores/useMyProjectStore"
import { useShallow } from "zustand/shallow"

interface Props {
  bugId: number
}

export default function AddCommentSection({ bugId }: Props) {
  const { getBugDetailById, usersMention } = useMyProjectStore(useShallow((state) => ({
    getBugDetailById: state.getBugDetailById,
    usersMention: state.usersMention
  })))
  const [content, setContent] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showMention, setShowMention] = useState(false)
  const [selectedMentions, setSelectedMentions] = useState<any[]>([])

  const handleChange = (value: string) => {
    setContent(value)

    const match = value.slice(0, value.length).match(/@(\w*)$/)
    setShowMention(!!match)

    setSelectedMentions((prev) => {
      return prev.filter(user =>
        value.includes(`@${user.userName}`)
      )
    })
  }

  const handleSelectUser = (user: any) => {
    const newText = content.replace(/@(\w*)$/, `@${user.userName} `)

    setContent(newText)
    setShowMention(false)
    setSelectedMentions((prev) => {
      if (prev.find(u => u.id === user.id)) return prev
      return [...prev, user]
    })
  }

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0) return
    setLoading(true)
    try {
      const mentionIds = selectedMentions.map(u => u.id)
      const formData = new FormData();
      formData.append("content", content);
      formData.append("mentions", JSON.stringify(mentionIds))
      files.forEach((file) => {
        formData.append('files', file);
      })

      const response = await myProjectService.postComment(bugId, formData);

      if (response?.success) {
        toast.success("Commented bug successfully")
        setContent("")
        setFiles([])
        setSelectedMentions([])
        getBugDetailById(bugId)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        toast.error(response?.message || "Failed to comment bug")
      }
    } catch (error) {
      toast.error("An error occurred while comment bug")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => handleChange(e.target.value)}
      />
      {showMention && usersMention.length > 0 && (
        <div className="border rounded-md shadow bg-white max-h-40 overflow-y-auto">
          {usersMention.map((user) => (
            <div
              key={user.id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectUser(user)}
            >
              {user.userName}
            </div>
          ))}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const fileList = e.currentTarget.files
          if (!fileList) return

          setFiles((prev) => [...prev, ...Array.from(fileList)])
        }}
      />
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2"
        >
          <Paperclip className="h-4 w-4" />
          Attach image / video
        </Button>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
            >
              <span className="truncate max-w-[220px]">
                {file.name}
              </span>

              <button
                type="button"
                onClick={() =>
                  setFiles((prev) => prev.filter((_, i) => i !== index))
                }
                className="text-muted-foreground hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </div>
  )
}