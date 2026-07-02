# Audio2MindMap — Proje Geliştirme Yol Haritası

Bu doküman README.md'den bağımsızdır. Aşağıdaki maddeler doğrudan bir todo app'e (Notion, Todoist, Trello vb.) kopyalanabilecek şekilde `- [ ]` formatında, fazlara bölünerek hazırlanmıştır.

---

## Faz 0 — Kurulum & Planlama

- [ ] Takım rollerini netleştir (Product Owner, Scrum Master, Developer'lar)
- [ ] Tech stack kararını ver (frontend, backend, veritabanı, STT servisi, LLM sağlayıcısı)
- [ ] GitHub reposunu oluştur ve README.md'yi ekle
- [ ] Product Backlog board'unu (Miro) story'lerle doldur
- [ ] Gerekli API key'leri edin (Speech-to-Text servisi, LLM API)
- [ ] Proje klasör yapısını (frontend/backend) oluştur
- [ ] Sprint takvimini ve Daily Scrum saatini belirle

## Faz 1 — Ses Girişi & Speech-to-Text Altyapısı

- [ ] Ses dosyası yükleme (upload) arayüzünü tasarla
- [ ] Desteklenecek ses formatlarını ve maksimum süre/boyut limitini belirle
- [ ] Speech-to-Text servisini seç ve entegre et (ör. Whisper, Google STT, Azure Speech)
- [ ] Transkript çıktısını zaman damgalı (timestamp'li) segmentler halinde sakla
- [ ] "Sesi metne döküyorum..." gibi işlem durumu bildirimlerini gösteren UI akışını kur
- [ ] Uzun kayıtlar için arka planda işleme (async job/queue) mekanizması kur

## Faz 2 — LLM Analiz Motoru

- [ ] Transkripti LLM'e gönderecek prompt/pipeline tasarımını yap
- [ ] Ana konuları ve alt başlıkları çıkaran analiz adımını geliştir
- [ ] Aksiyon öğesi tespiti (ör. "Ahmet bu raporu hazırlasın" gibi cümleleri yakalama) için ayrı bir analiz adımı ekle
- [ ] Analiz çıktısını node/edge (düğüm/kenar) JSON şemasına dönüştür
- [ ] Her düğüme kısa özet metni ve ilgili zaman aralığını (dakika:saniye) bağla
- [ ] Aksiyon öğelerini farklı bir düğüm tipi/rengi olarak işaretle

## Faz 3 — Backend & Veri Modeli

- [ ] Toplantı/kayıt, transkript, node ve edge için veritabanı şemasını tasarla
- [ ] Ses yükleme, transkript alma ve harita verisi çekme için API endpoint'lerini geliştir
- [ ] Kullanıcı bazlı geçmiş kayıtları listeleme endpoint'ini ekle
- [ ] Analiz sonucu JSON'unu frontend'in tüketebileceği formatta serialize et
- [ ] Hata durumları için (STT başarısız, LLM timeout vb.) uygun API yanıtlarını tanımla

## Faz 4 — Görselleştirme (Frontend Graph)

- [ ] Network/graph görselleştirme kütüphanesini seç (ör. D3.js, react-force-graph, Cytoscape.js)
- [ ] Gravity/fizik motorlu düğüm yerleşimini (force-directed layout) uygula
- [ ] Ana gündem maddelerini büyük/merkezi düğüm, alt detayları küçük uydu düğüm olarak render et
- [ ] Düğüm renklerini kategoriye göre ayır (ör. aksiyon öğeleri kırmızı)
- [ ] Grafiği zoom/pan ile gezinilebilir hale getir

## Faz 5 — Etkileşimli Keşif

- [ ] Bir düğüme tıklandığında sağda açılan detay panelini geliştir
- [ ] Detay panelinde kısa özet ve konuşulduğu zaman aralığını göster
- [ ] Zaman aralığına tıklayınca orijinal ses kaydının o saniyesinden oynatma özelliğini ekle
- [ ] Panel içinde ilgili düğümün bağlı olduğu diğer düğümlere hızlı geçiş linki ekle

## Faz 6 — Dışa Aktarma

- [ ] Zihin haritasını PNG olarak indirme özelliğini ekle
- [ ] Zihin haritasını Miro/Notion/draw.io uyumlu JSON formatında dışa aktarma özelliğini ekle
- [ ] Dışa aktarma sırasında düğüm/kenar meta verilerinin (özet, zaman damgası) korunduğunu doğrula

## Faz 7 — Test, Cilalama & Sunum

- [ ] Uçtan uca akışı (ses yükle → transkript → analiz → harita) test et
- [ ] Hatalı/düşük kaliteli ses kaydı senaryolarını test et
- [ ] Uzun (45+ dakika) kayıtlarla performans testi yap
- [ ] UI/UX cilalama (loading state'ler, boş durumlar, hata mesajları)
- [ ] Demo senaryosu ve sunum akışını hazırla
- [ ] Elevator pitch ve tanıtım materyallerini son haline getir
