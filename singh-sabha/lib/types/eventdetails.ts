export const EventColors = {
  regular: "#3b82f6",
  special: "#a855f7",
} as const;

export type EventDetails = {
  colour: string;
  displayName: string;
  isRequestable: boolean;
  isSpecial: boolean;
};

export const typeEventMap: Record<string, EventDetails> = {
  // Regular events
  "akhand-path": {
    colour: EventColors.regular,
    displayName: "Akhand Path",
    isRequestable: true,
    isSpecial: false,
  },
  "anand-karaj": {
    colour: EventColors.regular,
    displayName: "Anand Karaj",
    isRequestable: true,
    isSpecial: false,
  },
  funeral: {
    colour: EventColors.regular,
    displayName: "Funeral",
    isRequestable: true,
    isSpecial: false,
  },
  langar: {
    colour: EventColors.regular,
    displayName: "Langar",
    isRequestable: true,
    isSpecial: false,
  },
  "sehaj-path": {
    colour: EventColors.regular,
    displayName: "Sehaj Path",
    isRequestable: true,
    isSpecial: false,
  },
  "sukhmani-sahib-path": {
    colour: EventColors.regular,
    displayName: "Sukhmani Sahib Path",
    isRequestable: true,
    isSpecial: false,
  },
  "rainsabai-kirtan": {
    colour: EventColors.regular,
    displayName: "Rainsabai Kirtan",
    isRequestable: false,
    isSpecial: false,
  },
  gurpurab: {
    colour: EventColors.regular,
    displayName: "Gurpurab",
    isRequestable: false,
    isSpecial: false,
  },
  "shaheedi-diwas": {
    colour: EventColors.regular,
    displayName: "Shaheedi Diwas",
    isRequestable: false,
    isSpecial: false,
  },
  // Special events
  "new-years": {
    colour: EventColors.special,
    displayName: "New Years",
    isRequestable: false,
    isSpecial: true,
  },
  baisakhi: {
    colour: EventColors.special,
    displayName: "Baisakhi",
    isRequestable: false,
    isSpecial: true,
  },
  "bandi-chhor-divas": {
    colour: EventColors.special,
    displayName: "Bandi Chhor Divas",
    isRequestable: false,
    isSpecial: true,
  },
  "nagar-kirtan": {
    colour: EventColors.special,
    displayName: "Nagar Kirtan",
    isRequestable: false,
    isSpecial: true,
  },
};
