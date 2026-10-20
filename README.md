# Nasse Biology (v2)

11. sınıf Biyoloji "1.5. Duyu Reseptörleri ve Duyu Organları" slaytlarına göre hazırlanmış interaktif site.
Saf HTML/CSS/JS: derleme gerekmez, GitHub Pages'te doğrudan çalışır.

## Dosyalar (hepsi AYNI klasöre konmalı)
index.html, style.css, data.js, models3d.js, sims.js, games.js, app.js, lab-meta.js
**ve lab/ klasörü** (klasör adı aynen kalmalı): lab/bridge.js, lab/viewer3d.js, lab/m3d.js, lab/models1.js, lab/models2.js, lab/bilgi.js

## Yayınlama (GitHub Pages)
1. Dosyaları repo köküne yükle (mevcut eski dosyaları silip yerine koy).
2. Settings > Pages > Branch: main / root.
3. Birkaç dakika sonra https://KULLANICI.github.io/REPO/ açılır.
Yerelde denemek için VS Code "Live Server" kullan (3B modeller ve fontlar internet ister: three.js ve Google Fonts CDN).

## Giriş
Giriş (Google/Firebase) bölümü kaldırıldı. İlerleme (XP, rozet) cihazda saklanır.

## Ne değişti
- Bağlam temelli sorular yenilendi (18 senaryo, 2 bölümlü yazılı cevap, model cevap + tolerans).
- Beynin bölümleri kaldırıldı.
- 3B modeller: göz, kulak, burun, dil, deri, nöron, sinaps (tıkla-bilgi kartı, döndür, yakınlaştır, dokunmatik).
- Ayrı "Konu Anlatımı" bölümü (Maarif: Merak Et > Öğren > Bağ Kur > Becerini Dene) 11 konu.
- Slayt kapsamı: uyaran/reseptör sınıflandırma, duyu organı-reseptör tablosu, hayvan örnekleri, nöron yapısı,
  eşik değer, ya hep ya hiç, merdiven etkisi, uyartı sıklığı, zar potansiyeli, sinaps, seçici direnç, göz-kamera/kulak-mikrofon.
- 4 simülasyon (her birinde önce görev, sonra gözlem sorusu), 5 oyun, 40 soruluk soru bankası.

## İçerik düzenleme
Konular, sorular ve bağlam soruları data.js içindedir. Bağlam sorusu cevap anahtarı: parts[].a listesi
(normalize edilir; "kelime1+kelime2" yazımında ikisi de geçmelidir).

## SlideLab + lloga birleşimi (3B modeller)
lloga sitesindeki 3B modeller SlideLab'a eklendi; SlideLab'ın hiçbir bölümü, sayfası veya modeli çıkarılmadı.
- **3B Modeller** sekmesi artık 17 modelden oluşur: SlideLab'ın 7 modeli (göz, kulak, burun, dil, deri, nöron, sinaps) + lloga'dan 10 yeni model
  (hayvan hücresi, mitokondri, ATP, reseptör çeşitleri, refleks yayı, beyin, omurilik kesiti, glia, nörotransmitterler, zar potansiyeli).
- **Nöron ve sinaps** SlideLab'da zaten vardı. Bu iki sekmede "Temel model" (SlideLab'ın kendi modeli) ile "Ayrıntılı model" (lloga: dendrit ağacı,
  akson tepeciği, miyelinli/miyelinsiz iletim, adım adım sinaps) arasında geçiş yapılır.
- Yeni modellerin hepsi SlideLab düzenine uydurulmuştur: görev → model (parçalara tıkla, bilgi kartı, parça düğmeleri) → gözlem sorusu (XP verir).
- Beyin, glia ve nörotransmitter modelleri 11. sınıf duyu reseptörleri kazanımının dışındadır; sekmelerde "Ek model" notuyla işaretlenmiştir.
- lloga modelleri Three.js r160 ile çalışır ve yalnızca bir ek modele girilince yüklenir (SlideLab'ın kendi modelleri r128 ile aynen çalışır).
  Bu yüzden 3B için güncel bir tarayıcı gerekir (iPhone'da iOS 16.4+), ve site GitHub Pages / Live Server gibi bir sunucudan açılmalıdır (dosyaya çift tıklayarak değil).
- Yeni bir lloga modeli eklemek için: lab/models1.js veya lab/models2.js içine sahneyi yaz, lab/bridge.js içindeki YAPICI listesine ekle, lab/bilgi.js içine bilgi kartlarını koy, lab-meta.js içine görev ve soruyu ekle.
