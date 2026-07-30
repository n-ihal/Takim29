import json
from pathlib import Path

from .align import assign_speakers
from .asr import run_transcription
from .audio import audio_to_wav
from .config import TranscriptionConfig
from .diarization import run_diarization
from .segment import build_sentence_segments


def transcribe(input_path: str | Path, cfg: TranscriptionConfig | None = None) -> dict:
    """mp3/wav/m4a toplantı kaydını, cümle cümle zaman damgalı ve konuşmacı
    etiketli bir sözlüğe dönüştürür (bkz. backend/README.md JSON şeması)."""
    cfg = cfg or TranscriptionConfig()
    input_path = Path(input_path)

    wav_path = audio_to_wav(input_path)
    try:
        words = run_transcription(wav_path, cfg)
        diarization_turns = run_diarization(wav_path, cfg)
    finally:
        if wav_path.parent.name.startswith("vocalyze_"):
            wav_path.unlink(missing_ok=True)
            try:
                wav_path.parent.rmdir()
            except OSError:
                pass

    sentence_segments = build_sentence_segments(words, cfg)
    labeled_segments = assign_speakers(sentence_segments, diarization_turns)

    speaker_names: dict[str, str] = {}
    ordered_speakers: list[str] = []
    for seg in labeled_segments:
        raw = seg["speaker_raw"]
        if raw is not None and raw not in speaker_names:
            speaker_names[raw] = f"Kişi {len(speaker_names) + 1}"
            ordered_speakers.append(speaker_names[raw])

    output_segments = []
    for i, seg in enumerate(labeled_segments):
        output_segments.append(
            {
                "id": i,
                "start": round(seg["start"], 2),
                "end": round(seg["end"], 2),
                "speaker": speaker_names.get(seg["speaker_raw"], "Bilinmeyen"),
                "text": seg["text"],
            }
        )

    duration = output_segments[-1]["end"] if output_segments else 0.0

    return {
        "audio_file": input_path.name,
        "duration": duration,
        "model": cfg.whisper_model,
        "speakers": ordered_speakers,
        "segments": output_segments,
    }


def transcribe_to_file(
    input_path: str | Path,
    output_path: str | Path,
    cfg: TranscriptionConfig | None = None,
) -> dict:
    result = transcribe(input_path, cfg)
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    return result
