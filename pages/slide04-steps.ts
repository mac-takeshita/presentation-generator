import type { Pres } from "../lib/types";
import { C, FONT, FS, MARGIN, CONTENT_W, SLIDE_W } from "../lib/theme";
import { addContentSlide } from "../lib/helpers";
import { addIcon, ICONS } from "../lib/icons";
import { getSlide } from "../lib/slides-data";

const STEP_ICONS = [
  ICONS.magnify, ICONS.shieldCheck, ICONS.cloudUpload, ICONS.fileDocument,
  ICONS.messageText, ICONS.cog, ICONS.check,
];
const STEP_COLORS = [C.step1, C.step2, C.step3, C.step4, C.step5, C.step6, C.step7];

export function buildSlide04(pres: Pres) {
  const d = getSlide("steps-overview");
  const stepLabels = d.steps as string[];

  const slide = addContentSlide(pres, d.title);
  if (d.narration) slide.addNotes((d.narration as string).trim());

  slide.addText(d.subtitle as string, {
    x: MARGIN.left, y: 1.25, w: CONTENT_W, h: 0.5,
    fontSize: FS.heading, fontFace: FONT, color: C.primary,
    bold: true, align: "center", valign: "middle",
  });

  const stepW = 1.55;
  const stepH = 3.8;
  const gap = 0.15;
  const totalW = stepW * 7 + gap * 6;
  const startX = (SLIDE_W - totalW) / 2;
  const startY = 2.1;

  stepLabels.forEach((label, i) => {
    const x = startX + i * (stepW + gap);
    const color = STEP_COLORS[i]!;

    // Background rectangle
    slide.addShape(pres.ShapeType.rect, {
      x, y: startY, w: stepW, h: stepH,
      fill: { color: C.offWhite },
      line: { color, width: 1.5 },
      rectRadius: 0.08,
    });

    // Step number circle
    slide.addShape(pres.ShapeType.ellipse, {
      x: x + stepW / 2 - 0.3, y: startY + 0.3, w: 0.6, h: 0.6,
      fill: { color },
    });
    slide.addText(`${i + 1}`, {
      x: x + stepW / 2 - 0.3, y: startY + 0.3, w: 0.6, h: 0.6,
      fontSize: FS.heading, fontFace: FONT, color: C.white,
      bold: true, align: "center", valign: "middle",
    });

    // Icon
    addIcon(slide, STEP_ICONS[i]!, x + stepW / 2 - 0.3, startY + 1.15, 0.6, color);

    // Label
    slide.addText(label, {
      x: x + 0.08, y: startY + 2.0, w: stepW - 0.16, h: 1.5,
      fontSize: FS.micro, fontFace: FONT, color: C.text,
      align: "center", valign: "top", wrap: true,
      lineSpacing: 22,
    });

    // Arrow between steps
    if (i < stepLabels.length - 1) {
      addIcon(slide, ICONS.arrowRight,
        x + stepW + gap / 2 - 0.15, startY + stepH / 2 - 0.15, 0.3, C.darkGray);
    }
  });

  // Bottom note
  slide.addText(d.note as string, {
    x: MARGIN.left, y: 6.3, w: CONTENT_W, h: 0.5,
    fontSize: FS.small, fontFace: FONT, color: C.darkGray,
    align: "center", valign: "middle",
  });
}
