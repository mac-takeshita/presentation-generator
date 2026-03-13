import type { Pres } from "../lib/types";
import { addTitleSlide } from "../lib/helpers";
import { getSlide } from "../lib/slides-data";

export function buildSlide01(pres: Pres) {
  const d = getSlide("title");
  const slide = addTitleSlide(
    pres,
    d.title,
    d.subtitle as string,
    d.presenter as string,
  );
  if (d.narration) slide.addNotes((d.narration as string).trim());
}
