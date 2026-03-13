import type { Pres } from "../lib/types";
import { C, FONT, FS } from "../lib/theme";
import { addContentSlide, addCard, twoColLayout, addBanner } from "../lib/helpers";
import { cite } from "../lib/cite";
import { getSlide } from "../lib/slides-data";

export function buildSlide05(pres: Pres) {
  const d = getSlide("risks");
  const risks = d.risks as Array<{ heading: string; body: string; cites: string[] }>;
  const solutions = d.solutions as Array<{
    heading: string; body: string; cites?: string[]; footnote?: string;
  }>;

  const slide = addContentSlide(pres, d.title);
  if (d.narration) slide.addNotes((d.narration as string).trim());

  const { leftX, rightX, colW } = twoColLayout(0.4);
  const cardH = 1.9;
  const gap = 0.2;
  const citeFs = 14;

  // Left column: Risks
  slide.addText(d.risks_heading as string, {
    x: leftX, y: 1.25, w: colW, h: 0.5,
    fontSize: FS.heading, fontFace: FONT, color: C.step5,
    bold: true, align: "left", valign: "middle",
  });

  risks.forEach((risk, i) => {
    const citeText = risk.cites.map((k) => cite(k)).join("; ");
    addCard(slide, leftX, 1.85 + i * (cardH + gap), colW, cardH,
      risk.heading,
      [
        { text: risk.body + "\n", options: { fontSize: FS.small, fontFace: FONT, color: C.text } },
        { text: citeText, options: { fontSize: citeFs, fontFace: FONT, color: C.midGray } },
      ],
      C.step5,
    );
  });

  // Right column: Solutions
  slide.addText(d.solutions_heading as string, {
    x: rightX, y: 1.25, w: colW, h: 0.5,
    fontSize: FS.heading, fontFace: FONT, color: C.step2,
    bold: true, align: "left", valign: "middle",
  });

  solutions.forEach((sol, i) => {
    const bodyParts: Array<{ text: string; options: Record<string, unknown> }> = [
      { text: sol.body + "\n", options: { fontSize: FS.small, fontFace: FONT, color: C.text } },
    ];
    if (sol.footnote) {
      bodyParts.push(
        { text: sol.footnote, options: { fontSize: citeFs, fontFace: FONT, color: C.darkGray } },
      );
    }
    if (sol.cites) {
      bodyParts.push(
        { text: sol.cites.map((k) => cite(k)).join("; "), options: { fontSize: citeFs, fontFace: FONT, color: C.midGray } },
      );
    }
    addCard(slide, rightX, 1.85 + i * (cardH + gap), colW, cardH,
      sol.heading,
      bodyParts,
      C.step2,
    );
  });

  // Bottom message
  addBanner(slide, 6.2, 0.7,
    d.banner as string,
    C.primary, C.white, FS.body,
  );
}
