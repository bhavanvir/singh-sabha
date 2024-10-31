export type EventDetails = {
  colour: string;
  displayName: string;
  isRequestable: boolean;
  isSpecial: boolean;
};

export const typeEventMap: Record<string, EventDetails> = {
  // Regular events
  "akhand-path": {
    colour: "hsl(0, 100%, 70%)",
    displayName: "Akhand Path",
    isRequestable: true,
    isSpecial: false,
  },
  "anand-karaj": {
    colour: "hsl(20, 100%, 70%)",
    displayName: "Anand Karaj",
    isRequestable: true,
    isSpecial: false,
  },
  funeral: {
    colour: "hsl(40, 100%, 70%)",
    displayName: "Funeral",
    isRequestable: true,
    isSpecial: false,
  },
  langar: {
    colour: "hsl(60, 100%, 70%)",
    displayName: "Langar",
    isRequestable: true,
    isSpecial: false,
  },
  "sehaj-path": {
    colour: "hsl(80, 100%, 70%)",
    displayName: "Sehaj Path",
    isRequestable: true,
    isSpecial: false,
  },
  "sukhmani-sahib-path": {
    colour: "hsl(100, 100%, 70%)",
    displayName: "Sukhmani Sahib Path",
    isRequestable: true,
    isSpecial: false,
  },
  "rainsabai-kirtan": {
    colour: "hsl(120, 100%, 70%)",
    displayName: "Rainsabai Kirtan",
    isRequestable: false,
    isSpecial: false,
  },
  gurpurab: {
    colour: "hsl(140, 100%, 70%)",
    displayName: "Gurpurab",
    isRequestable: false,
    isSpecial: false,
  },
  "shaheedi-diwas": {
    colour: "hsl(160, 100%, 70%)",
    displayName: "Shaheedi Diwas",
    isRequestable: false,
    isSpecial: false,
  },
  // Special events
  "new-years": {
    colour: "hsl(180, 100%, 70%)",
    displayName: "New Years",
    isRequestable: false,
    isSpecial: true,
  },
  baisakhi: {
    colour: "hsl(200, 100%, 70%)",
    displayName: "Baisakhi",
    isRequestable: false,
    isSpecial: true,
  },
  "bandi-chhor-divas": {
    colour: "hsl(220, 100%, 70%)",
    displayName: "Bandi Chhor Divas",
    isRequestable: false,
    isSpecial: true,
  },
  "nagar-kirtan": {
    colour: "hsl(240, 100%, 70%)",
    displayName: "Nagar Kirtan",
    isRequestable: false,
    isSpecial: true,
  },
};
