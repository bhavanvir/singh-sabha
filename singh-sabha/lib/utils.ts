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

// From https://coolors.co/palette/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1
export const typeColourMap: Record<string, string> = {
  "akhand-path": "#f94144",
  "anand-karaj": "#f3722c",
  funeral: "#f8961e",
  langar: "#f9844a",
  "sehaj-path": "#f9c74f",
  "sukhmani-sahib-path": "#90be6d",
  "rainsabai-kirtan": "#43aa8b",
};
