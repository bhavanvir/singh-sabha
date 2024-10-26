export type EventDetails = {
  colour: string;
  displayName: string;
  isRequestable: boolean;
  isSpecial: boolean;
};

// Use this function to generate a pastel HSL colour
function getBackgroundColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return `hsl(${hash % 360}, 100%, 75%)`;
}

export const typeEventMap: Record<string, EventDetails> = {
  // Regular events
  "akhand-path": {
    colour: "hsl(-340, 100%, 75%)",
    displayName: "Akhand Path",
    isRequestable: true,
    isSpecial: false,
  },
  "anand-karaj": {
    colour: "hsl(343, 100%, 75%)",
    displayName: "Anand Karaj",
    isRequestable: true,
    isSpecial: false,
  },
  funeral: {
    colour: "hsl(207, 100%, 75%)",
    displayName: "Funeral",
    isRequestable: true,
    isSpecial: false,
  },
  langar: {
    colour: "hsl(-289, 100%, 75%)",
    displayName: "Langar",
    isRequestable: true,
    isSpecial: false,
  },
  "sehaj-path": {
    colour: "hsl(-98, 100%, 75%)",
    displayName: "Sehaj Path",
    isRequestable: true,
    isSpecial: false,
  },
  "sukhmani-sahib-path": {
    colour: "hsl(-76, 100%, 75%)",
    displayName: "Sukhmani Sahib Path",
    isRequestable: true,
    isSpecial: false,
  },
  "rainsabai-kirtan": {
    colour: "hsl(-123, 100%, 75%)",
    displayName: "Rainsabai Kirtan",
    isRequestable: false,
    isSpecial: false,
  },
  gurpurab: {
    colour: "hsl(-150, 100%, 75%)",
    displayName: "Gurpurab",
    isRequestable: false,
    isSpecial: false,
  },
  "shaheedi-diwas": {
    colour: "hsl(-51, 100%, 75%)",
    displayName: "Shaheedi Diwas",
    isRequestable: false,
    isSpecial: false,
  },
  // Special events
  "new-years": {
    colour: "hsl(-210, 100%, 75%)",
    displayName: "New Years",
    isRequestable: false,
    isSpecial: true,
  },
  baisakhi: {
    colour: "hsl(-68, 100%, 75%)",
    displayName: "Baisakhi",
    isRequestable: false,
    isSpecial: true,
  },
  "bandi-chhor-divas": {
    colour: "hsl(213, 100%, 75%)",
    displayName: "Bandi Chhor Divas",
    isRequestable: false,
    isSpecial: true,
  },
  "nagar-kirtan": {
    colour: "hsl(-128, 100%, 75%)",
    displayName: "Nagar Kirtan",
    isRequestable: false,
    isSpecial: true,
  },
};
