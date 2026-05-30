// app/page.tsx
"use client";

export const runtime = "edge";
export const preferredRegion = "auto";

import { useState, useEffect } from "react";
import { PeopleTracker } from "@/components/people-tracker";
import { people } from "@/lib/people-data";
import { LoginPage } from "@/components/login-page";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is logged in on client side
    const auth = localStorage.getItem("horizon_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (password: string) => {
    // Simple password check (you can change this)
    if (password === "Ch3ckT!m3") {
      localStorage.setItem("horizon_auth", "true");
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("horizon_auth");
    setIsAuthenticated(false);
  };

  // Show loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen max-w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* <div className="relative sm:fixed top-4 right-4 z-50"> */}
      {/* <button
          onClick={handleLogout}
          className="bg-white/5 hover:bg-white/10 text-slate-300 text-xs px-3 py-1.5 rounded-full border border-white/10 transition-all"
        >
          <i className="fas fa-sign-out-alt mr-1" /> Logout
        </button> */}
      {/* </div> */}
      <PeopleTracker people={people} />
    </main>
  );
}
