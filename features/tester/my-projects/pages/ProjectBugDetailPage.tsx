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
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'
import SearchAndCreateBug from '../components/FillterSearchBug'
import { useMyProjectStore } from '../stores/useMyProjectStore'
import { useShallow } from 'zustand/shallow'
import { IBugs } from '../interface'
import { useParams } from 'next/navigation'

type Task = {
   id: string
   title: string
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
      tasks: (bugs?.[col.id as keyof IBugs] ?? []).map((bug: any) => ({
         id: String(bug.id),
         title: bug.title,
      })),
   })
)

function Column({ column }: { column: ColumnType }) {
   const { setNodeRef } = useDroppable({ id: column.id })

   return (
      <div
         ref={setNodeRef}
         className="w-72 shrink-0 rounded-md border bg-gray-50 p-3 flex flex-col"
      >
         <h3 className="mb-3 font-medium">{column.title}</h3>

         <SortableContext
         items={column.tasks.map((t) => t.id)}
         strategy={verticalListSortingStrategy}
         >
         <div className="flex-1 space-y-2">
            {column.tasks.length === 0 && (
               <div className="rounded-md border border-dashed p-4 text-center text-sm text-gray-400">
               Drop here
               </div>
            )}

            {column.tasks.map((task) => (
               <TaskCard key={task.id} task={task} />
            ))}
         </div>
         </SortableContext>
      </div>
   )
}

function TaskCard({ task }: { task: Task }) {
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
         {...attributes}
         {...listeners}
         className="cursor-grab rounded-md border bg-white p-2 shadow-sm hover:bg-gray-100"
      >
         {task.title}
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

   /* Load data */
   useEffect(() => {
      if(!params.id) return;
      getBugs()
   }, [getBugs])

   useEffect(() => {
      setColumns(buildColumnsFromBugs(bugs))
   }, [bugs])

   /* Drag logic */
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
      <div className="flex flex-col space-y-4 h-full">
         <h1 className="text-xl font-semibold">Project Bug Board</h1>
         <SearchAndCreateBug />

         <div className='flex-1'>
            <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
            >
            <div className="h-full flex gap-4 overflow-x-auto pb-4">
               {columns.map((col) => (
                  <Column key={col.id} column={col} />
               ))}
            </div>
            </DndContext>
         </div>
      </div>
   )
}
