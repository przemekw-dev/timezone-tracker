// components/login-pin.tsx (alternative PIN-based login)
"use client";

import { useState, useEffect, useRef } from "react";

interface LoginPinProps {
  onLogin: () => void;
}

export function LoginPin({ onLogin }: LoginPinProps) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const correctPin = "1234"; // Change this to your desired PIN

  useEffect(() => {
    if (pin.every((digit) => digit !== "")) {
      const enteredPin = pin.join("");
      if (enteredPin === correctPin) {
        localStorage.setItem("horizon_auth", "true");
        setTimeout(() => onLogin(), 300);
      } else {
        setError(true);
        setPin(["", "", "", ""]);
        inputRefs.current[0]?.focus();
        setTimeout(() => setError(false), 1000);
      }
    }
  }, [pin, onLogin]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError(false);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 mb-6">
          <span className="text-3xl">🔒</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Enter PIN</h1>
        <p className="text-slate-400 text-sm mb-8">
          4-digit code to access tracker
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-14 h-14 text-center text-2xl font-bold rounded-xl bg-slate-900/50 border ${
                error ? "border-red-500" : "border-white/10"
              } text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm">Incorrect PIN. Try again.</p>
        )}

        <p className="text-[10px] text-slate-500 mt-6">
          Demo PIN: <span className="font-mono text-emerald-400">1234</span>
        </p>
      </div>
    </div>
  );
}
