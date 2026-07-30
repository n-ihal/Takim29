from pathlib import Path

from .config import TranscriptionConfig


def run_diarization(wav_path: Path, cfg: TranscriptionConfig) -> list[dict]:
    """pyannote.audio ile konuşmacı ayrımı yapar, [{"start","end","speaker_raw"}, ...] döner."""
    if not cfg.huggingface_token:
        raise RuntimeError(
            "HUGGINGFACE_TOKEN bulunamadı. https://hf.co/settings/tokens adresinden "
            "bir 'read' token oluşturup .env dosyasına ekleyin ve "
            f"https://huggingface.co/{cfg.diarization_model} sayfasındaki "
            "kullanım şartlarını kabul edin."
        )

    import torch
    from pyannote.audio import Pipeline

    pipeline = Pipeline.from_pretrained(cfg.diarization_model, token=cfg.huggingface_token)
    pipeline.to(torch.device(cfg.diarization_device))

    kwargs = {}
    if cfg.min_speakers is not None:
        kwargs["min_speakers"] = cfg.min_speakers
    if cfg.max_speakers is not None:
        kwargs["max_speakers"] = cfg.max_speakers

    output = pipeline(str(wav_path), **kwargs)

    # pyannote.audio 4.x DiarizeOutput.speaker_diarization -> Annotation
    # pyannote.audio 3.x doğrudan Annotation döner
    annotation = getattr(output, "speaker_diarization", output)

    turns = [
        {"start": segment.start, "end": segment.end, "speaker_raw": label}
        for segment, _, label in annotation.itertracks(yield_label=True)
    ]
    turns.sort(key=lambda t: t["start"])
    return turns
