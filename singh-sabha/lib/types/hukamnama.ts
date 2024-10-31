export interface HukamnamaRoot {
  date: Date;
  hukamnamainfo: Hukamnamainfo;
  hukamnama: Hukamnama[];
  error: boolean;
}

export interface Date {
  gregorian: Gregorian;
  nanakshahi: Nanakshahi;
}

export interface Gregorian {
  month: string;
  monthno: number;
  date: number;
  year: number;
  day: string;
}

export interface Nanakshahi {
  english: English;
  punjabi: Punjabi;
}

export interface English {
  month: string;
  monthno: number;
  date: number;
  year: number;
  day: string;
}

export interface Punjabi {
  month: string;
  monthno: string;
  date: string;
  year: string;
  day: string;
}

export interface Hukamnamainfo {
  shabadid: string[];
  pageno: number;
  source: Source;
  writer: Writer;
  raag: Raag;
  count: number;
}

export interface Source {
  id: number;
  akhar: string;
  unicode: string;
  english: string;
  length: number;
  pageName: PageName;
}

export interface PageName {
  akhar: string;
  unicode: string;
  english: string;
}

export interface Writer {
  id: number;
  akhar: string;
  unicode: string;
  english: string;
}

export interface Raag {
  id: number;
  akhar: string;
  unicode: string;
  english: string;
  startang: number;
  endang: number;
  raagwithpage: string;
}

export interface Hukamnama {
  line: Line;
}

export interface Line {
  id: string;
  type: number;
  gurmukhi: Gurmukhi;
  larivaar: Larivaar;
  translation: Translation;
  transliteration: Transliteration;
  linenum: number;
  firstletters: Firstletters;
}

export interface Gurmukhi {
  akhar: string;
  unicode: string;
}

export interface Larivaar {
  akhar: string;
  unicode: string;
}

export interface Translation {
  english: English2;
  punjabi: Punjabi2;
  spanish: string;
}

export interface English2 {
  default: string;
}

export interface Punjabi2 {
  default: Default;
}

export interface Default {
  akhar: string;
  unicode: string;
}

export interface Transliteration {
  english: English3;
  devanagari: Devanagari;
}

export interface English3 {
  text: string;
  larivaar: string;
}

export interface Devanagari {
  text: string;
  larivaar: string;
}

export interface Firstletters {
  akhar: string;
  unicode: string;
}
