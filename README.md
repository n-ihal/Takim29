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

# Sprint 2

---

# Sprint 3

---
