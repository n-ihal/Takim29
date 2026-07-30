# Vocalyze — Transkript Modülü

Toplantı ses kaydını (mp3/wav/m4a) **cümle cümle zaman damgalı** ve
**konuşmacı etiketli** (`Kişi 1`, `Kişi 2`, ...) bir JSON dosyasına dönüştürür.

Ses → metin için [faster-whisper](https://github.com/SYSTRAN/faster-whisper),
konuşmacı ayrımı (diarization) için
[pyannote.audio](https://github.com/pyannote/pyannote-audio) kullanılır.
İkisi de tamamen ücretsiz/açık kaynaktır.

Bu modül şimdilik bağımsız bir Python paketi + CLI'dir; FastAPI/Celery
entegrasyonu ileride `app.transcription.transcribe()` fonksiyonunu doğrudan
çağırarak yapılabilir.

---

## ⚙️ Gereksinimler

* **Python 3.12.x** (faster-whisper/av uyumluluğu için)
* **FFmpeg** (`brew install ffmpeg` / `sudo apt install ffmpeg`)
* Ücretsiz bir **HuggingFace** hesabı (diarization modeli için gerekli, kredi kartı istemez)

---

## 🐍 Kurulum

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -U pip
pip install -r requirements.txt
```

### HuggingFace token'ı alma (diarization için zorunlu)

1. https://huggingface.co adresinde ücretsiz hesap oluştur (veya giriş yap).
2. https://huggingface.co/pyannote/speaker-diarization-community-1 sayfasına git
   ve "Agree and access repository" ile kullanım şartlarını kabul et.
3. https://hf.co/settings/tokens adresinden **read** yetkili yeni bir token oluştur.
4. `.env.example` dosyasını `.env` olarak kopyala ve token'ı içine yapıştır:

```bash
cp .env.example .env
# .env içinde: HUGGINGFACE_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ▶️ Kullanım

```bash
python -m app.transcription.cli toplanti.mp3
python -m app.transcription.cli toplanti.mp3 -o cikti.json
python -m app.transcription.cli toplanti.mp3 --min-speakers 2 --max-speakers 5
```

### Parametreler

| Parametre         | Açıklama                                               |
| ------------------ | ------------------------------------------------------- |
| `audio`             | Girdi ses dosyası (mp3/wav/m4a)                         |
| `-o, --output`      | Çıktı JSON yolu (varsayılan: `<ses_adı>.json`)          |
| `--model`           | faster-whisper model adı (varsayılan: `large-v3`)       |
| `--min-speakers`    | Bilinen minimum konuşmacı sayısı (opsiyonel, ipucu)     |
| `--max-speakers`    | Bilinen maksimum konuşmacı sayısı (opsiyonel, ipucu)    |

### Kod içinden kullanım

```python
from app.transcription import transcribe

result = transcribe("toplanti.mp3")
```

---

## 📄 Çıktı JSON şeması

```json
{
  "audio_file": "toplanti.mp3",
  "duration": 2731.4,
  "model": "large-v3",
  "speakers": ["Kişi 1", "Kişi 2", "Kişi 3"],
  "segments": [
    {"id": 0, "start": 0.0, "end": 5.66, "speaker": "Kişi 1", "text": "..."},
    {"id": 1, "start": 6.04, "end": 11.36, "speaker": "Kişi 2", "text": "..."}
  ]
}
```

---

## 🚀 Performans Notları

* Apple Silicon'da (M-serisi) hem faster-whisper (ctranslate2) hem de pyannote
  şu an CPU üzerinden çalışır — MPS/GPU hızlandırma yok.
* Varsayılan `large-v3` modeli **en yüksek doğruluğu** hedefler ama CPU'da
  yavaştır (45 dk'lık bir kayıt ~30-40 dk sürebilir).
* Daha hızlı ama biraz daha az doğru sonuç için:

  ```bash
  python -m app.transcription.cli toplanti.mp3 --model large-v3-turbo
  ```

  (~4x daha hızlı, 45 dk'lık kayıt için tahmini 8-12 dk)

---

## ❗ Olası Sorunlar

**`RuntimeError: HUGGINGFACE_TOKEN bulunamadı`**
`.env` dosyasını oluşturduğundan ve içine geçerli bir token yazdığından emin ol.

**`401 Unauthorized` / diarization modeli inemiyor**
`pyannote/speaker-diarization-community-1` sayfasındaki kullanım şartlarını
kabul ettiğinden emin ol (adım 2, yukarıda).

**`ffmpeg bulunamadı`**
`brew install ffmpeg` (macOS) veya `sudo apt install ffmpeg` (Ubuntu/Debian).
