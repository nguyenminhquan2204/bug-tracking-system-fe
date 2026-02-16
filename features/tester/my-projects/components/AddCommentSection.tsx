/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { myProjectService } from "../services/myProject.service"
import { toast } from "sonner"
import { Paperclip, X } from "lucide-react"

interface Props {
  bugId: number
}

export default function AddCommentSection({ bugId }: Props) {
  const [content, setContent] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0) return
    setLoading(true)
    try {
      const uploadResults = await Promise.allSettled(files.map((file) => myProjectService.uploadFile(file)))

      const uploadedUrls = uploadResults
        .filter(
          (result): result is PromiseFulfilledResult<any> =>
            result.status === "fulfilled" && result.value?.success
        )
        .map((result) => result.value.data.url)

      console.log('Upload', uploadedUrls);

      const response = await myProjectService.postComment(bugId, {
        content,
        attachments: uploadedUrls,
      })

      if (response?.success) {
        toast.success("Commented bug successfully")
        setContent("")
        setFiles([])

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
        onChange={(e) => setContent(e.target.value)}
      />
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