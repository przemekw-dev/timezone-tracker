// components/person-card.tsx
"use client";

import { PersonWithTime } from "@/lib/types";

interface PersonCardProps {
  person: PersonWithTime;
}

export function PersonCard({ person }: PersonCardProps) {
  const statusConfig = {
    awake: {
      label: "AWAKE",
      icon: "🌞",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      indicator: "bg-emerald-400",
    },
    waking: {
      label: "WAKING",
      icon: "🌅",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      indicator: "bg-amber-400",
    },
    asleep: {
      label: "ASLEEP",
      icon: "🌙",
      color: "text-slate-400",
      bg: "bg-slate-100/10",
      border: "border-slate-500/20",
      indicator: "bg-slate-500",
    },
  };

  const config = statusConfig[person.status];
  const tzAbbr = person.timezone.split("/").pop() || "";

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border ${config.border} hover:bg-white/[0.05] transition-all duration-200`}
    >
      <div className={`w-0.5 h-8 rounded-full ${config.indicator}`} />

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${config.bg} border ${config.border}`}
      >
        {person.name.charAt(0)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-md font-semibold text-white truncate">
            {person.name}
          </span>
          <span className="text-xs text-slate-600 font-mono">{tzAbbr}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-base font-mono font-bold text-white tracking-tight">
            {person.formattedTime}
          </span>
          <span className="text-xs text-slate-500">{person.formattedDate}</span>
          <span className="text-xs text-slate-600">{person.location}</span>
        </div>
      </div>

      <div
        className={`flex flex-col items-end gap-0.5 px-1.5 py-2 w-20 rounded-md ${config.bg}`}
      >
        <div className="flex items-center gap-0.5">
          <span className="text-xs">{config.icon}</span>
          <span className={`text-xs font-bold tracking-wide ${config.color}`}>
            {config.label}
          </span>
        </div>
        {person.status === "waking" && person.minutesUntilWake && (
          <div className="w-6 h-0.5 bg-slate-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{
                width: `${Math.min(100, (person.minutesUntilWake / 120) * 100)}%`,
              }}
            />
          </div>
        )}
        {/* {person.status === "asleep" && (
          <span className="text-[6px] text-slate-500">💤</span>
        )} */}
        {/* {person.status === "awake" && (
          <span className="text-[6px] text-emerald-500/70">⚡</span>
        )} */}
      </div>
    </div>
  );
}
