import json
from pathlib import Path

# from .align import assign_speakers  # Diarization iptal edildi
from .asr import run_transcription
from .audio import audio_to_wav
from .config import TranscriptionConfig
# from .diarization import run_diarization  # Diarization iptal edildi
from .segment import build_sentence_segments


def transcribe(input_path: str | Path, cfg: TranscriptionConfig | None = None) -> dict:
    """mp3/wav/m4a toplantı kaydını, cümle cümle zaman damgalı bir sözlüğe dönüştürür
    (Diarization/Konuşmacı Ayrımı Hız İçin Devre Dışı Bırakıldı)."""
    cfg = cfg or TranscriptionConfig()
    input_path = Path(input_path)

    wav_path = audio_to_wav(input_path)
    try:
        # Sadece STT (Sesten Metne) işlemini çalıştırıyoruz
        words = run_transcription(wav_path, cfg)
        # diarization_turns = run_diarization(wav_path, cfg)  # İPTAL EDİLDİ
    finally:
        if wav_path.parent.name.startswith("vocalyze_"):
            wav_path.unlink(missing_ok=True)
            try:
                wav_path.parent.rmdir()
            except OSError:
                pass

    sentence_segments = build_sentence_segments(words, cfg)
    
    # Konuşmacı ayrımı (Diarization) iptal edildiği için her segmente 
    # varsayılan bir "Tek Konuşmacı" etiketi atıyoruz.
    output_segments = []
    for i, seg in enumerate(sentence_segments):
        output_segments.append(
            {
                "id": i,
                "start": round(seg["start"], 2),
                "end": round(seg["end"], 2),
                "speaker": "Tek Konuşmacı",
                "text": seg["text"],
            }
        )

    duration = output_segments[-1]["end"] if output_segments else 0.0

    return {
        "audio_file": input_path.name,
        "duration": duration,
        "model": cfg.whisper_model,
        "speakers": ["Tek Konuşmacı"],
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