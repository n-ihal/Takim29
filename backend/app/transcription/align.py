def assign_speakers(segments: list[dict], diarization_turns: list[dict]) -> list[dict]:
    """Her cümle segmentine, en çok örtüştüğü diarization turn'ünün ham
    konuşmacı etiketini (`speaker_raw`) ekler."""
    labeled = []
    for seg in segments:
        raw = _best_speaker(seg["start"], seg["end"], diarization_turns)
        labeled.append({**seg, "speaker_raw": raw})
    return labeled


def _best_speaker(start: float, end: float, turns: list[dict]) -> str | None:
    if not turns:
        return None

    best_label = None
    best_overlap = 0.0
    for turn in turns:
        overlap = min(end, turn["end"]) - max(start, turn["start"])
        if overlap > best_overlap:
            best_overlap = overlap
            best_label = turn["speaker_raw"]

    if best_label is not None:
        return best_label

    # Örtüşme bulunamadıysa (örn. sessizlik sınırında kalan kısa segment)
    # zaman olarak en yakın turn'e ata.
    mid = (start + end) / 2
    closest = min(turns, key=lambda t: min(abs(mid - t["start"]), abs(mid - t["end"])))
    return closest["speaker_raw"]
