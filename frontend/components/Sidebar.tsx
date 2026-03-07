"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, CalendarCheck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Attendance", href: "/attendance", icon: CalendarCheck },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("hrms_auth");
        router.replace("/login");
    };

    return (
        <div className="flex h-full w-64 flex-col bg-zinc-950 text-white shadow-xl">
            <div className="flex h-16 items-center px-6">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black">
                        HR
                    </div>
                    HRMS Lite
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    isActive
                                        ? "bg-indigo-600/10 text-indigo-400"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                                    "group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        isActive ? "text-indigo-400" : "text-zinc-400 group-hover:text-white",
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Admin</p>
                        <p className="text-xs text-zinc-500 truncate">Administrator</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                    <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    Logout
                </button>
            </div>
        </div>
    );
}
