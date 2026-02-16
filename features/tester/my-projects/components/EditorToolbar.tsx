import {
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Code,
  List,
  ListOrdered,
  Image as ImageIcon,
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Editor } from '@tiptap/react'
import { myProjectService } from '../services/myProject.service'
import { toast } from 'sonner'

function Divider() {
  return <div className="mx-1 h-5 w-px bg-border" />
}

export default function EditorToolbar({ editor }: { editor: Editor }) {
  if (!editor) return null

  const addImageByUrl = () => {
    const url = prompt('Image URL')
    if (!url) return

    editor.chain().focus().setImage({ src: url }).run()
  }

  const uploadImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = async () => {
      try {
        const file = input.files?.[0]
        if (!file) return

        const response = await myProjectService.uploadFile(file);
        if(response?.success) {
          toast.success("Uploaded successfully");
          editor.chain().focus().setImage({ src: response.data }).run();
        } else {
          toast.error(response?.message || "Failed upload");
        }
      } catch (error) {
        toast.error("An error occurred while upload image");
        console.error(error);
      }
    }

    input.click()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-md border bg-background px-2 py-1">
      <span className="px-2 text-xs text-muted-foreground">100%</span>

      <Select
        value={
          editor.isActive('heading', { level: 2 }) ? 'h2' : 'paragraph'
        }
        onValueChange={(value) => {
          if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run()
          }
          if (value === 'h2') {
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        }}
      >
        <SelectTrigger className="h-7 w-[60px]">
          <SelectValue placeholder="Text" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Text</SelectItem>
          <SelectItem value="h2">H2</SelectItem>
        </SelectContent>
      </Select>

      <Divider />

      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('code')}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Toggle>

      <Divider />

      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() =>
          editor.chain().focus().toggleBulletList().run()
        }
      >
        <List className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Divider />
      <button
        type="button"
        onClick={uploadImage}
        className="flex h-8 items-center justify-center rounded px-2 hover:bg-muted"
        title="Upload image"
      >
        <ImageIcon className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={addImageByUrl}
        className="px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        Image URL
      </button>
    </div>
  )
}
