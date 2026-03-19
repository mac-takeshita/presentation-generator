import path from "path";
import type { Pres } from "../lib/types";
import { C, FONT, SLIDE_W, SLIDE_H } from "../lib/theme";
import { getSlide } from "../lib/slides-data";

/**
 * タイトルスライド — MACNICA テンプレート「タネA_white_conf無」準拠レイアウト
 *
 * 構成:
 *   - 背景画像（左側パープルグラデーション＋大円、右側白）
 *   - タイトル（右寄り中央）
 *   - 日付
 *   - 所属・発表者情報（右寄り中央）
 *   - MACNICA ロゴ（右下）
 *   - コピーライト（右下端）
 */
export function buildSlide01(pres: Pres) {
  const d = getSlide("title");
  const slide = pres.addSlide();

  // ── 背景画像（テンプレート image1.jpg） ──
  slide.addImage({
    path: path.resolve("assets/macnica-title-bg.jpg"),
    x: 0, y: 0, w: SLIDE_W, h: SLIDE_H,
  });

  // ── メインタイトル（右寄り中央、31pt 太字） ──
  slide.addText(d.title, {
    x: 5.96, y: 1.18, w: 6.88, h: 2.08,
    fontSize: 31, fontFace: FONT, color: C.text,
    bold: true, align: "center", valign: "middle",
    wrap: true, lineSpacing: 42,
  });

  // ── 日付（タイトルと所属情報の間） ──
  slide.addText(new Date().toLocaleDateString("ja-JP"), {
    x: 8.69, y: 3.84, w: 1.44, h: 0.25,
    fontSize: 15, fontFace: FONT, color: C.text,
    align: "center", valign: "middle",
  });

  // ── 所属・発表者情報（右寄り中央、14pt） ──
  slide.addText(d.presenter as string, {
    x: 6.96, y: 4.18, w: 4.93, h: 1.24,
    fontSize: 14, fontFace: FONT, color: C.text,
    align: "center", valign: "middle",
    wrap: true, lineSpacing: 22,
  });

  // ── MACNICA ロゴ（右下） ──
  slide.addImage({
    path: path.resolve("assets/macnica-logo.png"),
    x: 8.17, y: 6.07, w: 2.54, h: 0.79,
  });

  // ── コピーライト（右下端、10pt） ──
  slide.addText("\u00A9Macnica,Inc.", {
    x: 8.5, y: 7.11, w: 1.8, h: 0.27,
    fontSize: 10, fontFace: FONT, color: C.text,
    align: "center", valign: "middle",
  });

  if (d.narration) slide.addNotes((d.narration as string).trim());
}
