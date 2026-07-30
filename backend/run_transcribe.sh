#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

AUDIO="$1"
MODEL="${2:-large-v3-turbo}"

if [ -z "$AUDIO" ]; then
  echo "Kullanım: ./run_transcribe.sh <ses/video dosyası> [model]"
  echo "Örnek:    ./run_transcribe.sh ../video1.mp3"
  echo "Örnek:    ./run_transcribe.sh ../video1.mp3 large-v3"
  exit 1
fi

if [ ! -f "$AUDIO" ]; then
  echo "Dosya bulunamadı: $AUDIO"
  exit 1
fi

OUTDIR="../transkriptler"
mkdir -p "$OUTDIR"

N=1
while [ -f "$OUTDIR/transkript-$N.json" ]; do
  N=$((N + 1))
done

OUTPUT_JSON="$OUTDIR/transkript-$N.json"
OUTPUT_TXT="$OUTDIR/transkript-$N.txt"

echo "Ses dosyası: $AUDIO"
echo "Model: $MODEL"
echo "Çıktı (JSON): $OUTPUT_JSON"
echo "Çıktı (TXT): $OUTPUT_TXT"

python -m app.transcription.cli "$AUDIO" -o "$OUTPUT_JSON" --model "$MODEL"
python json_to_txt.py "$OUTPUT_JSON" -o "$OUTPUT_TXT"
