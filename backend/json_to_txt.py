import argparse
import json
from pathlib import Path


def format_timestamp(seconds: float) -> str:
    total = int(seconds)
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    return f"{h:02d}:{m:02d}:{s:02d}"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Transkript JSON dosyasını zaman ve kişi damgalı, satır satır .txt dosyasına çevirir."
    )
    parser.add_argument("json_path", help="Girdi transkript JSON dosyası")
    parser.add_argument(
        "-o", "--output", help="Çıktı .txt dosyası (varsayılan: <json_adı>.txt)"
    )
    args = parser.parse_args()

    json_path = Path(args.json_path)
    output_path = Path(args.output) if args.output else json_path.with_suffix(".txt")

    data = json.loads(json_path.read_text(encoding="utf-8"))

    lines = []
    for seg in data["segments"]:
        start = format_timestamp(seg["start"])
        end = format_timestamp(seg["end"])
        lines.append(f"[{start} - {end}] {seg['speaker']}: {seg['text']}")

    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Yazıldı: {output_path} ({len(lines)} satır)")


if __name__ == "__main__":
    main()
