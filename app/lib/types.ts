// lib/types.ts
export type StatusType = "awake" | "asleep" | "waking";

export interface TimezoneData {
  hour: number;
  minute: number;
  status: StatusType;
  formattedTime: string;
  formattedDate: string;
  minutesUntilWake?: number;
}

export interface FamilyMember {
  name: string;
  timezone: string;
  location: string;
  region: "USA" | "Europe" | "Asia";
}

export interface Person {
  id: string;
  name: string;
  timezone: string;
  location: string;
  region: "USA" | "Europe" | "Asia";
}

export interface PersonWithTime extends Person {
  hour: number;
  minute: number;
  status: StatusType;
  formattedTime: string;
  formattedDate: string;
  minutesUntilWake?: number;
}
