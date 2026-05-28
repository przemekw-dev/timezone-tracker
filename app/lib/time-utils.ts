// lib/time-utils.ts
import { DateTime } from "luxon";
import { StatusType } from "./types";

export function getStatus(hour: number, minute: number = 0): StatusType {
  // Convert to decimal hours for precise comparison
  const decimalHour = hour + minute / 60;

  // CUSTOM TIME RANGES:
  // Awake: 8:30 AM (8.5) - 12:00 AM (24:00)
  if (decimalHour >= 8.5 && decimalHour < 24) return "awake";

  // Waking: 7:00 AM (7.0) - 8:29 AM (8.49)
  if (decimalHour >= 7.0 && decimalHour < 8.5) return "waking";

  // Asleep: 12:00 AM (0) - 6:59 AM (6.99)
  return "asleep";
}

export function getCurrentTimeData(timezone: string, now: Date = new Date()) {
  let dt = DateTime.fromJSDate(now).setZone(timezone);
  if (!dt.isValid) {
    dt = DateTime.fromJSDate(now).setZone("UTC");
  }

  const hour = dt.hour;
  const minute = dt.minute;
  const status = getStatus(hour, minute);

  let minutesUntilWake: number | undefined;
  if (status === "waking") {
    // Waking period ends at 8:30 AM (8.5 hours)
    const wakeEndHour = 8.5;
    const currentDecimal = hour + minute / 60;
    if (currentDecimal < wakeEndHour) {
      const hoursDiff = wakeEndHour - currentDecimal;
      minutesUntilWake = Math.round(hoursDiff * 60);
    }
  }

  // Also calculate minutes until waking for asleep people (optional)
  let minutesUntilWakingPeriod: number | undefined;
  if (status === "asleep") {
    // Waking period starts at 7:00 AM
    const wakingStartHour = 7.0;
    let currentDecimal = hour + minute / 60;

    // If it's after midnight but before 7 AM, calculate until 7 AM
    if (currentDecimal < wakingStartHour) {
      const hoursDiff = wakingStartHour - currentDecimal;
      minutesUntilWakingPeriod = Math.round(hoursDiff * 60);
    }
  }

  return {
    hour,
    minute,
    status,
    formattedTime: dt.toFormat("HH:mm"),
    formattedDate: dt.toFormat("MMM d"),
    minutesUntilWake:
      minutesUntilWake && minutesUntilWake > 0 ? minutesUntilWake : undefined,
    minutesUntilWakingPeriod,
  };
}
