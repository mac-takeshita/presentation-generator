import path from "path";
import type PptxGenJS from "pptxgenjs";
import type { Pres, Slide, TextProps } from "./types";
import {
  C, FONT, FONT_EN, FS, SLIDE_W, SLIDE_H,
  MARGIN, CONTENT_W, LINE_THIN,
} from "./theme";

// ═══════════════════════════════════════════════════════════
// Slide creation helpers
// ═══════════════════════════════════════════════════════════

/**
 * コンテンツスライド — MACNICA テンプレート p5 準拠
 *
 * 構成:
 *   - 背景画像（白地＋右端パープルグラデーションライン）
 *   - タイトル（左寄せ、27pt 太字）
 *   - MACNICA ロゴ（左下）
 *   - コピーライト（左下ロゴ右隣）
 */
export function addContentSlide(pres: Pres, title: string): Slide {
  const slide = pres.addSlide();

  // ── 背景画像（テンプレート image6.jpg） ──
  slide.addImage({
    path: path.resolve("assets/macnica-content-bg.jpg"),
    x: 0, y: 0, w: SLIDE_W, h: SLIDE_H,
  });

  // ── タイトル（左寄せ、27pt 太字） ──
  slide.addText(title, {
    x: MARGIN.left, y: MARGIN.titleY, w: 12.05, h: 0.49,
    fontSize: 27, fontFace: FONT, color: C.text,
    bold: true, align: "left", valign: "middle",
  });

  // ── MACNICA ロゴ（左下） ──
  slide.addImage({
    path: path.resolve("assets/macnica-logo.png"),
    x: 0.21, y: MARGIN.footerY, w: 1.49, h: 0.46,
  });

  // ── コピーライト（ロゴ右隣、10pt） ──
  slide.addText("\u00A9Macnica,Inc.", {
    x: 1.73, y: 7.11, w: 1.6, h: 0.27,
    fontSize: 10, fontFace: FONT, color: C.text,
    align: "left", valign: "middle",
  });

  // ── ページ番号（右下） ──
  slide.slideNumber = {
    x: 12.82, y: 7.17, w: 0.45, h: 0.17,
    fontSize: 10, fontFace: FONT, color: C.text,
    align: "center",
  };

  return slide;
}

/** Create a title slide with decorative circles. */
export function addTitleSlide(
  pres: Pres,
  mainTitle: string,
  subtitle: string,
  presenterInfo: string,
): Slide {
  const slide = pres.addSlide();

  // Base background
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_W, h: SLIDE_H,
    fill: { color: C.primary },
  });

  // Lighter overlay
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: SLIDE_W, h: SLIDE_H,
    fill: { color: C.primaryLight, transparency: 50 },
  });

  // Decorative circles for playful feel
  slide.addShape(pres.ShapeType.ellipse, {
    x: -1.5, y: -1.5, w: 4.5, h: 4.5,
    fill: { color: C.white, transparency: 90 },
  });
  slide.addShape(pres.ShapeType.ellipse, {
    x: 10.5, y: 4.5, w: 5, h: 5,
    fill: { color: C.accentLight, transparency: 82 },
  });
  slide.addShape(pres.ShapeType.ellipse, {
    x: 11.5, y: -2.5, w: 3.5, h: 3.5,
    fill: { color: C.white, transparency: 92 },
  });

  // Accent bar at bottom
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: SLIDE_H - 0.15, w: SLIDE_W, h: 0.15,
    fill: { color: C.accent },
  });

  slide.addText(mainTitle, {
    x: 1.0, y: 1.0, w: 11.3, h: 2.6,
    fontSize: 48, fontFace: FONT, color: C.white,
    bold: true, align: "center", valign: "middle", wrap: true,
    lineSpacing: 60,
  });
  slide.addText(subtitle, {
    x: 1.0, y: 3.8, w: 11.3, h: 1.0,
    fontSize: FS.sectionSub, fontFace: FONT, color: C.accentLight,
    align: "center", valign: "middle", wrap: true,
  });
  slide.addText(presenterInfo, {
    x: 1.0, y: 5.4, w: 11.3, h: 1.2,
    fontSize: FS.body, fontFace: FONT, color: C.white,
    align: "center", valign: "middle", wrap: true,
    lineSpacing: 28,
  });
  return slide;
}

// ═══════════════════════════════════════════════════════════
// Drawing primitives
// ═══════════════════════════════════════════════════════════

/** Rounded-corner text box. */
export function addBox(
  slide: Slide,
  x: number, y: number, w: number, h: number,
  text: string | TextProps[],
  opts: Partial<PptxGenJS.TextPropsOptions> = {},
) {
  slide.addText(text, {
    x, y, w, h,
    fontSize: FS.body, fontFace: FONT, color: C.text,
    align: "center", valign: "middle",
    fill: { color: C.white },
    line: LINE_THIN,
    margin: [4, 8, 4, 8],
    wrap: true,
    rectRadius: 0.05,
    ...opts,
  });
}

/** Card with colored top band. */
export function addCard(
  slide: Slide,
  x: number, y: number, w: number, h: number,
  title: string,
  body: string | TextProps[],
  bandColor: string,
  opts: Partial<PptxGenJS.TextPropsOptions> = {},
) {
  const bandH = 0.42;
  slide.addShape("rect" as any, {
    x, y, w, h: bandH,
    fill: { color: bandColor },
    rectRadius: 0.05,
  });
  slide.addText(title, {
    x, y, w, h: bandH,
    fontSize: FS.small, fontFace: FONT, color: C.white,
    bold: true, align: "center", valign: "middle",
  });
  addBox(slide, x, y + bandH, w, h - bandH, body, {
    align: "left", valign: "top",
    margin: [8, 10, 8, 10],
    fontSize: FS.small,
    ...opts,
  });
}

// ═══════════════════════════════════════════════════════════
// Layout helpers
// ═══════════════════════════════════════════════════════════

/** Two-column layout. */
export function twoColLayout(gap = 0.5) {
  const colW = (CONTENT_W - gap) / 2;
  return {
    leftX: MARGIN.left,
    rightX: MARGIN.left + colW + gap,
    colW,
  };
}

/** Three-column layout. */
export function threeColLayout(gap = 0.4) {
  const colW = (CONTENT_W - gap * 2) / 3;
  return {
    xs: [
      MARGIN.left,
      MARGIN.left + colW + gap,
      MARGIN.left + (colW + gap) * 2,
    ],
    colW,
  };
}

/** Accent banner (full-width colored strip with text). */
export function addBanner(
  slide: Slide,
  y: number, h: number,
  text: string,
  bgColor: string = C.primary,
  textColor: string = C.white,
  fontSize: number = FS.body,
) {
  slide.addText(text, {
    x: 0, y, w: SLIDE_W, h,
    fontSize, fontFace: FONT, color: textColor,
    bold: true, align: "center", valign: "middle",
    fill: { color: bgColor },
  });
}
