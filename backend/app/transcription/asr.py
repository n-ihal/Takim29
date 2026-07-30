from dataclasses import dataclass
from pathlib import Path

from .config import TranscriptionConfig

_SKIP_TOKENS = {"", "...", "…"}


@dataclass
class Word:
    start: float
    end: float
    text: str


def run_transcription(wav_path: Path, cfg: TranscriptionConfig) -> list[Word]:
    from faster_whisper import WhisperModel

    model = WhisperModel(
        cfg.whisper_model,
        device=cfg.whisper_device,
        compute_type=cfg.whisper_compute_type,
    )

    segments, _info = model.transcribe(
        str(wav_path),
        language=cfg.language,
        word_timestamps=True,
        vad_filter=True,
    )

    words: list[Word] = []
    for segment in segments:
        if not segment.words:
            continue
        for w in segment.words:
            text = w.word.strip()
            if text in _SKIP_TOKENS:
                continue
            words.append(Word(start=w.start, end=w.end, text=text))

    return words
