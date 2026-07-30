import shutil
import subprocess
import tempfile
from pathlib import Path


def ensure_ffmpeg() -> None:
    if shutil.which("ffmpeg") is None:
        raise RuntimeError(
            "ffmpeg bulunamadı. macOS için: `brew install ffmpeg`, "
            "Ubuntu/Debian için: `sudo apt install ffmpeg`."
        )


def audio_to_wav(input_path: str | Path, out_dir: str | Path | None = None) -> Path:
    """mp3/m4a/wav gibi ses dosyalarını 16kHz mono 16-bit PCM WAV'a çevirir
    (Whisper ve pyannote'un beklediği format)."""
    ensure_ffmpeg()

    input_path = Path(input_path)
    if not input_path.exists():
        raise FileNotFoundError(f"Ses dosyası bulunamadı: {input_path}")

    target_dir = Path(out_dir) if out_dir else Path(tempfile.mkdtemp(prefix="vocalyze_"))
    target_dir.mkdir(parents=True, exist_ok=True)
    wav_path = target_dir / f"{input_path.stem}.wav"

    cmd = [
        "ffmpeg", "-y",
        "-i", str(input_path),
        "-ac", "1",
        "-ar", "16000",
        "-sample_fmt", "s16",
        str(wav_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg dönüştürme hatası:\n{result.stderr}")

    return wav_path
