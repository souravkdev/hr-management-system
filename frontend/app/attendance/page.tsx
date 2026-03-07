"use client";

import { useState, useEffect, useCallback } from "react";
import { format, parseISO } from "date-fns";
import {
    CheckCircle2,
    XCircle,
    Calendar,
    Users,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MinusCircle,
} from "lucide-react";
import { getEmployees, getAttendanceByDate, markAttendance } from "@/lib/api";
import { Employee, Attendance } from "@/types";

export default function AttendancePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendanceMap, setAttendanceMap] = useState<Record<number, Attendance>>({});
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [isLoading, setIsLoading] = useState(true);
    const [markingId, setMarkingId] = useState<number | null>(null);

    // Fetch employees once
    useEffect(() => {
        getEmployees()
            .then(setEmployees)
            .catch((e) => console.error("Failed to fetch employees", e));
    }, []);

    // Fetch attendance for the selected date
    const fetchAttendance = useCallback(async () => {
        setIsLoading(true);
        try {
            const records = await getAttendanceByDate(selectedDate);
            const map: Record<number, Attendance> = {};
            records.forEach((r) => {
                map[r.employee_id] = r;
            });
            setAttendanceMap(map);
        } catch (e) {
            console.error("Failed to fetch attendance by date", e);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    const handleMark = async (employeeId: number, status: "Present" | "Absent") => {
        setMarkingId(employeeId);
        try {
            const record = await markAttendance({ employee_id: employeeId, date: selectedDate, status });
            setAttendanceMap((prev) => ({ ...prev, [employeeId]: record }));
        } catch (e) {
            console.error("Failed to mark attendance", e);
        } finally {
            setMarkingId(null);
        }
    };

    const shiftDate = (days: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + days);
        setSelectedDate(format(d, "yyyy-MM-dd"));
    };

    const presentCount = Object.values(attendanceMap).filter((r) => r.status === "Present").length;
    const absentCount = Object.values(attendanceMap).filter((r) => r.status === "Absent").length;
    const unmarkedCount = employees.length - presentCount - absentCount;

    const formattedDate = selectedDate
        ? format(parseISO(selectedDate), "EEEE, d MMMM yyyy")
        : "";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-950">Attendance Tracking</h1>
                <p className="text-sm text-zinc-500 mt-1">Mark and review daily employee attendance.</p>
            </div>

            {/* Date Filter Bar */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => shiftDate(-1)}
                        className="p-2 rounded-xl hover:bg-zinc-100 transition-colors text-zinc-600"
                        title="Previous day"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 font-medium text-sm"
                        />
                    </div>
                    <button
                        onClick={() => shiftDate(1)}
                        className="p-2 rounded-xl hover:bg-zinc-100 transition-colors text-zinc-600"
                        title="Next day"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-zinc-500 hidden sm:block">{formattedDate}</span>
                </div>

                {/* Summary Pills */}
                <div className="flex items-center gap-3 flex-wrap justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                        <Users className="w-3.5 h-3.5" />
                        {employees.length} Total
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {presentCount} Present
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                        <XCircle className="w-3.5 h-3.5" />
                        {absentCount} Absent
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <MinusCircle className="w-3.5 h-3.5" />
                        {unmarkedCount} Unmarked
                    </span>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50">
                    <h2 className="text-sm font-semibold text-zinc-700 uppercase tracking-wider">
                        Employee Attendance — {formattedDate}
                    </h2>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-16 text-zinc-400 gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading attendance...</span>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Users className="w-10 h-10 text-zinc-300 mb-3" />
                        <p className="font-medium text-zinc-700">No employees found</p>
                        <p className="text-zinc-400 text-sm mt-1">Add employees first to mark attendance.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-100">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-8">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">Mark Attendance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {employees.map((emp, index) => {
                                    const record = attendanceMap[emp.id];
                                    const isMarking = markingId === emp.id;
                                    return (
                                        <tr key={emp.id} className="hover:bg-zinc-50/50 transition-colors">
                                            <td className="px-6 py-4 text-zinc-400 text-xs font-medium">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
                                                        {emp.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-zinc-900">{emp.full_name}</p>
                                                        <p className="text-xs text-zinc-400">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
                                                    {emp.department}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {record ? (
                                                    record.status === "Present" ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Present
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            Absent
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                        <MinusCircle className="w-3.5 h-3.5" />
                                                        Unmarked
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {isMarking ? (
                                                        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleMark(emp.id, "Present")}
                                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border
                                                                    ${record?.status === "Present"
                                                                        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                                                                        : "bg-white text-zinc-600 border-zinc-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                                                                    }`}
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                Present
                                                            </button>
                                                            <button
                                                                onClick={() => handleMark(emp.id, "Absent")}
                                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border
                                                                    ${record?.status === "Absent"
                                                                        ? "bg-red-500 text-white border-red-500 shadow-sm"
                                                                        : "bg-white text-zinc-600 border-zinc-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                                                                    }`}
                                                            >
                                                                <XCircle className="w-3.5 h-3.5" />
                                                                Absent
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
