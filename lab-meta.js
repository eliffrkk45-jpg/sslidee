/* Nasse Biology — "lloga" sitesinden gelen 3B modellerin tanıtımı.
   Modellerin kendisi lab/ klasöründedir (Three.js r160, ayrı modül olarak, yalnızca bir modele girilince yüklenir).
   Burada her model için sekme adı, görev ve gözlem sorusu tanımlanır; böylece SlideLab'ın görev → model → soru düzeni korunur. */
(function () {
  const add = (key, def) => { if (!M3[key]) M3[key] = Object.assign({ lab: key }, def); };

  /* Nöron ve sinaps SlideLab'da zaten vardı: yerlerinde kalıyor, yanlarına "Ayrıntılı model" (lloga) seçeneği ekleniyor. */
  if (M3.noron) M3.noron.detail = 'noron';
  if (M3.sinaps) M3.sinaps.detail = 'sinaps';

  add('hucre', {
    title: 'Hayvan hücresi', ico: '🧫', tag: '9. sınıf · Hücre ve organeller',
    task: 'Hücre zarını gizle, sonra organelleri tek tek tıkla. Mitokondri, çekirdek ve granüllü endoplazmik retikulumun görevini not al. Hangi organelin nöronda çok sayıda bulunması gerektiğini düşün.',
    q: { q: 'Hücrede ATP üretiminin (hücresel solunum) yapıldığı organel hangisidir?', o: ['Golgi aygıtı', 'Mitokondri', 'Lizozom', 'Ribozom'], a: 1, e: 'Mitokondri hücresel solunumun yapıldığı ve ATP üretilen organeldir. Enerji ihtiyacı yüksek olan nöronlarda çok sayıda bulunur.' }
  });

  add('mitokondri', {
    title: 'Mitokondri', ico: '⚡', tag: '10. sınıf · Hücresel enerji',
    task: '“ATP üret” düğmesine bas ve iç zardaki ATP sentazın döndüğünü izle. Dış zar, iç zar, krista ve matriksi tıkla. ATP’nin hangi zarda üretildiğini yaz.',
    q: { q: 'Mitokondride ATP sentaz enzimi hangi yapıda bulunur?', o: ['Dış zar', 'İç zar', 'Sitoplazma', 'Çekirdek zarı'], a: 1, e: 'ATP sentaz mitokondrinin iç zarında bulunur. İç zarın kıvrımları (krista) yüzeyi artırır; elektron taşıma sistemi de aynı zarda yer alır.' }
  });

  add('atp', {
    title: 'ATP molekülü', ico: '🔋', tag: '10. sınıf · Hücresel enerji',
    task: 'ATP’nin üç parçasını (adenin, riboz, fosfat) tıkla. “ATP → ADP + Pi” düğmesiyle son fosfatı kopar ve enerjinin açığa çıktığı bağı bul. Sonra ADP + Pi’den ATP’nin yeniden oluşmasını izle.',
    q: { q: 'ATP molekülünde enerji hangi bağın yıkılmasıyla açığa çıkar?', o: ['Adenin–riboz bağı', 'Yüksek enerjili fosfat bağı', 'Riboz içindeki bağlar', 'Hidrojen bağı'], a: 1, e: 'ATP → ADP + Pi tepkimesinde fosfatlar arasındaki yüksek enerjili bağ yıkılır ve hücrenin kullanabileceği enerji açığa çıkar.' }
  });

  add('reseptor', {
    title: 'Reseptör çeşitleri', ico: '👂', tag: '11. sınıf · Duyu reseptörleri',
    task: 'Beş reseptör türünü tek tek tıkla. Her birinin hangi uyaranı algıladığını eşleştir: kimyasal, mekanik, sıcaklık değişimi, doku hasarı, ışık.',
    q: { q: 'Dokunma ve basınç gibi mekanik uyaranları algılayan reseptör hangisidir?', o: ['Kemoreseptör', 'Mekanoreseptör', 'Fotoreseptör', 'Termoreseptör'], a: 1, e: 'Mekanoreseptörler dokunma, basınç, titreşim, ses dalgaları ve denge gibi mekanik uyaranlara duyarlıdır.' }
  });

  add('refleks', {
    title: 'Refleks yayı', ico: '🖐️', tag: '11. sınıf · Sinir sistemi',
    task: '“Refleksi başlat” düğmesine bas ve uyartının yolunu izle: reseptör → duyu nöronu → ara nöron → motor nöron → kas. Her nöron türüne ve gri-beyaz cevhere tıkla.',
    q: { q: 'Refleks yayında uyartıyı omurilikten kasa taşıyan nöron hangisidir?', o: ['Duyu nöronu', 'Ara nöron', 'Motor nöron', 'Schwann hücresi'], a: 2, e: 'Motor (efferent) nöron, uyartıyı merkezî sinir sisteminden efektöre (kas veya bez) taşır. Hücre gövdesi omuriliğin ön boynuzundadır.' }
  });

  add('beyin', {
    title: 'Beyin', ico: '🧠', tag: '9. sınıf · Merkezî sinir sistemi', note: 'Ek model: beyin bölümleri 11. sınıf duyu reseptörleri kazanımının dışındadır; ek bilgi olarak eklenmiştir.',
    task: 'Beyni döndür, “İç yapıları göster” düğmesine bas. Dört lobu, beyinciği, beyin sapını, talamusu ve hipotalamusu tek tek tıkla. Dengeyi hangi bölümün sağladığını bul.',
    q: { q: 'Dengeyi ve kasların koordinasyonunu sağlayan beyin bölümü hangisidir?', o: ['Beyincik', 'Talamus', 'Omurilik soğanı', 'Ön lob'], a: 0, e: 'Beyincik dengeyi, vücut duruşunu ve kasların koordinasyonunu sağlar; zarar görürse yürüme ve denge bozulur.' }
  });

  add('omurilik', {
    title: 'Omurilik kesiti', ico: '🦴', tag: '9. sınıf · Merkezî sinir sistemi',
    task: 'Omurilik kesitinde gri ve beyaz cevheri ayırt et. Arka kökü ve ön kökü tıkla; duyu ve motor uyartıların hangi kökten geçtiğini bul. Üç zarı dıştan içe sırala.',
    q: { q: 'Omurilik kesitinde kelebek şeklinde görülen, nöron hücre gövdelerini içeren bölüm hangisidir?', o: ['Beyaz cevher', 'Gri cevher', 'Dış zar (dura mater)', 'Omur'], a: 1, e: 'Gri cevher nöron hücre gövdelerini, ara nöronları ve motor nöron gövdelerini içerir; refleks merkezleri buradadır. Beyaz cevher miyelinli akson demetlerinden oluşur.' }
  });

  add('glia', {
    title: 'Yardımcı hücreler (glia)', ico: '🤝', tag: '11. sınıf · Sinir sistemi', note: 'Ek model: glia hücre çeşitleri 11. sınıf duyu reseptörleri kazanımının dışındadır; ek bilgi olarak eklenmiştir.',
    task: 'Mikroglia, oligodendrosit ve Schwann hücresini tıkla. Hangisinin merkezî, hangisinin çevresel sinir sisteminde miyelin yaptığını bul.',
    q: { q: 'Çevresel sinir sisteminde aksonun etrafında miyelin kılıf oluşturan hücre hangisidir?', o: ['Oligodendrosit', 'Schwann hücresi', 'Mikroglia', 'Motor nöron'], a: 1, e: 'Çevresel sinir sisteminde miyelini Schwann hücreleri yapar; merkezî sinir sisteminde bu işi oligodendrositler yapar.' }
  });

  add('molekul', {
    title: 'Nörotransmitterler', ico: '🧪', tag: '11. sınıf · Sinaps', note: 'Ek model: nörotransmitter çeşitleri 11. sınıf duyu reseptörleri kazanımının dışındadır; ek bilgi olarak eklenmiştir.',
    task: 'Serotonin, dopamin, epinefrin ve norepinefrin moleküllerini tıkla ve birbirinden ayır. Bu moleküllerin sinapsta uyartıyı bir hücreden diğerine aktaran kimyasallar olduğunu not al.',
    q: { q: 'Nörotransmitterler akson ucunda nerede depolanır?', o: ['Sinaptik keseciklerde', 'Miyelin kılıfta', 'Dendritte', 'Ranvier boğumunda'], a: 0, e: 'Nörotransmitterler akson terminalindeki sinaptik keseciklerde depolanır; uyartı gelince ekzositozla sinaptik aralığa salınır.' }
  });

  add('zar', {
    title: 'Zar potansiyeli', ico: '📈', tag: '11. sınıf · Nöron fizyolojisi',
    task: 'Polarizasyon, depolarizasyon ve repolarizasyon düğmelerini sırayla dene. Na⁺ ve K⁺ iyonlarının hangi kanaldan, hangi yöne geçtiğini izle. Na-K pompasına da tıkla.',
    q: { q: 'Depolarizasyon sırasında hangi iyon hücre içine girer?', o: ['K⁺', 'Na⁺', 'Cl⁻', 'Ca²⁺'], a: 1, e: 'Eşik değerde gerilime duyarlı Na⁺ kanalları açılır, Na⁺ iyonları hücre içine girer ve zarın iç yüzü pozitifleşir (depolarizasyon).' }
  });
})();
