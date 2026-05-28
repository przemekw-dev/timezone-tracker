// components/login-page.tsx
"use client";

import { useState } from "react";

interface LoginPageProps {
  onLogin: (password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Small delay for better UX
    setTimeout(() => {
      onLogin(password);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 mb-4">
            <span className="text-3xl">🌍</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
            Horizon
          </h1>
          <p className="text-slate-400 text-sm mt-1">Global timezone tracker</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Access Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                placeholder="Enter password to continue"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <span>Continue →</span>
              )}
            </button>

            {/* <div className="text-center">
              <p className="text-[10px] text-slate-500">
                Demo password:{" "}
                <span className="font-mono text-emerald-400">Ch3ckT!m3</span>
              </p>
            </div> */}
          </form>
        </div>

        {/* Footer */}
        {/* <p className="text-center text-[10px] text-slate-600 mt-6">
          Secure access · Session saved locally
        </p> */}
      </div>
    </div>
  );
}
