type EventDetails = {
  colour: string;
  isRequestable: boolean;
  isSpecial: boolean;
  isRecurring: boolean;
};

// From https://coolors.co/palette/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1
export const typeEventMap: Record<string, EventDetails> = {
  "akhand-path": {
    colour: "#f94144",
    isRequestable: true,
    isSpecial: false,
    isRecurring: false,
  },
  "anand-karaj": {
    colour: "#f3722c",
    isRequestable: true,
    isSpecial: false,
    isRecurring: false,
  },
  funeral: {
    colour: "#f8961e",
    isRequestable: true,
    isSpecial: false,
    isRecurring: false,
  },
  langar: {
    colour: "#f9844a",
    isRequestable: true,
    isSpecial: false,
    isRecurring: true,
  },
  "sehaj-path": {
    colour: "#f9c74f",
    isRequestable: false,
    isSpecial: false,
    isRecurring: true,
  },
  "sukhmani-sahib-path": {
    colour: "#90be6d",
    isRequestable: false,
    isSpecial: false,
    isRecurring: true,
  },
  "rainsabai-kirtan": {
    colour: "#43aa8b",
    isRequestable: false,
    isSpecial: false,
    isRecurring: false,
  },
  gurpurab: {
    colour: "#4d908e",
    isRequestable: false,
    isSpecial: false,
    isRecurring: true,
  },
  "shaheedi-diwas": {
    colour: "#577590",
    isRequestable: false,
    isSpecial: false,
    isRecurring: true,
  },
};
