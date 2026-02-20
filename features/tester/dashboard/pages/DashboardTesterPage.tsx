/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Bug, Flame, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboardTesterStore } from "../stores/useDashboardTesterStore";
import { useShallow } from "zustand/shallow";
import { useEffect, useMemo, useState } from "react";
import { getRandomColor } from "@/packages/helpers";
import SummaryCard from "../../../components/SummaryCard";
import { useMyProjectStore } from "../../my-projects/stores/useMyProjectStore";

export default function DashboardTesterPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { getMyProjects, projectList } = useMyProjectStore(useShallow((state) => ({
    getMyProjects: state.getMyProjects,
    loading: state.loading,
    projectList: state.projectList
  })))
  const { getDashboard, loading, dashboardData } = useDashboardTesterStore(useShallow((state) => ({
    getDashboard: state.getDashboard,
    loading: state.loading,
    dashboardData: state.dashboardData
  })))
  const activeProjectId = selectedProjectId ?? projectList?.[0]?.id?.toString();

  useEffect(() => {
    getMyProjects();
  }, [])
  
  useEffect(() => {
    if (activeProjectId) {
      getDashboard(Number(activeProjectId));
    }
  }, [activeProjectId]);

  const fullStatus = dashboardData?.fullStatus ?? [];
  
    const statusWithColor = useMemo(() => {
      return fullStatus.map((item) => ({
        ...item,
        color: getRandomColor(),
      }));
    }, [fullStatus]);

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Bug Tracking Dashboard
        </h1>
        <div className="flex gap-3">
          <Select
            value={selectedProjectId || activeProjectId}
            onValueChange={(value) => {
              setSelectedProjectId(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projectList && projectList.length > 0 && projectList.map((item, index) => {
                return (
                  <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <Button onClick={() => getDashboard(Number(selectedProjectId))} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90">
            Refresh
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard title="Total Bugs" value={dashboardData?.summaryStatus?.TOTAL} icon={<Bug size={18} />} color="from-blue-500 to-indigo-500" />
        <SummaryCard title="Todo" value={dashboardData?.summaryStatus?.TODO} icon={<Flame size={18} />} color="from-red-500 to-pink-500" />
        <SummaryCard title="Doing" value={dashboardData?.summaryStatus?.DOING} icon={<Loader2 size={18} />} color="from-yellow-500 to-orange-500" />
        <SummaryCard title="PR in review" value={dashboardData?.summaryStatus?.PR_IN_REVIEW} icon={<CheckCircle2 size={18} />} color="from-green-500 to-emerald-500" />
        <SummaryCard title="Done in dev" value={dashboardData?.summaryStatus?.DONE_IN_DEV} icon={<AlertTriangle size={18} />} color="from-rose-500 to-red-600" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-red-500">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusWithColor} dataKey="value" nameKey="name" outerRadius={100} label>
                  {statusWithColor && statusWithColor.length > 0 && statusWithColor.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-blue-500">Bugs Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData?.trend7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="created" stroke="#ef4444" strokeWidth={3} />
                <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-indigo-500">Open Bugs by Project</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData?.top4ProjectByOpenBug}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={false} />
                <Bar dataKey="open" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-green-500">
              🔥 Top 3 Most Busy Developers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.top3UserWithOpenBugs && dashboardData.top3UserWithOpenBugs.length > 0 && dashboardData.top3UserWithOpenBugs.map((user, index) => (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.03 }}
                className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">#{index + 1}</span>
                  <span>{user.name}</span>
                </div>
                <div className="text-sm font-semibold text-emerald-500">
                  {user.open} bugs
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}