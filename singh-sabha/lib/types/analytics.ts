export interface Analytics {
  EventsOverTime?:
    | {
        date: string;
        count: number;
      }[]
    | undefined;
}
