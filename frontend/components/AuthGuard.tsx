"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

const PUBLIC_PATHS = ["/login"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    const isPublic = PUBLIC_PATHS.includes(pathname);

    useEffect(() => {
        const isAuth = localStorage.getItem("hrms_auth") === "true";
        if (!isAuth && !isPublic) {
            router.replace("/login");
        } else {
            setChecked(true);
        }
    }, [pathname, router, isPublic]);

    if (!checked) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Login page — full screen, no sidebar
    if (isPublic) {
        return <>{children}</>;
    }

    // Protected pages — sidebar layout
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto w-full transition-all">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
