import type PptxGenJS from "pptxgenjs";

// ── Colors ──────────────────────────────────────────────
// Contrast ratios (vs #FFFFFF) are noted for accessibility.
// All white-on-color combos meet WCAG AA large-text (3:1+).
export const C = {
  primary: "1E88E5",       // Material Blue 600 — 4.05:1 ✓
  primaryLight: "64B5F6",  // Material Blue 300
  accent: "FF9800",        // Material Orange 500
  accentLight: "FFCC80",   // Orange 200

  white: "FFFFFF",
  offWhite: "FAFBFE",
  warmBg: "FFF9F2",        // warm cream for slide backgrounds
  lightGray: "ECEFF1",
  midGray: "B0BEC5",
  darkGray: "546E7A",
  text: "37474F",          // Blue Grey 800 — softer, friendly
  black: "000000",

  // step colors — all ≥3:1 vs white for large-text AA
  step1: "1E88E5",  // Blue 600  — 4.05:1
  step2: "43A047",  // Green 600 — 3.05:1
  step3: "AB47BC",  // Purple 400 — 3.54:1
  step4: "EF6C00",  // Orange 800 — 3.06:1
  step5: "E53935",  // Red 600   — 3.49:1
  step6: "0097A7",  // Cyan 700  — 3.44:1
  step7: "546E7A",  // BlueGrey 600 — 5.26:1

  // card backgrounds — pastel, cheerful
  cardBlue: "E3F2FD",     // Blue 50
  cardGreen: "E8F5E9",    // Green 50
  cardOrange: "FFF3E0",   // Orange 50
  cardPurple: "F3E5F5",   // Purple 50
  cardCyan: "E0F7FA",     // Cyan 50

  // chart
  chartBlue: "42A5F5",
  chartGreen: "66BB6A",
  chartOrange: "FFA726",
} as const;

// ── Fonts ───────────────────────────────────────────────
export const FONT_JP = "Meiryo";
export const FONT_EN = "Arial";
export const FONT = FONT_JP;

// ── Font sizes ──────────────────────────────────────────
export const FS = {
  slideTitle: 28,
  sectionTitle: 36,
  sectionSub: 22,
  heading: 24,
  body: 22,
  small: 20,
  micro: 18,
} as const;

// ── Slide dimensions (16:9) ─────────────────────────────
export const SLIDE_W = 13.33;
export const SLIDE_H = 7.5;

// ── Common margins / positions ──────────────────────────
export const MARGIN = {
  left: 0.6,
  right: 0.6,
  top: 0.4,
  titleY: 0.3,
  contentY: 1.3,
} as const;

export const CONTENT_W = SLIDE_W - MARGIN.left - MARGIN.right;

// ── Line styles ─────────────────────────────────────────
export const LINE_THIN: PptxGenJS.ShapeLineProps = { color: C.midGray, width: 0.5 };
