import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getSeverityStyle, getStatusStyle } from "@/packages/utils";
import { useManageBugStore } from "../stores/useManageBugStore";
import { useShallow } from "zustand/shallow";

import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BUG_STATUS_OPTIONS_WITH_LABEL,
  BugStatus,
} from "@/features/developer/my-projects/constants";

type SearchFormValues = {
  keyword: string;
  status: string;
};

export function BodyBugSummary() {
  const { bugList } = useManageBugStore(
    useShallow((state) => ({
      bugList: state.bugList,
    })),
  );

  const form = useForm<SearchFormValues>({
    defaultValues: {
      keyword: "",
      status: "",
    },
  });

  const onSubmit = (values: SearchFormValues) => {
    console.log("Search Values:", values);

    // call api/search here
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Bug List</h2>
            <p className="mt-1 text-sm text-gray-500">
              All bugs reported within the selected date range.
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-wrap gap-3"
            >
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Search bug..."
                        className="w-[220px] rounded-2xl"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px] rounded-2xl">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BUG_STATUS_OPTIONS_WITH_LABEL.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button type="submit" className="rounded-2xl px-6">
                Search
              </Button>
            </form>
          </Form>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bug ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bugList?.length > 0 ? (
                bugList.map((bug) => (
                  <TableRow key={bug.id}>
                    <TableCell className="font-semibold">{bug.id}</TableCell>

                    <TableCell className="max-w-[260px] truncate">
                      {bug.title}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                          bug.status,
                        )}`}
                      >
                        {bug.status}
                      </span>
                    </TableCell>

                    <TableCell>{bug?.developer?.userName || "-"}</TableCell>

                    <TableCell>{bug?.reporter?.userName || "-"}</TableCell>

                    <TableCell>
                      {bug.createdAt
                        ? new Date(bug.createdAt).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <button className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium transition hover:bg-black hover:text-white">
                        View Detail
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-gray-500"
                  >
                    No bugs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Bug Detail</h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Title
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                Cannot upload attachment larger than 5MB
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Description
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Users receive a 413 Payload Too Large error when uploading large
                files even though the configured limit allows up to 20MB.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Severity
                </p>

                <p className="mt-1 text-sm font-medium text-red-600">High</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Status
                </p>

                <p className="mt-1 text-sm font-medium text-blue-600">
                  In Progress
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Reporter
                </p>

                <p className="mt-1 text-sm text-gray-700">QA Team</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Assigned To
                </p>

                <p className="mt-1 text-sm text-gray-700">Quan Nguyen</p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Activity Timeline
              </p>

              <div className="mt-3 space-y-4 border-l border-gray-200 pl-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Bug created
                  </p>

                  <p className="text-xs text-gray-500">
                    May 10, 2026 - 10:42 AM
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Assigned to backend team
                  </p>

                  <p className="text-xs text-gray-500">
                    May 10, 2026 - 11:20 AM
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Fix in progress
                  </p>

                  <p className="text-xs text-gray-500">
                    May 11, 2026 - 02:15 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>

          <div className="mt-5 flex flex-col gap-3">
            <button className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90">
              Update Status
            </button>

            <button className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium transition hover:bg-gray-100">
              Assign Developer
            </button>

            <button className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium transition hover:bg-gray-100">
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
