"use client";

import { useState, useEffect } from "react";
import { Users, CheckCircle2, XCircle, TrendingUp, CalendarDays } from "lucide-react";
import { getDashboardSummary } from "@/lib/api";
import { DashboardSummary } from "@/types";
import { format } from "date-fns";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const today = format(new Date(), 'EEEE, MMMM do, yyyy');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Overview Dashboard</h1>
          <p className="text-zinc-500 mt-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {today}
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-indigo-50 to-transparent pointer-events-none" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-zinc-100 rounded-2xl h-32 border border-zinc-200" />
          ))}
        </div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 text-indigo-50 opacity-50 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
              <Users className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">Total Employees</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-extrabold text-zinc-900">{summary.total_employees}</h3>
                <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 text-emerald-50 opacity-50 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
              <CheckCircle2 className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">Present Today</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-extrabold text-emerald-600">{summary.present_today}</h3>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 text-red-50 opacity-50 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
              <XCircle className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">Absent Today</p>
              <div className="flex items-baseline gap-3">
                <h3 className="text-4xl font-extrabold text-red-600">{summary.absent_today}</h3>
                {summary.absent_today > 0 && (
                  <span className="text-sm font-medium text-red-500">Requires review</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-zinc-500 font-medium">Failed to load dashboard data.</div>
      )}

      {/* Quick Actions / Getting Started */}
      <div className="bg-zinc-950 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 max-w-xl">
          <h2 className="text-2xl font-bold mb-3">Welcome to HRMS Lite</h2>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            Manage your employees efficiently. Start by adding an employee from the Employees tab, then navigate to Attendance to track their daily status.
          </p>
          <div className="flex gap-4">
            <a href="/employees" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100 transition-colors">
              Manage Employees
            </a>
            <a href="/attendance" className="inline-flex items-center justify-center rounded-xl bg-zinc-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 border border-zinc-700 transition-colors">
              Mark Attendance
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
