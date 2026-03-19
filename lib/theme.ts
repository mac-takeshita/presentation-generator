import type PptxGenJS from "pptxgenjs";

// ── Colors ──────────────────────────────────────────────
// MACNICA テンプレート「タネA_white_conf無」準拠カラースキーム
export const C = {
  primary: "7F1084",       // MACNICA パープル（accent1）
  primaryLight: "AE6CB0",  // ライトパープル（accent2）
  accent: "FBAE40",        // オレンジゴールド（レイアウトアクセント）
  accentLight: "CEA7D0",   // ペールパープル（accent3）

  white: "FFFFFF",
  offWhite: "FAFAFA",
  warmBg: "FFFFFF",        // テンプレートは白背景
  lightGray: "E0E0E0",
  midGray: "A0A0A0",      // lt2
  darkGray: "494949",     // dk1 — メインテキスト色
  text: "494949",          // dk1 — テンプレートのテキスト色
  black: "000000",

  // step colors — テンプレートのアクセントカラーを活用
  step1: "7F1084",  // パープル（accent1）
  step2: "3B1E87",  // インディゴ（accent4）
  step3: "547EBF",  // ブルー（レイアウトで使用）
  step4: "FBAE40",  // オレンジゴールド
  step5: "E60012",  // レッド（accent6）
  step6: "AE6CB0",  // ライトパープル（accent2）
  step7: "494949",  // ダークグレー（dk1）

  // card backgrounds — パープル系パステル
  cardBlue: "EDE7F6",     // パープル系ライト
  cardGreen: "F3E5F5",    // ペールパープル
  cardOrange: "FFF3E0",   // ウォームライト
  cardPurple: "F3E5F5",   // パープル 50
  cardCyan: "EDE7F6",     // パープル系ライト

  // chart — テンプレートのアクセントカラー
  chartBlue: "547EBF",
  chartGreen: "AE6CB0",
  chartOrange: "FBAE40",

  // MACNICA テンプレート追加色
  indigo: "3B1E87",       // accent4
  yellow: "FFDA2A",       // accent5
  red: "E60012",          // accent6
  magenta: "B60081",      // ハイパーリンク色
  blue: "547EBF",         // レイアウトブルー
} as const;

// ── Fonts ───────────────────────────────────────────────
// MACNICA テンプレートは游ゴシック / 游ゴシック Light を使用
export const FONT_JP = "Yu Gothic";
export const FONT_EN = "Yu Gothic";
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
// MACNICA テンプレート p5（05_タイトルとコンテンツ）準拠
export const MARGIN = {
  left: 0.64,
  right: 0.62,
  top: 0.60,
  titleY: 0.60,
  contentY: 1.28,
  footerY: 6.91,     // フッター開始位置（ロゴ等）
} as const;

export const CONTENT_W = SLIDE_W - MARGIN.left - MARGIN.right; // ≈ 12.07"
export const CONTENT_H = MARGIN.footerY - MARGIN.contentY;     // ≈ 5.63"

// ── Line styles ─────────────────────────────────────────
export const LINE_THIN: PptxGenJS.ShapeLineProps = { color: C.midGray, width: 0.5 };
