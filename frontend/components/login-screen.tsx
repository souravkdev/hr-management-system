"use client";

import { useState } from "react";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function LoginScreen() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [isShaking, setIsShaking] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || !password) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500); // Reset shaking after 500ms
            return;
        }
        // Proceed with authentication logic here
        console.log("Logged in:", { identifier, password });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-black relative">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>

            {/* Animated Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }}></div>

            {/* Login Card Container */}
            <div className="w-full max-w-md p-8 relative z-10">
                <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden">

                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome Back</h1>
                        <p className="text-zinc-400 text-sm">Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className={`space-y-4 transition-transform duration-75 ${isShaking ? "animate-custom-shake" : ""}`}>
                            {/* Identifier / Email Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className={`h-5 w-5 transition-colors duration-300 ${isShaking ? "text-red-500" : "text-zinc-500 group-focus-within:text-indigo-400"}`} />
                                </div>
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-zinc-900/50 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 ${isShaking
                                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                        : "border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                        }`}
                                    placeholder="name@company.com"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={`h-5 w-5 transition-colors duration-300 ${isShaking ? "text-red-500" : "text-zinc-500 group-focus-within:text-indigo-400"}`} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-zinc-900/50 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 ${isShaking
                                        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                                        : "border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Error Feedback */}
                        <div className={`flex items-center gap-2 text-sm text-red-400 overflow-hidden transition-all duration-300 ${isShaking ? "opacity-100 max-h-10 mt-2" : "opacity-0 max-h-0 m-0"}`}>
                            <AlertCircle className="w-4 h-4" />
                            <span>Please fill in all required fields</span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full relative group overflow-hidden bg-white hover:bg-zinc-200 text-black font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] mt-2"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                <span>Sign In</span>
                                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-button-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </button>

                        <div className="pt-6 text-center">
                            <a href="#" className="text-zinc-500 hover:text-white text-sm transition-colors duration-200">
                                Forgot your password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes custom-shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-custom-shake {
          animation: custom-shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes button-shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-button-shimmer {
          animation: button-shimmer 1.5s infinite;
        }
      `}} />
        </div>
    );
}
