type EventDetails = {
  color: string;
  isRequestable: boolean;
  isSpecial: boolean;
  isRecurring: boolean;
};

// From https://coolors.co/palette/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1
export const typeEventMap: Record<string, EventDetails> = {
  "akhand-path": {
    color: "#f94144",
    isRequestable: true,
    isSpecial: false,
    isRecurring: false,
  },
  "anand-karaj": {
    color: "#f3722c",
    isRequestable: true,
    isSpecial: false,
    isRecurring: false,
  },
  funeral: {
    color: "#f8961e",
    isRequestable: true,
    isSpecial: false,
    isRecurring: false,
  },
  langar: {
    color: "#f9844a",
    isRequestable: true,
    isSpecial: false,
    isRecurring: true,
  },
  "sehaj-path": {
    color: "#f9c74f",
    isRequestable: false,
    isSpecial: false,
    isRecurring: true,
  },
  "sukhmani-sahib-path": {
    color: "#90be6d",
    isRequestable: false,
    isSpecial: false,
    isRecurring: true,
  },
  "rainsabai-kirtan": {
    color: "#43aa8b",
    isRequestable: false,
    isSpecial: false,
    isRecurring: false,
  },
  gurpurab: {
    color: "#4d908e",
    isRequestable: false,
    isSpecial: false,
    isRecurring: true,
  },
  "shaheedi-diwas": {
    color: "#577590",
    isRequestable: false,
    isSpecial: false,
    isRecurring: true,
  },
};
