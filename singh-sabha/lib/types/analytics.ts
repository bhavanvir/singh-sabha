export interface Analytics {
  EventsOverTime?: {
    date: string;
    count: number;
  }[];
  BookingLeadTimes?: {
    leadTimeDays: number;
    count: number;
  }[];
}
