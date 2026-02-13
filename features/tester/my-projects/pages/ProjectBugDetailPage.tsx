/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'
import SearchAndCreateBug from '../components/FillterSearchBug'
import { useMyProjectStore } from '../stores/useMyProjectStore'
import { useShallow } from 'zustand/shallow'
import { IBug, IBugs } from '../interface'
import { useParams } from 'next/navigation'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import BugDetail from '../components/BugDetail'

type Task = {
   id: string,
   title: string,
   bug: IBug
}

type ColumnType = {
   id: string
   title: string
   tasks: Task[]
}

const COLUMN_CONFIG = [
   { id: 'todo', title: 'Todo' },
   { id: 'doing', title: 'Doing' },
   { id: 'pr_in_review', title: 'PR in review' },
   { id: 'merged', title: 'Merged' },
   { id: 'ready_for_qc', title: 'Ready for QC' },
   { id: 'qc_in_progress', title: 'QC in progress' },
   { id: 'done_in_dev', title: 'Done in Dev' },
   { id: 'on_stg', title: 'On STG' },
]

const buildColumnsFromBugs = (bugs: IBugs | null): ColumnType[] =>
   COLUMN_CONFIG.map((col) => ({
      id: col.id,
      title: col.title,
      tasks: (bugs?.[col.id as keyof IBugs] ?? []).map((bug: IBug) => ({
         id: String(bug.id),
         title: bug.title,
         bug: bug
      })),
   })
)

function getStatusColor(status: Task['bug']['priority']) {
   switch (status) {
      case 'LOW':
         return 'bg-green-100 text-green-700'
      case 'MEDIUM':
         return 'bg-yellow-100 text-yellow-700'
      case 'HIGH':
         return 'bg-orange-100 text-orange-700'
      case "CRITICAL":
         return 'bg-red-100 text-red-700'
      default:
         return 'bg-gray-200 text-gray-700'
   }
}

function Column({ column, onSelect }: { column: ColumnType, onSelect: (bug: IBug) => void }) {
   const { setNodeRef } = useDroppable({ id: column.id })

   return (
      <div
         ref={setNodeRef}
         className="w-72 shrink-0 rounded-md border bg-gray-50 p-2 flex flex-col"
      >
         <h3 className="mb-3 font-medium">{column.title}</h3>

         <SortableContext
         items={column.tasks.map((t) => t.id)}
         strategy={verticalListSortingStrategy}
         >
         <div className="flex-1 space-y-2">
            {column.tasks.length === 0 && (
               <div className="rounded-md border border-dashed p-3 text-center text-sm text-gray-400">
                  Drop here
               </div>
            )}

            {column.tasks.map((task) => (
               <TaskCard key={task.id} task={task} onSelect={onSelect} />
            ))}
         </div>
         </SortableContext>
      </div>
   )
}

function TaskCard({ task, onSelect }: { task: Task, onSelect: (bug: IBug) => void }) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(task.bug)}
      className="rounded-xl border bg-white p-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h3 className="text-[16px] font-semibold text-gray-800 line-clamp-2">
            {task.title}
          </h3>

          <div
            className={`w-[80px] whitespace-nowrap text-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
              task.bug.priority
            )}`}
          >
            {task.bug.priority}
          </div>
        </div>
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
        >
          ⋮⋮
        </div>
      </div>

      <div className="mt-4">
        {task.bug.developer.userName ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {task.bug.developer.userName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <span className="text-sm font-medium">
              {task.bug.developer.userName}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            Unassigned
          </span>
        )}
      </div>
    </div>
  )
}

export default function ProjectBugDetailPage() {
   const { getBugs, bugs, patchUpdateBugStatus } = useMyProjectStore(
      useShallow((state) => ({
         getBugs: state.getBugs,
         bugs: state.bugs,
         patchUpdateBugStatus: state.patchUpdateBugStatus
      }))
   )
   const params= useParams()
   const [columns, setColumns] = useState<ColumnType[]>([])
   const [selectedBug, setSelectedBug] = useState<IBug | null>(null)

   useEffect(() => {
      if(!params.id) return;
      getBugs()
   }, [getBugs])

   useEffect(() => {
      setColumns(buildColumnsFromBugs(bugs))
   }, [bugs])

   const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event
      if (!over) return

      const activeId = active.id as string
      const overId = over.id as string

      let newStatus = ''

      setColumns((prev) => {
         const next = structuredClone(prev)

         let sourceColIndex = -1
         let targetColIndex = -1
         let sourceTaskIndex = -1

         next.forEach((col, colIndex) => {
            const taskIndex = col.tasks.findIndex((t) => t.id === activeId)

            if (taskIndex !== -1) {
               sourceColIndex = colIndex
               sourceTaskIndex = taskIndex
            }

            if (
               col.id === overId ||
               col.tasks.some((t) => t.id === overId)
            ) {
               targetColIndex = colIndex
            }
         })

         if (sourceColIndex === -1 || targetColIndex === -1) return prev

         if (sourceColIndex !== targetColIndex) {
            const [movedTask] = next[sourceColIndex].tasks.splice(sourceTaskIndex, 1)
            next[targetColIndex].tasks.push(movedTask)
            newStatus = next[targetColIndex].id
         }

         return next
      })

      if (newStatus) {
         try {
            await patchUpdateBugStatus(Number(activeId), newStatus)
         } catch (err) {
            console.error(err)
         }
      }
   }

   return (
      <>
         <BugDetail
            selectedBug={selectedBug}
            setSelectedBug={setSelectedBug}
         />
         <div className="flex flex-col space-y-4 h-full">
            <h1 className="text-xl font-semibold">Project Bug Board</h1>
            <SearchAndCreateBug />
            <div className='flex-1'>
               <DndContext
                  collisionDetection={closestCorners}
                  onDragEnd={handleDragEnd}
               >
               <div className="h-full flex gap-4 overflow-x-auto">
                  {columns.map((col) => (
                     <Column key={col.id} column={col} onSelect={(bug) => setSelectedBug(bug)} />
                  ))}
               </div>
               </DndContext>
            </div>
         </div>
      </>
   )
}