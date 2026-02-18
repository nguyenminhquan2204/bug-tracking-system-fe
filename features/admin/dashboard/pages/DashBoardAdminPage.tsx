/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Bug, Flame, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

// ===== Mock Data =====
const summaryData = {
  total: 128,
  todo: 45,
  doing: 32,
  pr_in_review: 38,
  done: 13,
};

const statusChartData = [
  { name: "Open", value: 45, color: "#ef4444" },
  { name: "In Progress", value: 32, color: "#f59e0b" },
  { name: "Resolved", value: 38, color: "#22c55e" },
  { name: "Closed", value: 13, color: "#3b82f6" },
];

const trendData = [
  { date: "Mon", created: 8, resolved: 5 },
  { date: "Tue", created: 12, resolved: 7 },
  { date: "Wed", created: 6, resolved: 9 },
  { date: "Thu", created: 10, resolved: 6 },
  { date: "Fri", created: 14, resolved: 11 },
];

const projectData = [
  { name: "Project A", open: 12 },
  { name: "Project B", open: 18 },
  { name: "Project C", open: 9 },
  { name: "Project D", open: 6 },
];

const recentActivity = [
  { id: 1, text: "Nguyen updated status from Open → In Progress" },
  { id: 2, text: "Linh assigned bug #42 to Minh" },
  { id: 3, text: "Huy resolved bug #35" },
];

export default function DashboardAdminPage() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Bug Tracking Dashboard
        </h1>
        <div className="flex gap-3">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="a">Project A</SelectItem>
              <SelectItem value="b">Project B</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90">
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard title="Total Bugs" value={summaryData.total} icon={<Bug size={18} />} color="from-blue-500 to-indigo-500" />
        <SummaryCard title="Todo" value={summaryData.todo} icon={<Flame size={18} />} color="from-red-500 to-pink-500" />
        <SummaryCard title="Doing" value={summaryData.doing} icon={<Loader2 size={18} />} color="from-yellow-500 to-orange-500" />
        <SummaryCard title="PR in review" value={summaryData.pr_in_review} icon={<CheckCircle2 size={18} />} color="from-green-500 to-emerald-500" />
        <SummaryCard title="Done" value={summaryData.done} icon={<AlertTriangle size={18} />} color="from-rose-500 to-red-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-red-500">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusChartData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {statusChartData.map((entry, index) => (
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
              <LineChart data={trendData}>
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

      {/* Project Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-indigo-500">Open Bugs by Project</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
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
            <CardTitle className="text-emerald-500">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                className="p-3 rounded-xl bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 shadow-sm"
              >
                {item.text}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, color }: any) {
  return (
    <div className="rounded-2xl shadow-lg border-0 overflow-hidden">
      <div className={`p-4 flex justify-between items-center bg-gradient-to-r ${color} text-white`}>
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="bg-white/20 p-2 rounded-full backdrop-blur">
          {icon}
        </div>
      </div>
    </div>
  );
}
