"use client";

import { useEffect, useMemo, useState } from "react";
import { DndContext, DragEndEvent, closestCorners, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SearchAndCreateBug from "../components/FillterSearchBug";
import { useMyProjectStore } from "../stores/useMyProjectStore";
import { useShallow } from "zustand/shallow";
import { IBug, IBugs } from "../interface";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BugDetail from "../components/BugDetail";
import { useTranslations } from "next-intl";
import { BUG_STATUS_OPTIONS, normalizeBugPriorityKey } from "../constants";

type Task = {
  id: string;
  title: string;
  bug: IBug;
};

type ColumnType = {
  id: string;
  title: string;
  tasks: Task[];
};

function getStatusColor(status: Task["bug"]["priority"]) {
  switch (status) {
    case "LOW":
      return "bg-green-100 text-green-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    case "CRITICAL":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
}

function Column({
  column,
  onSelect,
  emptyLabel,
}: {
  column: ColumnType;
  onSelect: (bug: IBug) => void;
  emptyLabel: string;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="w-72 shrink-0 rounded-md border bg-gray-50 p-2 flex flex-col"
    >
      <div className="flex flex-row">
        <h3 className="mb-3 font-medium">{column.title}</h3>
        <span className="min-w-[28px] h-6 px-2 flex items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
          {column.tasks.length}
        </span>
      </div>
      <SortableContext
        items={column.tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-2">
          {column.tasks.length === 0 && (
            <div className="rounded-md border border-dashed p-3 text-center text-sm text-gray-400">
              {emptyLabel}
            </div>
          )}

          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onSelect={onSelect} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function TaskCard({
  task,
  onSelect,
}: {
  task: Task;
  onSelect: (bug: IBug) => void;
}) {
  const t = useTranslations("Tester.MyProjects");
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
            className={`w-[100px] whitespace-nowrap text-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
              task.bug.priority,
            )}`}
          >
            {t(`priority.options.${normalizeBugPriorityKey(task.bug.priority)}`)}
          </div>
        </div>
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
        >
          ::
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

            <span className="text-sm font-medium">{task.bug.developer.userName}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            {t("board.unassigned")}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ProjectBugDetailPage() {
  const t = useTranslations("Tester.MyProjects");
  const {
    getBugs,
    bugs,
    patchUpdateBugStatus,
    getUsersMention,
  } = useMyProjectStore(
    useShallow((state) => ({
      getBugs: state.getBugs,
      bugs: state.bugs,
      patchUpdateBugStatus: state.patchUpdateBugStatus,
      getUsersMention: state.getUsersMention,
    })),
  );
  const params = useParams();
  const [selectedBug, setSelectedBug] = useState<IBug | null>(null);

  useEffect(() => {
    if (!params.id) return;
    const fetchApi = async () => {
      await Promise.all([getBugs(Number(params.id)), getUsersMention(Number(params.id))]);
    };
    fetchApi();
  }, [getBugs, getUsersMention, params.id]);

  const columns = useMemo(() => {
    return BUG_STATUS_OPTIONS.map((colId) => ({
      id: colId,
      title: t(`status.options.${colId}`),
      tasks: (bugs?.[colId as keyof IBugs] ?? []).map((bug: IBug) => ({
        id: String(bug.id),
        title: bug.title,
        bug,
      })),
    }));
  }, [bugs, t]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let newStatus = "";

    const next = structuredClone(columns);

    let sourceColIndex = -1;
    let targetColIndex = -1;
    next.forEach((col, colIndex) => {
      const taskIndex = col.tasks.findIndex((t) => t.id === activeId);

      if (taskIndex !== -1) {
        sourceColIndex = colIndex;
      }

      if (col.id === overId || col.tasks.some((t) => t.id === overId)) {
        targetColIndex = colIndex;
      }
    });

    if (sourceColIndex === -1 || targetColIndex === -1) return;

    if (sourceColIndex !== targetColIndex) {
      newStatus = next[targetColIndex].id;
    }

    if (newStatus) {
      try {
        await patchUpdateBugStatus(Number(activeId), newStatus);
        if (params.id) {
          await getBugs(Number(params.id));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <BugDetail selectedBug={selectedBug} setSelectedBug={setSelectedBug} />
      <div className="flex flex-col space-y-4 h-full">
        <h1 className="text-xl font-semibold">{t("board.title")}</h1>
        <SearchAndCreateBug />
        <div className="flex-1">
          <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="h-full flex gap-4 overflow-x-auto">
              {columns.map((col) => (
                <Column
                  key={col.id}
                  column={col}
                  onSelect={(bug) => setSelectedBug(bug)}
                  emptyLabel={t("board.dropHere")}
                />
              ))}
            </div>
          </DndContext>
        </div>
      </div>
    </>
  );
}
