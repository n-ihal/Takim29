import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass
class TranscriptionConfig:
    whisper_model: str = os.getenv("WHISPER_MODEL", "large-v3")
    whisper_device: str = os.getenv("WHISPER_DEVICE", "cpu")
    whisper_compute_type: str = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
    language: str = os.getenv("TRANSCRIBE_LANGUAGE", "tr")

    diarization_model: str = os.getenv(
        "DIARIZATION_MODEL", "pyannote/speaker-diarization-community-1"
    )
    diarization_device: str = os.getenv("DIARIZATION_DEVICE", "cpu")
    huggingface_token: str | None = os.getenv("HUGGINGFACE_TOKEN")

    min_speakers: int | None = None
    max_speakers: int | None = None

    # Cümle segmentasyonu için eşikler (Lila-speech-to-text projesindeki
    # Türkçe segmentasyon mantığından uyarlanmıştır).
    pause_gap_seconds: float = 0.7
    max_segment_seconds: float = 8.0
    min_segment_seconds: float = 0.35
