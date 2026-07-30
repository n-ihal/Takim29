# Çalıştırma Adımları — Ses Transkripsiyon Modülü

Bu doküman, `backend/app/transcription` modülünü kullanarak bir ses/video
dosyasını zaman ve kişi damgalı metne çevirme adımlarını anlatır.

---

## 1. Ön hazırlık (bir kere yapılır)

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -r requirements.txt
```

`.env` dosyasını oluştur (HuggingFace token gerekli — diarization/konuşmacı
ayrımı için):

```bash
cp .env.example .env
# .env içine HUGGINGFACE_TOKEN=hf_xxxxxxxxxxxx yapıştır
```

Token nasıl alınır, detaylar: `backend/README.md`.

---

## 2. Her çalıştırmadan önce (yeni terminal açtığında)

```bash
cd /Users/ahmetfurkanyorulmaz/Documents/GitHub/Takim29/backend
source .venv/bin/activate
```

Prompt başında `(.venv)` görünmeli.

---

## 3. Transkripti oluştur

### Yöntem A — Hazır script (`run_transcribe.sh`)

Dosya adını komutun sonuna ekleyerek çalıştır:

```bash
./run_transcribe.sh ../video1.mp3
```

Model belirtmek istersen (varsayılan: `large-v3-turbo`, hızlı ama biraz daha
az doğru):

```bash
./run_transcribe.sh ../video1.mp3 large-v3
```

Çıktılar otomatik olarak `transkriptler/` klasörüne, numaralanarak yazılır —
her çalıştırmada üzerine yazmaz:

```
transkriptler/transkript-1.json
transkriptler/transkript-1.txt
transkriptler/transkript-2.json
transkriptler/transkript-2.txt
...
```

### Yöntem B — CLI'yi doğrudan çalıştırmak

```bash
python -m app.transcription.cli ../video1.mp3 -o ../cikti.json --model large-v3-turbo
```

Konuşmacı sayısı biliniyorsa ipucu vererek doğruluğu artırabilirsin:

```bash
python -m app.transcription.cli ../video1.mp3 -o ../cikti.json --min-speakers 2 --max-speakers 4
```

Yardım için:

```bash
python -m app.transcription.cli --help
```

---

## 4. JSON çıktısını okunur .txt'ye çevirmek

(`run_transcribe.sh` bunu otomatik yapıyor; ayrı bir dosya için elle
çalıştırmak istersen:)

```bash
python json_to_txt.py ../cikti.json -o ../cikti.txt
```

Çıktı formatı, satır satır zaman + kişi damgalı:

```
[00:00:00 - 00:00:04] Kişi 1: metin...
[00:00:05 - 00:00:10] Kişi 2: metin...
```

---

## 5. Model seçimi

| Model              | Hız        | Doğruluk | Not                                  |
| ------------------ | ---------- | -------- | ------------------------------------- |
| `large-v3`          | Yavaş      | En yüksek | Varsayılan (CLI'de belirtilmezse)     |
| `large-v3-turbo`    | ~4x hızlı  | Biraz düşük | `run_transcribe.sh` varsayılanı    |

16 dakikalık bir kayıt için tahmini süre: `large-v3` ~15-20 dk,
`large-v3-turbo` ~3-5 dk (CPU üzerinde, ilk çalıştırmada model indirme
süresi hariç).

---

## 6. Olası sorunlar

**`command not found: python`**
venv aktif değil. `source .venv/bin/activate` çalıştırdığından emin ol.

**`RuntimeError: HUGGINGFACE_TOKEN bulunamadı`**
`.env` dosyasını oluşturduğundan ve geçerli bir token yazdığından emin ol.

**`ffmpeg bulunamadı`**
`brew install ffmpeg` (macOS).

Diğer detaylar için: `backend/README.md`.
