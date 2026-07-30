from .asr import Word
from .config import TranscriptionConfig

SENTENCE_END = (".", "?", "!", "…")
SOFT_BREAK = (",", ";", ":")


def build_sentence_segments(words: list[Word], cfg: TranscriptionConfig) -> list[dict]:
    """Kelime zaman damgalarından cümle cümle segmentler oluşturur.

    Lila-speech-to-text projesindeki Türkçe segmentasyon mantığından uyarlanmıştır:
    cümle sonu noktalaması, uzun duraklama veya azami segment süresi (failsafe,
    virgül/noktalı virgül gibi yumuşak kesme noktasında bölünür) tetiklendiğinde
    segment kapatılır.
    """
    if not words:
        return []

    segments: list[dict] = []
    current: list[Word] = []

    def flush() -> None:
        if not current:
            return
        text = " ".join(w.text for w in current).strip()
        if text:
            segments.append(
                {"start": current[0].start, "end": current[-1].end, "text": text}
            )
        current.clear()

    for i, word in enumerate(words):
        current.append(word)

        is_last = i == len(words) - 1
        gap_to_next = (words[i + 1].start - word.end) if not is_last else None

        ends_sentence = word.text.endswith(SENTENCE_END)
        long_pause = gap_to_next is not None and gap_to_next > cfg.pause_gap_seconds

        if ends_sentence or long_pause:
            flush()
            continue

        duration = current[-1].end - current[0].start
        if duration > cfg.max_segment_seconds:
            split_at = None
            for j in range(len(current) - 2, -1, -1):
                if current[j].text.endswith(SOFT_BREAK):
                    split_at = j
                    break

            if split_at is not None:
                tail = current[split_at + 1 :]
                del current[split_at + 1 :]
                flush()
                current.extend(tail)
            else:
                flush()

    flush()
    return _merge_too_short_segments(segments, cfg.min_segment_seconds)


def _merge_too_short_segments(segments: list[dict], min_seconds: float) -> list[dict]:
    merged: list[dict] = []
    for seg in segments:
        duration = seg["end"] - seg["start"]
        if merged and duration < min_seconds:
            merged[-1]["end"] = seg["end"]
            merged[-1]["text"] = f"{merged[-1]['text']} {seg['text']}".strip()
        else:
            merged.append(dict(seg))
    return merged
