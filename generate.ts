/**
 * Pre-Workshop Video Presentation Generator
 *
 * Generates a PPTX for the workshop pre-video.
 *
 * Usage:
 *   bun run generate        # Generate PPTX
 *   bun run screenshot      # Convert to PNG
 *   bun run build           # Generate + screenshot
 */
import PptxGenJS from "pptxgenjs";
import { SLIDE_W, SLIDE_H } from "./lib/theme";
import { buildSlide01 } from "./pages/slide01-title";
import { buildSlide02 } from "./pages/slide02-background";
import { buildSlide03 } from "./pages/slide03-notebooklm";
import { buildSlide04 } from "./pages/slide04-steps";
import { buildStepDetailSlides } from "./pages/slide04-step-details";
import { buildSlide05 } from "./pages/slide05-risks";
import { buildSlide06 } from "./pages/slide06-preparation";
import { buildSlide07 } from "./pages/slide07-closing";
import { buildSlide08 } from "./pages/slide08-references";

// ── Create presentation ─────────────────────────────────
const pres = new PptxGenJS();
pres.defineLayout({ name: "WIDE16x9", width: SLIDE_W, height: SLIDE_H });
pres.layout = "WIDE16x9";
pres.title = "生成AIで医療者教育用動画を生成してみよう — 事前動画";
pres.author = "ワークショップ企画者";
pres.subject = "第58回日本医学教育学会大会 ワークショップ事前動画";

// ── Build all slides ────────────────────────────────────
buildSlide01(pres);  // タイトル
buildSlide02(pres);  // 背景
buildSlide03(pres);  // NotebookLMとは
buildSlide04(pres);  // 7ステップ（概要）
buildStepDetailSlides(pres);  // 各ステップ詳細（スクリーンショット付き）
buildSlide05(pres);  // リスクと品質管理
buildSlide06(pres);  // 事前準備
buildSlide07(pres);  // まとめ・当日の流れ
buildSlide08(pres);  // 文献一覧（自動生成）

// ── Save ────────────────────────────────────────────────
const fileName = "presentation.pptx";
await pres.writeFile({ fileName });
console.log(`Done: ${fileName} (${pres.slides.length} slides)`);
