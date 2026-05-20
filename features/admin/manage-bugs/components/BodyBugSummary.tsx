import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPriorityStyle, getStatusStyle } from "@/packages/utils";
import { useManageBugStore } from "../stores/useManageBugStore";
import { useShallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BUG_STATUS_OPTIONS_WITH_LABEL } from "@/features/developer/my-projects/constants";
import { useMemo, useState } from "react";
import { IBug } from "@/features/tester/my-projects/interface";
import BugDetail from "@/features/developer/my-projects/components/BugDetail";
import { useTranslations } from "next-intl";

type SearchFormValues = {
  keyword: string;
  status: string;
};

export function BodyBugSummary() {
  const tButton = useTranslations('Button');
  const t = useTranslations('Admin.ManageBug.table');
  const [selectedBug, setSelectedBug] = useState<IBug | null>(null);
  const { bugList } = useManageBugStore(
    useShallow((state) => ({
      bugList: state.bugList,
    })),
  );
  const form = useForm<SearchFormValues>({
    defaultValues: {
      keyword: "",
      status: "ALL",
    },
  });
  const keyword = form.watch('keyword');
  const status = form.watch("status");

  const filterBugList = useMemo(() => {
    return bugList.filter((bug) => {
      const matchKeyword = !keyword || bug.title.toLowerCase().includes(keyword.toLowerCase()) || String(bug.id).includes(keyword);
      const matchStatus = status === "ALL" || bug.status === status;

      return matchKeyword && matchStatus;
    })
  }, [bugList, keyword, status]);

  return (
    <>
      <BugDetail 
        selectedBug={selectedBug}
        setSelectedBug={setSelectedBug}
      />
      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{t('title')}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {t('description')}
              </p>
            </div>
            <Form {...form}>
              <form className="flex flex-wrap gap-3">
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
                        value={field.value}
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
                <Button
                  type="button"
                  className="rounded-2xl px-6"
                  onClick={() =>
                    form.reset({
                      keyword: "",
                      status: "ALL",
                    })
                  }
                >
                  {tButton('reset')}
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-6 overflow-x-auto rounded-2xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('columns.id')}</TableHead>
                  <TableHead>{t('columns.title')}</TableHead>
                  <TableHead>{t('columns.status')}</TableHead>
                  <TableHead>{t('columns.priority')}</TableHead>
                  <TableHead>{t('columns.assignee')}</TableHead>
                  <TableHead>{t('columns.reporter')}</TableHead>
                  <TableHead>{t('columns.createdAt')}</TableHead>
                  <TableHead>{t('columns.action')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterBugList?.length > 0 ? (
                  filterBugList.map((bug) => (
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
                      <TableCell>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(
                            bug.priority,
                          )}`}
                        >
                          {bug.priority}
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
                        <button onClick={() => setSelectedBug(bug)} className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium transition hover:bg-black hover:text-white">
                          {tButton('viewDetail')}
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
                      {t('empty')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
