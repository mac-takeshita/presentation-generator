import type { Pres } from "../lib/types";
import { C, FONT, FS, MARGIN, CONTENT_W } from "../lib/theme";
import { addContentSlide, addCard, threeColLayout } from "../lib/helpers";
import { addIcon, ICONS } from "../lib/icons";
import { cite } from "../lib/cite";
import { getSlide } from "../lib/slides-data";

const CARD_ICONS = [ICONS.brain, ICONS.clockOutline, ICONS.headphones];
const CARD_COLORS = [C.step1, C.step2, C.step3];

export function buildSlide02(pres: Pres) {
  const d = getSlide("background");
  const cards = d.cards as Array<{
    heading: string; body: string; detail: string; cites: string[];
  }>;

  const slide = addContentSlide(pres, d.title);
  if (d.narration) slide.addNotes((d.narration as string).trim());

  // Subtitle banner
  slide.addText(
    d.subtitle as string,
    {
      x: MARGIN.left, y: 1.25, w: CONTENT_W, h: 0.55,
      fontSize: FS.heading, fontFace: FONT, color: C.primary,
      bold: true, align: "center", valign: "middle",
    },
  );

  const { xs, colW } = threeColLayout(0.35);
  const cardY = 2.0;
  const cardH = 4.8;
  const iconY = cardY + 3.6;
  const citeFs = 14;

  cards.forEach((card, i) => {
    const citeText = card.cites.map((k) => cite(k)).join("; ");

    addCard(slide, xs[i]!, cardY, colW, cardH,
      card.heading,
      [
        { text: card.body + "\n\n", options: { fontSize: FS.small, fontFace: FONT, color: C.text } },
        { text: card.detail + "\n", options: { fontSize: FS.small, fontFace: FONT, color: C.darkGray } },
        { text: citeText, options: { fontSize: citeFs, fontFace: FONT, color: C.midGray } },
      ],
      CARD_COLORS[i]!,
    );
    addIcon(slide, CARD_ICONS[i]!, xs[i]! + colW / 2 - 0.3, iconY, 0.6, CARD_COLORS[i]!);
  });
}
