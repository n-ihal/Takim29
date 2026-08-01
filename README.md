# **Takım İsmi**

[Takım 29]

# Ürün İle İlgili Bilgiler

## Takım Elemanları

- **Ahmet Furkan Yorulmaz**: Product Owner
- **Nihal Yılmaz**: Scrum Master
- **Kadir Kırmızıyüz**: Developer
- **Sena Şen**: Developer

## Ürün İsmi

--Vocalyze--

## Ürün Açıklaması

Audio2MindMap, kurumların ve bireylerin sesli iletişimlerinden maksimum değeri elde etmesini sağlayan, üretken yapay zeka destekli bir analitik ve görselleştirme platformudur. Uzun ve yorucu toplantı ses kayıtlarını, saniyeler içinde etkileşimli, okunabilir ve aksiyona dönüştürülebilir görsel zihin haritalarına çevirir.

Ürün; metin yorgunluğu (uzun, düz PDF dökümlerin okunmaması), toplantı amnezisi (kararların ve görev sahiplerinin unutulması) ve bağlam kopukluğu (fikirler arası ilişkilerin düz metinde görünmemesi) gibi modern iş ve eğitim hayatının temel sorunlarına çözüm sunar.

## Ürün Özellikleri

- Ses kaydını otomatik olarak metne dönüştürme (Speech-to-Text)
- LLM ile ana fikirleri ve alt konuları analiz ederek kavramsal harita çıkarma
- Fizik motorlu (gravity-based), etkileşimli network/zihin haritası görselleştirmesi
- Aksiyon Öğeleri (Action Items) düğümü: LLM'in tespit ettiği görevleri ayrı ve renkli bir düğümde toplama
- Zaman Damgası (Timestamp) entegrasyonu: bir düğüme tıklandığında toplantının ilgili anına referans verme
- Dışa Aktarma: haritanın PNG veya Miro/Notion/draw.io uyumlu JSON formatında indirilmesi
- Düğüme tıklandığında açılan detay panelinde kısa özet ve konuşulduğu zaman aralığının gösterilmesi

## Hedef Kitle

- Çevik (Agile) yazılım ekipleri — sprint planlama ve retrospektif toplantı analizleri için
- Ürün yöneticileri ve satış ekipleri — müşteri görüşmelerini (user discovery, sales calls) haritalandırmak için
- Araştırmacılar, gazeteciler ve öğrenciler — uzun röportaj/ders kayıtlarını çalışılabilir kavram haritalarına dönüştürmek için

## Product Backlog URL

[Miro Backlog Board](https://miro.com/welcomeonboard/RFdiU1VpMmhUbCtiOFdsMit2NzNiQ3cyTjZzTXF5UDgxazIycVFmRm5lbSszcHNnMS9RNVdaRC92ZGFFTUtybWltdGVidmZ4K3ZadnNxdVBHaXVBRGorbk5ndG4ycnhyL2h3Q0xFVE9ZUHJ3YzE1TkREZC9ETlNKR1ZpcVR0L3hNakdSWkpBejJWRjJhRnhhb1UwcS9BPT0hdjE=?share_link_id=861176753230)

---

# Sprint 1

- **Backlog düzeni ve Story seçimleri**: Backlog'umuz öncelik sırasına göre düzenlenmiştir; ilk sprint için proje altyapısının kurulması, ses kaydı yükleme akışı ve Speech-to-Text entegrasyonu gibi temel story'ler seçilmiştir. Sprint başına tahmin edilen puan sayısını aşmayacak şekilde, toplam puanın yarısını geçmeyen tahminlerle story seçimi yapılmıştır. Seçilen story'ler yapılacak işlere (task'lere) bölünerek Miro board üzerinde takip edilmektedir; kırmızı item'lar task'leri, mavi item'lar ise story'leri temsil etmektedir.

- **Daily Scrum**: Daily Scrum toplantılarının ekip üyelerinin farklı programlara sahip olması nedeniyle zamansal sebeplerden ötürü Slack üzerinden yazılı olarak yapılmasına karar verilmiştir. Her ekip üyesi gün içinde yaptığı işi, bir sonraki gün yapmayı planladığı işi ve varsa karşılaştığı engelleri paylaşmaktadır. [Daily Scrum yazışma örnekleri/notları buraya eklenecek]

- **Sprint board update**:

  ![Sprint 1 akış diyagramı](assets/screenshots/sprint1-akis-diyagrami.png)

  ![Sprint 1 Kanban board](assets/screenshots/sprint1-kanban-board.jpg)

  ![Sprint 1 burndown chart](assets/screenshots/sprint1-burndown-chart.jpg)

- **Ürün Durumu**:

  ![Vocalyze genel bakış](assets/screenshots/urun-genel-bakis.png)

  ![Vocalyze dashboard ve zihin haritası](assets/screenshots/urun-dashboard-mindmap.png)

- **Sprint Review**: Proje henüz en başlangıç aşamasında olduğu için bu sprintte odak, ürünün üzerine inşa edileceği teknik altyapı kararlarının netleştirilmesi olmuştur. Ekip bir araya gelerek aşağıdaki teknoloji kararlarını almıştır:
  - Ses kaydını metne dönüştürme (Speech-to-Text) için **Whisper** kullanılmasına karar verilmiştir.
  - Backend tarafında, Whisper ile doğal uyumu ve API geliştirme hızı sebebiyle **Python / FastAPI** kullanılmasına karar verilmiştir.
  - Frontend tarafında **React.js (Next.js)** ile geliştirme yapılmasına karar verilmiştir.
  - LLM destekli kavramsal analiz (ana fikir/alt konu/aksiyon öğesi çıkarımı) için bir **LLM API** (OpenAI / Anthropic) entegre edilmesine karar verilmiştir.
  - Fizik motorlu (gravity-based) etkileşimli zihin haritası görselleştirmesi için **D3.js force-directed layout / react-force-graph** kütüphanesinin kullanılmasına karar verilmiştir.
  - Ses dosyalarının asenkron işlenmesi (yükleme → transkript → analiz akışı) için **Celery + Redis** tabanlı bir iş kuyruğu; verilerin saklanması için **PostgreSQL** kullanılmasına karar verilmiştir.

  Bu kararlar doğrultusunda web sitesinin temel altyapısı atılmaya başlanmıştır: proje repo yapısı, backend ve frontend iskeletleri oluşturulmuş, seçilen teknolojilerin proje ortamına kurulumu tamamlanmıştır. Henüz uçtan uca çalışan bir akış bulunmamaktadır; bir sonraki sprintte ses yükleme ve Whisper entegrasyonunun hayata geçirilmesi hedeflenmektedir. Sprint Review katılımcıları: Ahmet Furkan Yorulmaz, Nihal Yılmaz, Kadir Kırmızıyüz, Sena Şen

- **Sprint Retrospective:**
  - Projenin başlangıç aşamasında olması sebebiyle bu sprintin büyük kısmının teknoloji araştırması ve karar alma sürecine ayrıldığı, bunun bir sonraki sprintte geliştirmeye ayrılacak süreyi azaltmaması için erken davranılması gerektiği konusunda fikir birliğine varılmıştır
  - Görev dağılımının sprint başında daha net yapılması gerektiği konusunda fikir birliğine varılmıştır
  - Seçilen teknoloji stack'inin (Whisper, FastAPI, React/Next.js, D3.js force-directed graph, LLM API, Celery/Redis, PostgreSQL) ekip üyelerince benimsendiği, bir sonraki sprintte bu altyapı üzerine ilk çalışan prototipin (ses yükleme + Whisper transkripti) hedeflenmesi gerektiği kararlaştırılmıştır
  - Tahmin puanlarının gerçekçi olup olmadığı, sprint planlama toplantılarında developer'lardan alınan geri bildirimlerle birlikte daha detaylı gözden geçirilmelidir

---

- **Takım İçi İletişim ve Süreç Takibi**:

![Toplanti](assets/screenshots/Toplanti.png)

![Fikir-tartismasi](assets/screenshots/Fikir-tartismasi.png)

![Ozet-Scrum-toplantisi](assets/screenshots/Ozet-Scrum-toplantisi.png)

# Sprint 2

Sprint 2 Hedefi
Kullanıcıların ses dosyalarını platforma yükleyebildiği, arka planda asenkron iş kuyruğu (Celery/Redis) aracılığıyla Whisper kullanılarak metne dönüştürüldüğü uçtan uca (end-to-end) akışı tamamlamak.

User Story 1: Ses Dosyası Yükleme Akışı
Story: Bir kullanıcı olarak, toplantı ses kaydımı sisteme yükleyebilmek istiyorum ki sistem bu kaydı analiz edebilsin.

Kabul Kriterleri (Acceptance Criteria):

Kullanıcı; .mp3, .wav veya .m4a formatındaki dosyaları yükleyebilmelidir.

Yüklenen dosya boyutu için bir sınır belirlenmelidir (Örn: Maksimum 50 MB).

Desteklenmeyen dosya formatlarında veya boyut aşımında kullanıcıya anlaşılır bir hata mesajı gösterilmelidir.

Yükleme sırasında ekranda "Yükleniyor..." (Loading/Progress) animasyonu bulunmalıdır.

Teknik Görevler (Tasks):

Frontend (Next.js): Sürükle-bırak (drag & drop) veya dosya seçici buton barındıran yükleme arayüzünün tasarlanması ve geliştirilmesi.

Frontend (Next.js): Dosya seçimi sonrası format ve boyut validasyonlarının (validation) client-side tarafında yapılması.

Backend (FastAPI): /api/upload endpoint'inin oluşturulması.

Backend (FastAPI): Gelen dosyanın backend tarafında (server-side) doğrulanması ve sunucunun geçici belleğine/klasörüne kaydedilmesi.

User Story 2: Asenkron Transkripsiyon Altyapısı (Celery & Whisper)
Story: Bir sistem olarak, büyük boyutlu ses dosyalarını arka planda asenkron olarak işlemek istiyorum ki kullanıcının tarayıcısı işlem bitene kadar donmasın veya zaman aşımına (timeout) uğramasın.

Kabul Kriterleri (Acceptance Criteria):

Ses dosyası yüklendikten sonra, transkripsiyon işlemi bir iş kuyruğuna (message broker) aktarılmalıdır.

Whisper modeli, kuyruktaki işi alıp metne dönüştürme işlemini başarılı bir şekilde tamamlamalıdır.

İşlemin durumu "Bekliyor (Pending)", "İşleniyor (Processing)" ve "Tamamlandı (Completed) / Hatalı (Failed)" olarak takip edilebilmelidir.

Teknik Görevler (Tasks):

Backend: Celery worker konfigürasyonunun yapılması ve Redis bağlantısının kurulması.

Backend: OpenAI Whisper modelinin (veya API'sinin) projeye entegre edilmesi.

Backend: Celery üzerinde çalışacak transcribe_audio_task isimli asenkron fonksiyonun yazılması.

Veritabanı (PostgreSQL): Yüklenen dosyanın metadata (isim, yüklenme tarihi, durum) bilgilerinin ve işlem bittiğinde ortaya çıkan metnin veritabanına kaydedilmesi.

User Story 3: Transkript Sonucunun Görüntülenmesi
Story: Bir kullanıcı olarak, yüklediğim ses dosyasının metne dönüştürülmüş halini ekranda görmek istiyorum ki toplantıda neler konuşulduğunu okuyabileyim.

Kabul Kriterleri (Acceptance Criteria):

Dosya "İşleniyor" durumundayken ekranda sürecin devam ettiğini belirten bir UI olmalıdır.

İşlem bittiğinde, sayfayı yenilemeye gerek kalmadan Whisper'dan dönen saf metin ekranda gösterilmelidir.

Teknik Görevler (Tasks):

Backend (FastAPI): Frontend'in işlemin durumunu sorgulayabileceği /api/task/{task_id}/status endpoint'inin geliştirilmesi.

Frontend (Next.js): Polling mekanizması kurularak (örneğin her 3 saniyede bir) ilgili task'in durumunun sorgulanması. (Not: İleride WebSockets'e geçirilebilir, ancak Sprint 2 için polling daha hızlı bir çözümdür).

Frontend (Next.js): Gelen metnin arayüzde okunabilir bir şekilde render edilmesi.

Sprint 2 
Kodlama Görselleri
<img width="720" height="603" alt="ekran_resmi_2026-07-19_17 35 47_720" src="https://github.com/user-attachments/assets/2fd4c30d-6a08-4e85-a39d-bfef668505d8" />

<img width="720" height="593" alt="ekran_resmi_2026-07-19_17 37 43_720" src="https://github.com/user-attachments/assets/b94dba4b-9594-4c32-8cbc-ab186554c76f" />
<img width="720" height="432" alt="ekran_resmi_2026-07-19_17 37 03_720" src="https://github.com/user-attachments/assets/a186ffee-492f-4319-8707-2219b307080c" />
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<img width="1782" height="1359" alt="image" src="https://github.com/user-attachments/assets/92a2f1f6-b56c-41c8-9bd8-5872c6b33007" />
<img width="2615" height="1190" alt="image" src="https://github.com/user-attachments/assets/1e43ded2-8a8a-40fd-a6d6-61bc163c8ee6" />

Takım Konuşmaları
<img width="2470" height="1856" alt="image" src="https://github.com/user-attachments/assets/e6839469-008d-4f37-9102-8bb4d753bd21" />
<img width="846" height="507" alt="image" src="https://github.com/user-attachments/assets/8f520a20-210e-471c-aaef-95f861fd7523" />
<img width="828" height="508" alt="image" src="https://github.com/user-attachments/assets/eeff4bec-66f3-4a7f-a7bb-7a68d4a27caa" />
<img width="1085" height="512" alt="image" src="https://github.com/user-attachments/assets/2ece5212-3718-402e-9799-f961236adfe0" />
<img width="612" height="507" alt="image" src="https://github.com/user-attachments/assets/17412d79-69f0-4af4-939b-998c59b00d3a" />
<img width="402" height="280" alt="image" src="https://github.com/user-attachments/assets/2e66a9e3-1ef7-4bc0-9922-25bd402a1dea" />

# Sprint 3

Değerli Ekip Arkadaşlarım ve Proje Paydaşları,

Takım 29 olarak geliştirmekte olduğumuz Vocalyze (AI Audio Mapper) projemizin 3. Sprint'ini büyük bir başarıyla tamamlamış bulunuyoruz. Bu sprint boyunca temel amacımız, sistemin kalbini oluşturan yapay zeka entegrasyonlarını tamamlamak, kullanıcı arayüzünü (UI) etkileşimli hale getirmek ve backend ile frontend arasındaki veri akışını kusursuzlaştırmaktı.

İşte bu sprintte hayata geçirdiğimiz kritik özellikler ve teknik başarılarımız:

✨ Öne Çıkan Yeni Özellikler
Etkileşimli Zihin Haritası (Interactive Mind Map): Kullanıcıların yüklediği ses kayıtlarını analiz ederek React Flow altyapısı ile dinamik, sürüklenebilir ve dışa aktarılabilir (PNG/JSON) zihin haritaları oluşturmayı başardık.

Çoklu Dil Desteği (Multi-Language Output): Gemini AI entegrasyonumuzu güncelleyerek, çıktılarımızın (Özet, Harita Düğümleri, Aksiyon Maddeleri) kullanıcının seçtiği hedef dilde (Türkçe, İngilizce, Almanca, Fransızca) dinamik olarak üretilmesini sağladık.

Ses Tonu ve Duygu Analizi (Sentiment Analysis): Toplantının veya ses kaydının genel atmosferini yapay zeka ile analiz edip, arayüzümüze şık bir "Tone Badge" (Duygu Durumu Rozeti) olarak entegre ettik.

Akıllı Görev Çıkarımı (Action Items): Ses kayıtlarından çıkarılan yapılacaklar listesini, sorumlu kişi ve tarih bilgileriyle birlikte arayüzde listelenebilir hale getirdik.

Entegrasyonlar Paneli (Tech Stack): Projemizin gücünü aldığı mimariyi (FastAPI, Supabase, Next.js, Gemini, React Flow) sergileyen profesyonel bir "Integrations" sayfası tasarlandı.

🛠️ Teknik İyileştirmeler ve Çözülen Sorunlar (Bug Fixes)
Sadece yeni özellikler eklemekle kalmadık, aynı zamanda sistemin kararlılığını artıracak çok önemli yapısal sorunları da çözdük:

Frontend-Backend DTO Senkronizasyonu: FastAPI (snake_case) ile Next.js (camelCase) arasındaki veri modeli uyuşmazlıklarını giderdik. Projeler sayfasındaki harita, üye ve tarih verilerinin arayüze %100 doğrulukla ve güvenli bir şekilde (Number() ve String() dönüşümleriyle) yansımasını sağladık.

LLM Bağlantı Optimizasyonu: requests kütüphanesinin URL yorumlama hataları f-string anlık formatlama yöntemiyle çözülerek, yapay zeka motorunun (Gemini 3 Flash) kesintisiz yanıt vermesi garanti altına alındı.

UI/UX Refactoring: Arayüzdeki iç içe geçmiş (duplicate) komponent hataları temizlendi ve projeler sayfasındaki grid mimarisi optimize edildi.

🎯 Sonuç
Sprint 3'ün sonunda Vocalyze, artık sadece bir ses-metin dönüştürücü değil; sesi anlayan, özetleyen, görevlere bölen ve görselleştiren tam kapsamlı bir yapay zeka asistanı haline gelmiştir. Backend ve Frontend arasındaki sağlam köprüler kurulmuş, projenin canlıya alınması yolunda en büyük teknik engeller aşılmıştır.

Emeği geçen herkese teşekkürler!

<img width="1044" height="1127" alt="1000002952" src="https://github.com/user-attachments/assets/0a2eea57-4db7-42e6-bd0b-5166bd2b60a5" />
<img width="1521" height="692" alt="bootcamp1" src="https://github.com/user-attachments/assets/693fb842-819d-4c39-8726-f9da71177e58" />
<img width="1507" height="692" alt="bootcamp2" src="https://github.com/user-attachments/assets/390534ec-1452-47cd-a153-0a4988b2e8de" />
<img width="1512" height="697" alt="bootcamp3" src="https://github.com/user-attachments/assets/20c8be0c-e0a4-4cdc-8662-93d3a56229e5" />
<img width="1517" height="691" alt="bootcamp4" src="https://github.com/user-attachments/assets/40531a2b-cf9b-4577-b953-141faca1990d" />
<img width="1512" height="692" alt="bootcamp5" src="https://github.com/user-attachments/assets/b1b8510e-94fc-4073-bb1f-db7b31eddfe3" />
<img width="3160" height="1860" alt="1000002948" src="https://github.com/user-attachments/assets/c2a231b1-b7a5-4c7f-b8df-c2abb2028b2b" />
<img width="2996" height="1741" alt="1000002947" src="https://github.com/user-attachments/assets/58e0a519-159e-4676-a0af-f735ef2497f2" />
<img width="1024" height="580" alt="1000002946_1024" src="https://github.com/user-attachments/assets/13db107f-8d42-492e-a718-2934fd10d783" />
<img width="3035" height="1695" alt="1000002945" src="https://github.com/user-attachments/assets/f611350c-de18-4e55-aa1f-6230e2d9973a" />
<img width="1866" height="1097" alt="1000002951" src="https://github.com/user-attachments/assets/4dbf0f7b-08e3-42c3-abbf-7bda6725860f" />
<img width="1591" height="1144" alt="1000002950" src="https://github.com/user-attachments/assets/2a0bc253-090f-41d7-b84f-05bb2478f48e" />





