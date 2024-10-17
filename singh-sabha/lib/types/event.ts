export type Event = {
  id?: string;
  registrantFullName?: string;
  registrantEmail?: string;
  registrantPhoneNumber?: string;
  type: string;
  start: Date;
  end: Date;
  allDay: boolean;
  title: string;
  note?: string;
};
