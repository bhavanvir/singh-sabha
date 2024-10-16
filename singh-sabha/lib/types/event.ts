export type Event = {
  registrantFullName?: string;
  registrantEmail?: string;
  registrantPhoneNumber?: string;
  type: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  title: string;
};
