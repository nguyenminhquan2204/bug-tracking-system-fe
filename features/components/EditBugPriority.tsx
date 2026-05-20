/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { BUG_PRIORITY_OPTIONS_WITH_LABEL } from "../developer/my-projects/constants";
import { myProjectService } from "../tester/my-projects/services/myProject.service";
import { toast } from "sonner";
import { useManageBugStore } from "../admin/manage-bugs/stores/useManageBugStore";
import { getPriorityStyle } from "@/packages/utils";
import { useManageBugTesterStore } from "../tester/my-bugs/stores/useManageBugTesterStore";

interface Props {
  bugId: number;
  priority: string;
  onSuccess: (status: any) => void;
  flash?: string
}

export default function EditBugPriority({
  bugId,
  priority,
  onSuccess,
  flash
}: Props) {
  const tDiff = useTranslations('diff');

  const updateBugPriority = useManageBugStore(
    (state) => state.updateBugPriority
  );
  const updateBugPriorityForTester = useManageBugTesterStore(
    (state) => state.updateBugPriorityForTester
  )
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleUpdateStatus = async (newPriority: string) => {
    if (newPriority === priority) {
      setEditing(false);
      return;
    }

    try {
      setLoading(true);

      const response = await myProjectService.patchUpdateBugPriority(bugId, newPriority);

      if(response?.success) {
         toast.success('Updated bug priority successfully');
      } else {
         toast.error(response?.message || 'Failed to update priority');
      }

      if(flash && flash === 'tester') {
        updateBugPriorityForTester(bugId, newPriority)
      } else {
        updateBugPriority(bugId, newPriority);
      }
      onSuccess(newPriority);
      setEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <Select
        defaultValue={priority}
        onValueChange={handleUpdateStatus}
        disabled={loading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {BUG_PRIORITY_OPTIONS_WITH_LABEL.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <>
      <span>{tDiff('priority')}: </span>
      <Badge
        className={`
            cursor-pointer border transition-colors duration-200
            ${getPriorityStyle(priority)}
         `}
        onClick={() => setEditing(true)}
      >
        {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
        {`${priority}`}
      </Badge>
    </>
  );
}