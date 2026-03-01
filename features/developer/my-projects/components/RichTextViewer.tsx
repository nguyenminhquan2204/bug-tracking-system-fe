'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

export default function RichTextViewer({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content,
    editable: false,
    immediatelyRender: false,
  })

  if (!editor) return null

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
}
