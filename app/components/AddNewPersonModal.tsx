import { X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

const TIMEZONES = [
  {
    label: "🇺🇸 United States",
    options: [
      {
        location: "New York",
        timezone: "America/New_York",
        label: "Eastern (New York)",
      },
      {
        location: "Chicago",
        timezone: "America/Chicago",
        label: "Central (Chicago)",
      },
      {
        location: "Denver",
        timezone: "America/Denver",
        label: "Mountain (Denver)",
      },
      {
        location: "Los Angeles",
        timezone: "America/Los_Angeles",
        label: "Pacific (Los Angeles)",
      },
    ],
  },
  {
    label: "🇪🇺 Europe",
    options: [
      {
        location: "London",
        timezone: "Europe/London",
        label: "London",
      },
      {
        location: "Paris",
        timezone: "Europe/Paris",
        label: "Paris / Berlin",
      },
      {
        location: "Warsaw",
        timezone: "Europe/Warsaw",
        label: "Warsaw",
      },
    ],
  },
  // {
  //   label: "🇯🇵 Japan",
  //   options: [
  //     {
  //       location: "Tokyo",
  //       timezone: "Asia/Tokyo",
  //       label: "Tokyo",
  //     },
  //   ],
  // },
  {
    label: "🇯🇵 Asia",
    options: [
      {
        location: "Tokyo",
        timezone: "Asia/Tokyo",
        label: "Tokyo",
      },
      {
        location: "Seoul",
        timezone: "Asia/Seoul",
        label: "Seoul",
      },
    ],
  },
  {
    label: "🇦🇪 Middle East",
    options: [
      {
        location: "Dubai",
        timezone: "Asia/Dubai",
        label: "Dubai",
      },
    ],
  },
];

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave?: (person: {
    name: string;
    location: string;
    timezone: string;
    wakingTime: string;
    sleepingTime: string;
  }) => void;
};

const AddNewPersonModal = ({ isOpen, setIsOpen, onSave }: Props) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("");
  const [wakingTime, setWakingTime] = useState("");
  const [sleepingTime, setSleepingTime] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setTimezone("");
    setWakingTime("");
    setSleepingTime("");
  };

  // autofocus
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // escape to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // auto timezone from location (simple fallback)
  // useEffect(() => {
  //   if (!location) return;

  //   try {
  //     const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  //     setTimezone(tz);
  //   } catch {
  //     setTimezone("");
  //   }
  // }, [location]);

  const awakeDuration = useMemo(() => {
    if (!wakingTime || !sleepingTime) return null;

    const [wh, wm] = wakingTime.split(":").map(Number);
    const [sh, sm] = sleepingTime.split(":").map(Number);

    let start = wh * 60 + wm;
    let end = sh * 60 + sm;

    if (end <= start) end += 24 * 60;

    const diff = end - start;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    return `${hours}h ${mins}m`;
  }, [wakingTime, sleepingTime]);

  const canSave = name.trim() && location.trim() && wakingTime && sleepingTime;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSave) return;

    onSave?.({
      name,
      location,
      timezone,
      wakingTime,
      sleepingTime,
    });

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/50 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-100">
            Add new person
          </h2>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs text-slate-400">Name</label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div>

          {/* Location */}
          {/* <div>
            <label className="text-xs text-slate-400">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="London / Warsaw / New York"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div> */}

          <div>
            <label className="text-xs text-slate-400">Timezone</label>

            <select
              value={`${location}|${timezone}`}
              onChange={(e) => {
                const [loc, tz] = e.target.value.split("|");
                setLocation(loc);
                setTimezone(tz);
              }}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-slate-500 focus:outline-none"
            >
              <option value="">Select a timezone...</option>

              {TIMEZONES.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option
                      key={option.timezone}
                      value={`${option.location}|${option.timezone}`}
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {timezone && (
              <p className="mt-2 text-xs text-slate-500">
                {location} • {timezone}
              </p>
            )}
          </div>

          {/* Timezone */}
          <div>
            <label className="text-xs text-slate-400">Timezone</label>
            <input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="Europe/London"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
            />
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400">Wake</label>
              <input
                type="time"
                value={wakingTime}
                onClick={(e) => e.currentTarget.showPicker()}
                onChange={(e) => setWakingTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Sleep</label>
              <input
                type="time"
                value={sleepingTime}
                onClick={(e) => e.currentTarget.showPicker()}
                onChange={(e) => setSleepingTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Awake summary */}
          {/* <div className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3">
            <p className="text-xs text-slate-400">Awake time</p>
            <p className="mt-1 text-sm font-medium text-slate-100">
              {awakeDuration ?? "--"}

              <label className="text-xs text-slate-400">Awake</label>
              <input
                type="time"
                value={wakingTime}
                onClick={(e) => e.currentTarget.showPicker()}
                onChange={(e) => setWakingTime(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-700 bg-red-800 px-3 py-2 text-sm text-slate-100 focus:border-slate-500 focus:outline-none"
              />
            </p>
          </div> */}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSave}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewPersonModal;
