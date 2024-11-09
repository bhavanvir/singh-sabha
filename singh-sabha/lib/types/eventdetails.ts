export type EventDetails = {
  colour: string;
  displayName: string;
  isRequestable: boolean;
  isSpecial: boolean;
};

export const typeEventMap: Record<string, EventDetails> = {
  // Regular events
  "akhand-path": {
    colour: "#3b82f6",
    displayName: "Akhand Path",
    isRequestable: true,
    isSpecial: false,
  },
  "anand-karaj": {
    colour: "#3b82f6",
    displayName: "Anand Karaj",
    isRequestable: true,
    isSpecial: false,
  },
  funeral: {
    colour: "#3b82f6",
    displayName: "Funeral",
    isRequestable: true,
    isSpecial: false,
  },
  langar: {
    colour: "#3b82f6",
    displayName: "Langar",
    isRequestable: true,
    isSpecial: false,
  },
  "sehaj-path": {
    colour: "#3b82f6",
    displayName: "Sehaj Path",
    isRequestable: true,
    isSpecial: false,
  },
  "sukhmani-sahib-path": {
    colour: "#3b82f6",
    displayName: "Sukhmani Sahib Path",
    isRequestable: true,
    isSpecial: false,
  },
  "rainsabai-kirtan": {
    colour: "#3b82f6",
    displayName: "Rainsabai Kirtan",
    isRequestable: false,
    isSpecial: false,
  },
  gurpurab: {
    colour: "#3b82f6",
    displayName: "Gurpurab",
    isRequestable: false,
    isSpecial: false,
  },
  "shaheedi-diwas": {
    colour: "#3b82f6",
    displayName: "Shaheedi Diwas",
    isRequestable: false,
    isSpecial: false,
  },
  // Special events
  "new-years": {
    colour: "#a855f7",
    displayName: "New Years",
    isRequestable: false,
    isSpecial: true,
  },
  baisakhi: {
    colour: "#a855f7",
    displayName: "Baisakhi",
    isRequestable: false,
    isSpecial: true,
  },
  "bandi-chhor-divas": {
    colour: "#a855f7",
    displayName: "Bandi Chhor Divas",
    isRequestable: false,
    isSpecial: true,
  },
  "nagar-kirtan": {
    colour: "#a855f7",
    displayName: "Nagar Kirtan",
    isRequestable: false,
    isSpecial: true,
  },
};
