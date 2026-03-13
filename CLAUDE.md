# Presentation: ワークショップ事前動画

## Overview

PptxGenJS (TypeScript/Bun) によるプレゼンテーション生成プロジェクト。
「生成AIで医療者教育用動画を生成してみよう」ワークショップの事前動画（約5分・7スライド）。

## Project Structure

```
presentation/
├── slides.yaml              # 全スライドの内容定義 + ナレーション原稿（単一ソース）
├── generate.ts              # メインエントリ（PPTX生成）
├── tts.ts                   # Gemini TTS でナレーション生成
├── video.ts                 # スライド画像+音声 → MP4 動画生成（ffmpeg）
├── lib/
│   ├── slides-data.ts       # slides.yaml ローダー（getSlide / getAllSlides）
│   ├── theme.ts             # カラー、フォント、サイズ、レイアウト定数
│   ├── helpers.ts           # 再利用可能なスライドビルダー関数
│   ├── types.ts             # PptxGenJS 型定義
│   └── icons.ts             # Material Design Icons ローダー
├── pages/
│   ├── slide01-title.ts     # タイトル
│   ├── slide02-background.ts # 背景
│   ├── slide03-notebooklm.ts # NotebookLMとは
│   ├── slide04-steps.ts     # 7ステップ概要
│   ├── slide04-step-details.ts # 各ステップ詳細（スクリーンショット付き）
│   ├── slide05-risks.ts     # リスクと品質管理
│   ├── slide06-preparation.ts # 事前準備
│   ├── slide07-closing.ts   # まとめ・当日の流れ
│   └── slide08-references.ts # 文献一覧
├── output_images/           # 生成されたスライド画像（PNG）
├── voice_output/            # TTS生成音声（WAV）
└── presentation.pptx        # 生成された PPTX ファイル
```

## Content Editing

スライドの内容・ナレーション原稿は `slides.yaml` で一元管理。
各スライドは `id` で識別し、TS側は `getSlide(id)` でテキスト内容を取得する。
レイアウト・スタイリングは各 `pages/*.ts` に残る。

```bash
# yq でナレーション修正
yq '(.slides[] | select(.id == "background")).narration = "新しいナレーション"' -i slides.yaml

# yq でタイトル変更
yq '(.slides[] | select(.id == "title")).subtitle = "新サブタイトル"' -i slides.yaml
```

## Build Commands

```bash
cd presentation
bun run generate      # PPTX 生成のみ
bun run screenshot    # PPTX → PNG 変換
bun run build         # generate + screenshot
bun run tts           # ナレーション音声生成（要 .env）
bun run video         # スライド画像+音声 → MP4 動画生成（要 ffmpeg）
```

### WSL マウントドライブでのビルド

WSL の `/mnt/h/` (Google Drive) 上では bun がシンボリックリンク等の問題で動作しない。
`/tmp` にコピーしてビルドし、成果物を戻す:

```bash
SRC="/mnt/h/My Drive/UpComming/生成AIで医療者教育用動画を生成してみようin医学教育学会(2026_07_31)/lecture-movie-with-notebooklm"
rsync -a --exclude='node_modules' "$SRC/presentation/" /tmp/presentation/
rsync -a "$SRC/screenshots/" /tmp/screenshots/
cd /tmp/presentation && bun install && bun run build
cp /tmp/presentation/presentation.pptx "$SRC/presentation/"
cp /tmp/presentation/output_images/*.png "$SRC/presentation/output_images/"
```

## Typography Rules

- **最小フォントサイズ: 22pt**（`FS.body` 以上を使用すること）
- テキストがボックスからはみ出す場合は内容を削減・簡潔にする

## Theme Constants

- Colors: `lib/theme.ts` の `C` オブジェクト（Primary: `#1A5276`, Accent: `#E67E22`）
- Font sizes: `lib/theme.ts` の `FS` オブジェクト
- Fonts: メイリオ（日本語）, Arial（英語）
