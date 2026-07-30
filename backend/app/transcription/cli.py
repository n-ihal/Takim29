import argparse
from pathlib import Path

from .config import TranscriptionConfig
from .pipeline import transcribe_to_file


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(
        description="Toplantı ses kaydını (mp3/wav/m4a) zaman damgalı, "
        "konuşmacı etiketli JSON'a dönüştürür."
    )
    parser.add_argument("audio", help="Girdi ses dosyası (mp3/wav/m4a)")
    parser.add_argument(
        "-o", "--output", help="Çıktı JSON dosyası (varsayılan: <ses_adı>.json)"
    )
    parser.add_argument(
        "--model", default=None, help="faster-whisper model adı (varsayılan: large-v3)"
    )
    parser.add_argument("--min-speakers", type=int, default=None)
    parser.add_argument("--max-speakers", type=int, default=None)
    args = parser.parse_args(argv)

    cfg = TranscriptionConfig()
    if args.model:
        cfg.whisper_model = args.model
    cfg.min_speakers = args.min_speakers
    cfg.max_speakers = args.max_speakers

    output_path = args.output or f"{Path(args.audio).stem}.json"

    print(f"[1/2] '{args.audio}' işleniyor (model={cfg.whisper_model})...")
    result = transcribe_to_file(args.audio, output_path, cfg)
    print(f"[2/2] Tamamlandı: {output_path}")
    print(f"  Konuşmacılar: {', '.join(result['speakers']) or 'tespit edilemedi'}")
    print(f"  Segment sayısı: {len(result['segments'])}")


if __name__ == "__main__":
    main()
