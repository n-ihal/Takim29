# --- Dosya: backend/app/llm_engine.py ---
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

def generate_mindmap_json(transcript_text: str):
    if not api_key:
        print("HATA: GEMINI_API_KEY bulunamadı!")
        return None

    models_to_try = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3-flash-preview",
    "gemini-3.6-flash"
]

    prompt = f"""
    Aşağıdaki toplantı/kayıt transkriptini analiz et ve bir etkileşimli zihin haritası (mind map) oluşturmak için uygun bir JSON çıktısı üret. 
    Analiz ederken ana konuları, alt başlıkları ve özellikle eylem maddelerini (action items) tespit et.
    Çıktı KESİNLİKLE sadece saf bir JSON olmalıdır. Markdown blokları (```json gibi) veya ekstra açıklama yazma.
    Şuna birebir uymalıdır:
    {{
        "nodes": [
            {{
                "id": "benzersiz_id", 
                "label": "Düğümün Kısa Adı", 
                "type": "main" | "sub" | "action", 
                "summary": "İlgili kısmın 1-2 cümlelik özeti", 
                "timestamp": "00:00:00 - 00:00:00"
            }}
        ],
        "edges": [
            {{
                "from": "kaynak_dugum_id", 
                "to": "hedef_dugum_id"
            }}
        ]
    }}
    Transkript:
    {transcript_text}
    """

    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }

    response_data = None
    success = False

    for model_name in models_to_try:
        # Düzeltilmiş, temiz URL birleştirme (Markdown link formatı kaldırıldı)
        url = "https://generativelanguage.googleapis.com/v1beta/models/" + model_name + ":generateContent?key=" + api_key

        try:
            print(f"Model deneniyor: {model_name}...")
            response = requests.post(url, headers=headers, json=payload)

            if response.status_code == 200:
                response_data = response.json()
                success = True
                print("Başarılı yanıt alındı.")
                break
            else:
                print(f"Atlanıyor ({model_name}): {response.status_code} - {response.text[:100]}")
        except Exception as e:
            print(f"Bağlantı hatası ({model_name}): {e}")

    if not success or not response_data:
        print("HATA: Hiçbir model yanıt vermedi.")
        return None

    try:
        text_response = response_data['candidates'][0]['content']['parts'][0]['text'].strip()

        if text_response.startswith("```"):
            lines = text_response.split("```")
            if len(lines) > 1:
                text_response = lines[1]
                if text_response.startswith("json"):
                    text_response = text_response[4:]
                text_response = text_response.strip()

        mindmap_data = json.loads(text_response)
        return mindmap_data

    except Exception as e:
        print(f"JSON Ayrıştırma Hatası: {e}")
        return None