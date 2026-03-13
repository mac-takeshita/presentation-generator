/**
 * Video generator: combines slide images (PNG) + narration audio (WAV) into MP4.
 *
 * Each slide with narration becomes a segment (still image + audio).
 * Slides without narration get a fixed duration (default 5s).
 * All segments are concatenated into a single MP4.
 *
 * Usage:
 *   bun run video
 *
 * Requires: ffmpeg
 */
import { existsSync, mkdirSync, writeFileSync, unlinkSync, rmdirSync } from "fs";
import { join } from "path";
import { getAllSlides } from "./lib/slides-data";

const BASE_DIR = import.meta.dir;
const IMAGE_DIR = join(BASE_DIR, "output_images");
const AUDIO_DIR = join(BASE_DIR, "voice_output");
const TEMP_DIR = join(BASE_DIR, "video_temp");
const OUTPUT_FILE = join(BASE_DIR, "presentation.mp4");
const SILENT_DURATION = 5; // seconds for slides without narration

async function run(cmd: string[]): Promise<string> {
  const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ]);
  const code = await proc.exited;
  if (code !== 0) {
    throw new Error(`Command failed (${code}): ${cmd.join(" ")}\n${stderr}`);
  }
  return stdout.trim();
}

/** Get duration of a WAV file in seconds via ffprobe. */
async function getAudioDuration(path: string): Promise<number> {
  const out = await run([
    "ffprobe",
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    path,
  ]);
  return parseFloat(out);
}

async function main() {
  // Verify ffmpeg is available
  await run(["ffmpeg", "-version"]).catch(() => {
    throw new Error("ffmpeg not found. Please install ffmpeg.");
  });

  mkdirSync(TEMP_DIR, { recursive: true });

  const slides = getAllSlides();
  const slidesWithNarration = slides.filter((s) => s.narration);

  // Build mapping: slideIndex (1-based) → audio file index
  // Audio files are numbered sequentially for slides that have narration
  let audioIndex = 0;
  const segments: { image: string; audio: string | null; index: number }[] = [];

  for (let i = 0; i < slides.length; i++) {
    const slideNum = String(i + 1).padStart(3, "0");
    const imagePath = join(IMAGE_DIR, `slide_${slideNum}.png`);

    if (!existsSync(imagePath)) {
      console.warn(`⚠ Image not found: slide_${slideNum}.png — skipping`);
      if (slides[i]!.narration) audioIndex++;
      continue;
    }

    let audioPath: string | null = null;
    if (slides[i]!.narration) {
      audioIndex++;
      const audioNum = String(audioIndex).padStart(2, "0");
      audioPath = join(AUDIO_DIR, `slide${audioNum}.wav`);
      if (!existsSync(audioPath)) {
        console.warn(`⚠ Audio not found: slide${audioNum}.wav — using silent`);
        audioPath = null;
      }
    }

    segments.push({ image: imagePath, audio: audioPath, index: i + 1 });
  }

  console.log(`Found ${segments.length} segments (${slidesWithNarration.length} with narration)`);

  // Generate individual segment videos
  const segmentFiles: string[] = [];

  for (const seg of segments) {
    const segFile = join(TEMP_DIR, `seg_${String(seg.index).padStart(3, "0")}.mp4`);
    segmentFiles.push(segFile);

    const slideId = slides[seg.index - 1]!.id;
    if (seg.audio) {
      const duration = await getAudioDuration(seg.audio);
      // Add a small padding after narration
      const totalDuration = duration + 0.5;
      console.log(`[${String(seg.index).padStart(2, "0")}] ${slideId} — ${duration.toFixed(1)}s audio`);

      await run([
        "ffmpeg", "-y",
        "-loop", "1", "-i", seg.image,
        "-i", seg.audio,
        "-c:v", "libx264", "-tune", "stillimage",
        "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2",
        "-t", String(totalDuration),
        "-pix_fmt", "yuv420p",
        "-r", "30",
        segFile,
      ]);
    } else {
      console.log(`[${String(seg.index).padStart(2, "0")}] ${slideId} — ${SILENT_DURATION}s (silent)`);

      // Generate silent audio for slides without narration
      await run([
        "ffmpeg", "-y",
        "-loop", "1", "-i", seg.image,
        "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
        "-c:v", "libx264", "-tune", "stillimage",
        "-c:a", "aac", "-b:a", "192k",
        "-t", String(SILENT_DURATION),
        "-pix_fmt", "yuv420p",
        "-r", "30",
        segFile,
      ]);
    }
  }

  // Create concat list
  const concatListPath = join(TEMP_DIR, "concat.txt");
  const concatContent = segmentFiles.map((f) => `file '${f}'`).join("\n");
  writeFileSync(concatListPath, concatContent);

  // Concatenate all segments
  console.log(`\nConcatenating ${segmentFiles.length} segments...`);
  await run([
    "ffmpeg", "-y",
    "-f", "concat", "-safe", "0",
    "-i", concatListPath,
    "-c", "copy",
    OUTPUT_FILE,
  ]);

  // Get final video info
  const duration = await run([
    "ffprobe", "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    OUTPUT_FILE,
  ]);

  console.log(`\n✓ ${OUTPUT_FILE}`);
  console.log(`  Duration: ${(parseFloat(duration) / 60).toFixed(1)} min (${parseFloat(duration).toFixed(1)}s)`);

  // Cleanup temp files
  for (const f of segmentFiles) {
    unlinkSync(f);
  }
  unlinkSync(concatListPath);

  try { rmdirSync(TEMP_DIR); } catch { /* ignore if not empty */ }
}

main().catch((e) => {
  console.error("Error:", e.message || e);
  process.exit(1);
});
