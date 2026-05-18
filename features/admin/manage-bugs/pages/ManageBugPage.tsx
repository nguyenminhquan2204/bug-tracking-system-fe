/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TitleDescription from "@/features/components/TitleDescription";
import { useTranslations } from "next-intl";
import { HeaderBugSummary } from "../components/HeaderBugSummary";
import { BodyBugSummary } from "../components/BodyBugSummary";
import { FilterFormType, filterSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useManageBugStore } from "../stores/useManageBugStore";
import { useShallow } from "zustand/shallow";
import { useParams } from "next/navigation";
import { useManageProjectStore } from "../../manage-projects/stores/useManageProjectStore";
import { useEffect } from "react";

export default function ManageBugPage() {
  const t = useTranslations("Admin.ManageBug");
  const tButton = useTranslations("Button");
  const { projectList, getProjectList } = useManageProjectStore(useShallow((state) => ({
   projectList: state.projectList,
   getProjectList: state.getProjectList
  })))
  const { getSummaryBugHeader, getSummaryBugBody } = useManageBugStore(
    useShallow((state) => ({
      getSummaryBugHeader: state.getSummaryBugHeader,
      getSummaryBugBody: state.getSummaryBugBody
    })),
  );
  const form = useForm<FilterFormType>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      projectId: "",
      fromDate: "",
      toDate: "",
    },
  });

  const onSubmit = async (data: FilterFormType) => {
    if(!data) return;
    await Promise.all([
      getSummaryBugHeader(Number(data.projectId), data),
      getSummaryBugBody(Number(data.projectId), data),
    ]);
  };

  useEffect(() => {
   const fetchApi = async () => {
      await Promise.all([
         getProjectList()
      ])
   }
   fetchApi();
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <TitleDescription title={t("title")} description={t("description")} />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3 md:flex-row md:items-start"
            >
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="px-4 py-2">
                        <SelectTrigger className="h-11 rounded-2xl border-gray-200">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projectList && projectList.length > 0 && projectList.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="date"
                        {...field}
                        className="rounded-2xl border border-gray-200 px-4 py-2 text-sm outline-none transition focus:border-black"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center pt-2">
                <span className="text-sm text-gray-500">{tButton("to")}</span>
              </div>
              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="date"
                        {...field}
                        className="rounded-2xl border border-gray-200 px-4 py-2 text-sm outline-none transition focus:border-black"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="rounded-2xl bg-black px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {tButton("filter")}
              </Button>
            </form>
          </Form>
        </div>
        <HeaderBugSummary />
        <BodyBugSummary />
      </div>
    </div>
  );
}
