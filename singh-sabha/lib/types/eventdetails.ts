export type EventDetails = {
  colour: string;
  displayName: string;
  isRequestable: boolean;
  isSpecial: boolean;
};

export const typeEventMap: Record<string, EventDetails> = {
  // Regular events
  "akhand-path": {
    colour: "#1a2e05",
    displayName: "Akhand Path",
    isRequestable: true,
    isSpecial: false,
  },
  "anand-karaj": {
    colour: "#365314",
    displayName: "Anand Karaj",
    isRequestable: true,
    isSpecial: false,
  },
  funeral: {
    colour: "#3f6212",
    displayName: "Funeral",
    isRequestable: true,
    isSpecial: false,
  },
  langar: {
    colour: "#4d7c0f",
    displayName: "Langar",
    isRequestable: true,
    isSpecial: false,
  },
  "sehaj-path": {
    colour: "#65a30d",
    displayName: "Sehaj Path",
    isRequestable: true,
    isSpecial: false,
  },
  "sukhmani-sahib-path": {
    colour: "#84cc16",
    displayName: "Sukhmani Sahib Path",
    isRequestable: true,
    isSpecial: false,
  },
  "rainsabai-kirtan": {
    colour: "#a3e635",
    displayName: "Rainsabai Kirtan",
    isRequestable: false,
    isSpecial: false,
  },
  gurpurab: {
    colour: "#bef264",
    displayName: "Gurpurab",
    isRequestable: false,
    isSpecial: false,
  },
  "shaheedi-diwas": {
    colour: "#d9f99d",
    displayName: "Shaheedi Diwas",
    isRequestable: false,
    isSpecial: false,
  },
  // Special events
  "new-years": {
    colour: "#1e1b4b",
    displayName: "New Years",
    isRequestable: false,
    isSpecial: true,
  },
  baisakhi: {
    colour: "#312e81",
    displayName: "Baisakhi",
    isRequestable: false,
    isSpecial: true,
  },
  "bandi-chhor-divas": {
    colour: "#3730a3",
    displayName: "Bandi Chhor Divas",
    isRequestable: false,
    isSpecial: true,
  },
  "nagar-kirtan": {
    colour: "#4338ca",
    displayName: "Nagar Kirtan",
    isRequestable: false,
    isSpecial: true,
  },
};
