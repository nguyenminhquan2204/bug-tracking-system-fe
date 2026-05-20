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
import { normalizeBugStatusKey, BUG_STATUS_OPTIONS_WITH_LABEL } from "../developer/my-projects/constants";
import { myProjectService } from "../tester/my-projects/services/myProject.service";
import { toast } from "sonner";
import { useManageBugStore } from "../admin/manage-bugs/stores/useManageBugStore";
import { getStatusStyle } from "@/packages/utils";
import { useManageBugTesterStore } from "../tester/my-bugs/stores/useManageBugTesterStore";
import { useManageBugDevStore } from "../developer/my-bugs/stores/useManageBugDevStore";

interface Props {
  bugId: number;
  status: string;
  onSuccess: (status: any) => void;
  flash?: string
}

export default function EditableBugStatus({
  bugId,
  status,
  onSuccess,
  flash
}: Props) {
  const t = useTranslations("Tester.MyProjects");
  const tDiff = useTranslations('diff');

  const updateBugStatus = useManageBugStore(
    (state) => state.updateBugStatus
  );
  const updateBugStatusForTester = useManageBugTesterStore(
    (state) => state.updateBugStatusForTester
  );
  const updateBugStatusForDev = useManageBugDevStore(
    (state) => state.updateBugStatusForDev
  );
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleUpdateStatus = async (newStatus: string) => {
    if (newStatus === status) {
      setEditing(false);
      return;
    }

    try {
      setLoading(true);

      const response = await myProjectService.patchUpdateBugStatus(bugId, newStatus);

      if(response?.success) {
         toast.success('Updated bug status successfully');
      } else {
         toast.error(response?.message || 'Failed to update user');
      }

      if(flash && flash === 'tester') {
        updateBugStatusForTester(bugId, newStatus)
      } else if(flash && flash === 'developer') {
        updateBugStatusForDev(bugId, newStatus)
      } else {
        updateBugStatus(bugId, newStatus);
      }

      onSuccess(newStatus);
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
        defaultValue={status}
        onValueChange={handleUpdateStatus}
        disabled={loading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {BUG_STATUS_OPTIONS_WITH_LABEL.map((item) => (
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
      <span>{tDiff('status')}: </span>
      <Badge
        className={`
          cursor-pointer border transition-colors duration-200
          ${getStatusStyle(status)}
        `}
        onClick={() => setEditing(true)}
      >
        {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
        {`${status}`}
      </Badge>
    </>
  );
}