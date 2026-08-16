export interface Chapter {
  id: string;
  label: string;
}

export interface Occasion {
  id: string;
  name: string;
  color: string;
  note: string;
  hero: string;
  heroAlt: string;
  detail: string;
  detailAlt: string;
  support: string;
  supportAlt: string;
}

export interface FittingStage {
  n: string;
  name: string;
  piece: string;
  duration: string;
  metric: string;
  metricLabel: string;
  note: string;
  cut: string;
  seam: string;
  stitch: string;
  mark: string;
}

export interface LoupePlate {
  n: string;
  name: string;
  src: string;
  alt: string;
  note: string;
}

export interface RailItem {
  src: string;
  alt: string;
  label: string;
}

export interface DiaryEntry {
  src: string;
  occasion: string;
  note: string;
  alt: string;
}

export interface StoreStatus {
  open: boolean;
  short: string;
  long: string;
}
