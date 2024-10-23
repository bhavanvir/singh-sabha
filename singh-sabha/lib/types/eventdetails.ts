export type EventDetails = {
  colour: string;
  displayName: string;
  isRequestable: boolean;
  isSpecial: boolean;
  isRecurring: boolean;
};

// From https://coolors.co/palette/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1
export const typeEventMap: Record<string, EventDetails> = {
  "akhand-path": {
    colour: "#f94144",
    displayName: "Akhand Path",
    isRequestable: true,
    isSpecial: false,
    isRecurring: false,
  },
  "anand-karaj": {
    colour: "#f3722c",
    displayName: "Anand Karaj",
    isRequestable: true,
    isSpecial: false,
    isRecurring: false,
  },
  funeral: {
    colour: "#f8961e",
    displayName: "Funeral",
    isRequestable: true,
    isSpecial: false,
    isRecurring: false,
  },
  langar: {
    colour: "#f9844a",
    displayName: "Langar",
    isRequestable: true,
    isSpecial: false,
    isRecurring: true,
  },
  "sehaj-path": {
    colour: "#f9c74f",
    displayName: "Sehaj Path",
    isRequestable: true,
    isSpecial: false,
    isRecurring: true,
  },
  "sukhmani-sahib-path": {
    colour: "#90be6d",
    displayName: "Sukhmani Sahib Path",
    isRequestable: true,
    isSpecial: false,
    isRecurring: true,
  },
  "rainsabai-kirtan": {
    colour: "#43aa8b",
    displayName: "Rainsabai Kirtan",
    isRequestable: false,
    isSpecial: false,
    isRecurring: false,
  },
  gurpurab: {
    colour: "#4d908e",
    displayName: "Gurpurab",
    isRequestable: false,
    isSpecial: false,
    isRecurring: true,
  },
  "shaheedi-diwas": {
    colour: "#577590",
    displayName: "Shaheedi Diwas",
    isRequestable: false,
    isSpecial: false,
    isRecurring: true,
  },
};
