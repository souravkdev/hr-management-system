"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && localStorage.getItem("hrms_auth") === "true") {
            router.replace("/");
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                localStorage.setItem("hrms_auth", "true");
                router.replace("/");
            } else {
                setError("Invalid username or password.");
                setShake(true);
                setTimeout(() => setShake(false), 600);
            }
            setLoading(false);
        }, 400);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            {/* Glow blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div
                    className={`bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl p-8 transition-all duration-150 ${shake ? "animate-shake" : ""}`}
                >
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-600/30 mb-4">
                            HR
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">HRMS Lite</h1>
                        <p className="text-zinc-400 text-sm mt-1">Sign in to your admin account</p>
                    </div>

                    {/* Hint */}
                    {/* <div className="flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl px-4 py-3 mb-6">
                        <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <p className="text-xs text-indigo-300">
                            Default credentials: <span className="font-semibold text-indigo-200">admin / admin123</span>
                        </p>
                    </div> */}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                                required
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-3 pr-12 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm text-center font-medium bg-red-500/10 border border-red-500/20 rounded-xl py-2.5 px-4">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 mt-2 text-sm"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    15% { transform: translateX(-8px); }
                    30% { transform: translateX(8px); }
                    45% { transform: translateX(-6px); }
                    60% { transform: translateX(6px); }
                    75% { transform: translateX(-3px); }
                    90% { transform: translateX(3px); }
                }
                .animate-shake { animation: shake 0.6s ease-in-out; }
            `}</style>
        </div>
    );
}
