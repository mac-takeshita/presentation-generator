# Presentation Generator

PptxGenJS (TypeScript/Bun) + Gemini TTS + ffmpeg によるプレゼンテーション動画自動生成ツール。

## 機能

- **PPTX 生成**: `slides.yaml` に定義したスライド内容から PowerPoint ファイルを生成
- **ナレーション生成**: Gemini Native Audio API による TTS 音声生成
- **動画生成**: スライド画像 + ナレーション音声を ffmpeg で MP4 に合成

## セットアップ

```bash
bun install
```

### 環境変数

```bash
cp .env.example .env
# .env に Gemini API キーを設定
```

### 外部ツール (動画生成時に必要)

- [pptx2png](https://github.com/nicjohnson145/pptx2png) — PPTX → PNG 変換
- [ffmpeg](https://ffmpeg.org/) — 動画合成

## 使い方

```bash
bun run generate      # PPTX 生成のみ
bun run screenshot    # PPTX → PNG 変換
bun run build         # generate + screenshot
bun run tts           # ナレーション音声生成（要 .env）
bun run video         # スライド画像+音声 → MP4 動画生成（要 ffmpeg）
```

## プロジェクト構成

```
├── slides.yaml              # 全スライドの内容定義 + ナレーション原稿（単一ソース）
├── generate.ts              # メインエントリ（PPTX 生成）
├── tts.ts                   # Gemini TTS でナレーション生成
├── video.ts                 # スライド画像+音声 → MP4 動画生成
├── lib/
│   ├── slides-data.ts       # slides.yaml ローダー
│   ├── theme.ts             # カラー、フォント、レイアウト定数
│   ├── helpers.ts           # 再利用可能なスライドビルダー関数
│   ├── types.ts             # PptxGenJS 型定義
│   ├── icons.ts             # Material Design Icons ローダー
│   └── cite.ts              # 引用管理（pandoc citekey → APA形式）
├── pages/                   # 各スライドのレイアウト定義
├── assets/                  # スライドに埋め込む画像
├── output_images/           # 生成されたスライド画像（PNG）
└── voice_output/            # TTS 生成音声（WAV）
```

## ワークフロー

1. `slides.yaml` にスライド内容・ナレーション原稿を記述
2. `pages/*.ts` に各スライドのレイアウトを実装
3. `bun run build` で PPTX + PNG を生成
4. `bun run tts` でナレーション音声を生成
5. `bun run video` で最終動画を合成

## デザインルール

- 最小フォントサイズ: 22pt
- カラーテーマ: `lib/theme.ts` で一元管理
- フォント: メイリオ（日本語）、Arial（英語）
