/**
 * Step detail slides — one per step, each featuring a large screenshot.
 * Text content (title, note, screenshot) comes from slides.yaml.
 * Layout data (annotations, image dimensions) stays here.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import type { Pres } from "../lib/types";
import { C, FONT, FS, MARGIN, CONTENT_W, SLIDE_W } from "../lib/theme";
import { addContentSlide } from "../lib/helpers";
import { getSlide } from "../lib/slides-data";

// ── Image loaders ───────────────────────────────────────
const SCREENSHOT_DIR = resolve(import.meta.dir, "../../screenshots");
const ASSETS_DIR = resolve(import.meta.dir, "../assets");

function loadImage(filepath: string): string {
  const buf = readFileSync(filepath);
  const ext = filepath.endsWith(".png") ? "png" : "jpeg";
  return `image/${ext};base64,${buf.toString("base64")}`;
}

function loadScreenshot(filename: string): string {
  return loadImage(resolve(SCREENSHOT_DIR, filename));
}

function loadAsset(filename: string): string {
  return loadImage(resolve(ASSETS_DIR, filename));
}

// ── Layout-only data (stays in TS) ──────────────────────
interface ArrowAnnotation {
  x: number;
  y: number;
  rotate?: number;
}

interface TextAnnotation {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
}

interface RectAnnotation {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ImageOverlay {
  asset: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface StepLayout {
  color: string;
  imgH?: number;
  imgW?: number;
  imgY?: number;
  arrows?: ArrowAnnotation[];
  textAnnotations?: TextAnnotation[];
  overlayImages?: ImageOverlay[];
  rectAnnotations?: RectAnnotation[];
}

const ARROW_W = 0.45;
const ARROW_H = 0.38;
const ARROW_COLOR = "FF0000";

const STEP_LAYOUTS: StepLayout[] = [
  { color: C.step1, imgH: 3.35 },
  {
    color: C.step2, imgH: 3.80, imgY: 1.79,
    overlayImages: [
      { asset: "copyright-site-header.png", x: 2.03, y: 1.48, w: 1.19, h: 0.36 },
      { asset: "copyright-cc-banner.png", x: 2.03, y: 5.68, w: 9.27, h: 0.79 },
    ],
    rectAnnotations: [
      { x: 2.03, y: 5.68, w: 9.27, h: 0.79 },
    ],
  },
  {
    color: C.step3, imgW: 8.28, imgH: 5.24,
    arrows: [{ x: 4.82, y: 5.45, rotate: 270 }],
  },
  {
    color: C.step4, imgW: 9.22, imgH: 5.19,
    arrows: [
      { x: 4.31, y: 3.75, rotate: 180 },
      { x: 4.31, y: 4.05, rotate: 180 },
      { x: 11.27, y: 2.16, rotate: 180 },
      { x: 11.27, y: 2.98, rotate: 180 },
      { x: 11.27, y: 3.41, rotate: 180 },
    ],
  },
  {
    color: C.step5, imgW: 9.14, imgH: 5.22,
    arrows: [
      { x: 7.21, y: 5.01, rotate: 180 },
      { x: 9.36, y: 3.14, rotate: 180 },
    ],
    textAnnotations: [
      { text: "必ず出典を記載してください。", x: 3.84, y: 5.14, w: 1.94, h: 0.25, fontSize: 9 },
    ],
  },
  { color: C.step6 },
  { color: C.step7 },
];

// ── Slide builder ────────────────────────────────────────
export function buildStepDetailSlides(pres: Pres) {
  for (let i = 0; i < 7; i++) {
    const content = getSlide(`step-${i + 1}`);
    const layout = STEP_LAYOUTS[i]!;

    const slide = addContentSlide(pres, `Step ${i + 1}：${content.title}`);
    if (content.narration) slide.addNotes((content.narration as string).trim());

    // Screenshot dimensions — default 16:9 full frame; per-step overrides
    const defaultH = 5.2;
    const defaultW = defaultH * (16 / 9);
    const imgH = layout.imgH ?? defaultH;
    const imgW = layout.imgW ?? defaultW;
    const imgX = (SLIDE_W - imgW) / 2;
    const frameY = 1.35;
    const imgY = layout.imgY ?? frameY + (defaultH - imgH) / 2;

    // Shadow frame behind screenshot (always full-size)
    slide.addShape(pres.ShapeType.rect, {
      x: imgX - 0.06, y: frameY - 0.06,
      w: imgW + 0.12, h: defaultH + 0.12,
      fill: { color: C.white },
      line: { color: C.midGray, width: 0.5 },
      shadow: {
        type: "outer", blur: 4, offset: 2,
        angle: 135, color: "000000", opacity: 0.15,
      },
    });

    // Screenshot image
    slide.addImage({
      data: loadScreenshot(content.screenshot as string),
      x: imgX, y: imgY, w: imgW, h: imgH,
    });

    // Note text below shadow frame
    slide.addText(content.note as string, {
      x: MARGIN.left, y: frameY + defaultH + 0.15,
      w: CONTENT_W, h: 0.45,
      fontSize: FS.small, fontFace: FONT, color: C.darkGray,
      align: "center", valign: "middle",
    });

    // Overlay images (e.g. CC banner)
    if (layout.overlayImages) {
      for (const img of layout.overlayImages) {
        slide.addImage({
          data: loadAsset(img.asset),
          x: img.x, y: img.y, w: img.w, h: img.h,
        });
      }
    }

    // Red arrow annotations
    if (layout.arrows) {
      for (const arrow of layout.arrows) {
        slide.addShape("rightArrow" as any, {
          x: arrow.x, y: arrow.y, w: ARROW_W, h: ARROW_H,
          fill: { color: ARROW_COLOR },
          line: { color: ARROW_COLOR },
          rotate: arrow.rotate ?? 0,
        });
      }
    }

    // Red rectangle annotations (frame only, no fill)
    if (layout.rectAnnotations) {
      for (const rect of layout.rectAnnotations) {
        slide.addShape(pres.ShapeType.rect, {
          x: rect.x, y: rect.y, w: rect.w, h: rect.h,
          fill: { type: "none" as any },
          line: { color: ARROW_COLOR, width: 6 },
        });
      }
    }

    // Text annotations
    if (layout.textAnnotations) {
      for (const ann of layout.textAnnotations) {
        slide.addText(ann.text, {
          x: ann.x, y: ann.y, w: ann.w, h: ann.h,
          fontSize: ann.fontSize, fontFace: FONT, color: ARROW_COLOR,
          bold: true, align: "left", valign: "middle",
        });
      }
    }
  }
}
