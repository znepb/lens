export interface Tag {
  id: number;
  name: string;
  textColor: string;
  backgroundColor: string;
  emoji: string;
  pictures: number[];
}

export interface Location {
  id: number;
  name: string;
  flag: string;
  cover: string;
  pictures: number[];
}

export interface Picture {
  id: number;
  filepath: string;
  place: string;
  taken: string;
  location: number;
  tags: number[];
  primaryTag: number;
  width: number;
  height: number;
}

export interface Patch {
  version: number[];
  suffix?: string;
  date: string;
  time: string;
  notes: string[];
}
