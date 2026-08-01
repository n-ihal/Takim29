import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

def generate_mindmap_json(transcript_text: str, target_language: str = "Turkish"):
    if not api_key:
        print("HATA: GEMINI_API_KEY bulunamadı!")
        return None

    models_to_try = [
        "gemini-2.5-flash",
        "gemini-3-flash-preview",
        "gemini-3.6-flash"
    ]

    prompt = f"""
    Aşağıdaki toplantı/kayıt transkriptini analiz et. Hem etkileşimli zihin haritası için düğümleri/ilişkileri oluştur, hem de genel bir toplantı özeti, eylem maddelerini ve toplantının genel duygu durumunu (tone/sentiment) tespit et.
    ÖNEMLİ KURAL: Çıktıdaki tüm metinler, başlıklar, özetler, görevler ve duygu durumu KESİNLİKLE şu dilde olmalıdır: {target_language}.
    Çıktı KESİNLİKLE sadece saf bir JSON olmalıdır. Markdown blokları (```json gibi) veya ekstra açıklama yazma.
    Şuna birebir uymalıdır:
    {{
        "executive_summary": "Toplantının genel yönetim özeti (2-3 cümle, {target_language} dilinde)",
        "sentiment": "Toplantının genel atmosferi/duygu durumu (Örn: Pozitif, Yapıcı, Stratejik, Gergin vb. - {target_language} dilinde tek kelime veya kısa ifade)",
        "action_items": [
            {{
                "task": "Yapılacak iş tanımı ({target_language} dilinde)",
                "assignee": "Sorumlu kişi (Eğer belli değilse 'Ekip')",
                "due_date": "Belirtildiyse tarih veya 'Belirtilmedi'"
            }}
        ],
        "nodes": [
            {{
                "id": "benzersiz_id", 
                "label": "Düğümün Kısa Adı ({target_language} dilinde)", 
                "type": "main", 
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
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"

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