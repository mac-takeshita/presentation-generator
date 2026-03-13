import type { Pres } from "../lib/types";
import { C, FONT, FONT_EN, FS, SLIDE_W, SLIDE_H, MARGIN, CONTENT_W } from "../lib/theme";
import { addContentSlide } from "../lib/helpers";
import { getUsedCitations } from "../lib/cite";

export function buildSlide08(pres: Pres) {
  const citations = getUsedCitations();
  if (citations.length === 0) return;

  const slide = addContentSlide(pres, "References");

  const refFs = 12;
  const titleBarH = 1.13; // title bar (1.05) + accent stripe (0.08)
  const startY = titleBarH + 0.1;
  const colGap = 0.3;
  const colW = (CONTENT_W - colGap) / 2;
  const colH = SLIDE_H - startY - 0.25;
  const mid = Math.ceil(citations.length / 2);

  [citations.slice(0, mid), citations.slice(mid)].forEach((col, ci) => {
    const x = MARGIN.left + ci * (colW + colGap);
    const textRuns = col.flatMap((c, i) => [
      ...(i > 0 ? [{ text: "\n", options: { fontSize: refFs } }] : []),
      { text: c.apa + "\n", options: { fontSize: refFs, fontFace: FONT_EN, color: C.text } },
    ]);
    slide.addText(textRuns, {
      x, y: startY, w: colW, h: colH,
      fontSize: refFs, fontFace: FONT_EN, color: C.text,
      align: "left", valign: "top",
      wrap: true, lineSpacingMultiple: 1.15,
    });
  });
}
