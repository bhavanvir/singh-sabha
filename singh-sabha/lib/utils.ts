import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function kebabToTitleCase(
  input: string | undefined,
): string | undefined {
  if (input) {
    return input
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
}

// From https://coolors.co/palettes/trending
export const typeColourMap: Record<string, string> = {
  "akhand-path": "#cdb4db",
  wedding: "#ffc8dd",
  funeral: "#ffafcc",
  langar: "#bde0fe",
  "sehaj-path": "#a2d2ff",
};
