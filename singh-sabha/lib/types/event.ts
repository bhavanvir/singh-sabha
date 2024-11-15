import type { EventType } from "@/lib/types/eventtype";

export type Event = {
  id?: string;
  registrantFullName?: string | null;
  registrantEmail?: string | null;
  registrantPhoneNumber?: string | null;
  type: string;
  start: Date;
  end: Date;
  allDay: boolean;
  title: string;
  note?: string | null;
  verified: boolean;
  frequencyRule?: string;
  isPublic: boolean;
  eventType?: EventType;
};
