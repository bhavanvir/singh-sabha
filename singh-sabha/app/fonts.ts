import { Inter } from "next/font/google";
import { Noto_Sans_Gurmukhi } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], display: "swap" });
export const notoSansGurmukhi = Noto_Sans_Gurmukhi({
  subsets: ["gurmukhi"],
  display: "swap",
});
