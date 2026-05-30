// components/people-tracker.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { PersonCard } from "./person-card";
import { RealWorldMap } from "./real-world-map";
import { Person, PersonWithTime } from "@/lib/types";
import { getCurrentTimeData } from "@/lib/time-utils";
import { DateTime } from "luxon";

interface PeopleTrackerProps {
  people: Person[];
}

export function PeopleTracker({ people }: PeopleTrackerProps) {
  const [timeData, setTimeData] = useState<Map<string, PersonWithTime>>(
    new Map(),
  );
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"all" | "awake" | "waking" | "asleep">(
    "all",
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updateTimes = () => {
      const now = new Date();
      setCurrentTime(now);
      const newMap = new Map<string, PersonWithTime>();
      people.forEach((person) => {
        const timeInfo = getCurrentTimeData(person.timezone, now);
        newMap.set(person.id, {
          ...person,
          ...timeInfo,
        });
      });
      setTimeData(newMap);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [people, isClient]);

  // Sort chronologically based on ACTUAL date and time (ascending)
  // const peopleWithTimes = useMemo(() => {
  //   const list = Array.from(timeData.values());
  //   return list.sort((a, b) => {
  //     // Get the actual timestamp for each person's local date and time
  //     // We need to compare the full date-time, not just hour/minute

  //     // Get current UTC time
  //     const nowUTC = DateTime.now();

  //     // Get each person's local datetime as a comparable timestamp
  //     // We need to know WHAT DAY it is for them locally
  //     const aDateTime = DateTime.now().setZone(a.timezone);
  //     const bDateTime = DateTime.now().setZone(b.timezone);

  //     // Compare the full timestamps (this takes day, hour, minute, second into account)
  //     const aTimestamp = aDateTime.toMillis();
  //     console.log("Atimestamp: ", aTimestamp);
  //     const bTimestamp = bDateTime.toMillis();
  //     console.log("Btimestamp: ", bTimestamp);

  //     console.log("Equal ? :", aTimestamp === bTimestamp);

  //     return aTimestamp - bTimestamp;
  //   });
  // }, [timeData]);

  const peopleWithTimes = useMemo(() => {
    return Array.from(timeData.values()).sort((a, b) => {
      const aDt = DateTime.now().setZone(a.timezone);
      const bDt = DateTime.now().setZone(b.timezone);

      const aValue = aDt.ordinal * 1440 + aDt.hour * 60 + aDt.minute;

      const bValue = bDt.ordinal * 1440 + bDt.hour * 60 + bDt.minute;

      return aValue - bValue;
    });
  }, [timeData]);

  // Alternative: Sort by UTC offset then time
  // This shows people in order of where the sun rises first
  const peopleBySunrise = useMemo(() => {
    const list = Array.from(timeData.values());
    return list.sort((a, b) => {
      // Get UTC offset for each timezone
      const aOffset = DateTime.now().setZone(a.timezone).offset;
      const bOffset = DateTime.now().setZone(b.timezone).offset;

      // Sort by offset (most negative/earliest first)
      if (aOffset !== bOffset) {
        return aOffset - bOffset;
      }

      // If same offset, sort by time
      if (a.hour !== b.hour) return a.hour - b.hour;
      return a.minute - b.minute;
    });
  }, [timeData]);

  // Filtered list
  const filteredPeople = useMemo(() => {
    if (filter === "all") return peopleWithTimes;
    return peopleWithTimes.filter((p) => p.status === filter);
  }, [peopleWithTimes, filter]);

  const counts = {
    awake: peopleWithTimes.filter((p) => p.status === "awake").length,
    waking: peopleWithTimes.filter((p) => p.status === "waking").length,
    asleep: peopleWithTimes.filter((p) => p.status === "asleep").length,
  };

  if (!isClient) {
    return (
      <div className="w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-3 py-3 md:py-4">
        <div className="flex items-center justify-between mb-3 pb-1">
          <div>
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              Horizon
            </h1>
            <p className="text-[9px] text-slate-500 mt-0">
              global timezone tracker
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full border border-white/10">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span className="text-[9px] font-mono text-slate-300">
              --:--:--
            </span>
          </div>
        </div>
        <div className="mb-4 h-[340px] bg-slate-900/50 rounded-xl animate-pulse" />
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          <div className="h-12 bg-white/5 rounded-full" />
          <div className="h-12 bg-white/5 rounded-full" />
          <div className="h-12 bg-white/5 rounded-full" />
          <div className="h-12 bg-white/5 rounded-full" />
        </div>
        <div className="space-y-1.5">
          {people.map((p) => (
            <div
              key={p.id}
              className="h-14 bg-white/5 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto px-3 py-3 md:py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-1">
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
            Horizon
          </h1>
          <p className="text-[9px] text-slate-500 mt-0">
            global timezone tracker
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700/40 w-38 bg-linear-to-br from-slate-700/40 via-slate-400/20 to-slate-800/40">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full mx-1 animate-pulse" />
          <span className="text-md font-mono text-slate-300">
            {currentTime?.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Real World Map */}
      <div className="mb-3">
        <RealWorldMap people={peopleWithTimes} />
      </div>

      {/* Status Filters */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        <button
          onClick={() => setFilter("all")}
          className={`py-2 rounded-full text-[10px] font-medium transition-all ${
            filter === "all"
              ? "bg-white/15 text-white border border-white/20"
              : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
          }`}
        >
          All
          <br />
          <span className="text-[13px] font-bold">
            {peopleWithTimes.length}
          </span>
        </button>
        <button
          onClick={() => setFilter("awake")}
          className={`py-2 rounded-full text-[10px] font-medium transition-all ${
            filter === "awake"
              ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
              : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
          }`}
        >
          <span className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Awake
          </span>
          <span className="text-[13px] font-bold block">{counts.awake}</span>
        </button>
        <button
          onClick={() => setFilter("waking")}
          className={`py-2 rounded-full text-[10px] font-medium transition-all ${
            filter === "waking"
              ? "bg-amber-500/30 text-amber-300 border border-amber-500/30"
              : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
          }`}
        >
          <span className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Rising
          </span>
          <span className="text-[13px] font-bold block">{counts.waking}</span>
        </button>
        <button
          onClick={() => setFilter("asleep")}
          className={`py-2 rounded-full text-[10px] font-medium transition-all ${
            filter === "asleep"
              ? "bg-slate-500/30 text-slate-300 border border-slate-500/30"
              : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"
          }`}
        >
          <span className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Asleep
          </span>
          <span className="text-[13px] font-bold block">{counts.asleep}</span>
        </button>
      </div>

      {/* People List - Chronologically Sorted by Local Date & Time */}
      {/* <div className="mb-2 text-[10px] text-slate-500 flex justify-between items-center">
        <span>📅 Chronological order (earliest local time first)</span>
        <span className="text-[8px]">🌍 UTC offset</span>
      </div> */}
      <div className="space-y-1.5">
        {filteredPeople.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>

      {/* Footer */}
      {/* <div className="mt-4 pt-2 text-center text-[8px] text-slate-600 border-t border-white/5">
        <span>📍 Sorted by actual local date & time</span>
        <span className="mx-2">·</span>
        <span>⚡ Real-time updates every second</span>
        <span className="mx-2">·</span>
        <span>🕐 Times shown in local 24h format</span>
      </div> */}
    </div>
  );
}
