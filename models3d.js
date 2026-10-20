/* Nasse Biology — 3B modeller (Three.js r128, prosedürel). Dışarıdan model dosyası gerekmez. */
const M3 = {};
const mt = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .5, metalness: .05 }, o || {}));
const glass = (c, op) => mt(c, { transparent: true, opacity: op, depthWrite: false, side: THREE.DoubleSide });
function B() {
  const g = new THREE.Group(), sels = [], ticks = [];
  const S = (m, n, i, t) => { m.material = m.material.clone(); m.userData = { name: n, info: i, tag: t || '' }; sels.push(m); return m; };
  return { g, sels, ticks, S };
}
function tubeGeo(pts, r, seg) {
  const c = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], p[1], p[2])));
  return new THREE.TubeGeometry(c, seg || Math.max(10, pts.length * 8), r, 8, false);
}
function at(m, x, y, z) { m.position.set(x, y, z); return m; }
function glow(color, r) { return new THREE.Mesh(new THREE.SphereGeometry(r || .09, 12, 12), new THREE.MeshBasicMaterial({ color })); }

/* ============ GÖZ ============ */
M3.goz = {
  title: 'Göz', ico: '👁️', tag: 'Fotoreseptör · Elektromanyetik reseptör', cam: [5.5, 2.2, 6],
  task: 'Işık ışınlarının izlediği yolu takip et. Kornea, mercek ve retina parçalarına tıkla. Retinanın görevini ve görüntünün nerede ters oluştuğunu not al.',
  q: { q: 'Gözde ışığı algılayıp elektrik sinyaline dönüştüren yapı hangisidir?', o: ['Kornea', 'Mercek', 'Retina', 'Sklera'], a: 2, e: 'Retinadaki çubuk ve koni hücreleri (fotoreseptörler) ışığı algılar ve elektrik sinyaline çevirir. Kameradaki görüntü sensörüne benzer.' },
  build() {
    const { g, sels, ticks, S } = B();
    const sk = S(new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 32), glass(0xf4f7ff, .25)), 'Sklera (göz akı)', 'Gözü dıştan saran koruyucu, beyaz tabaka. Bu modelde iç yapıları görebilmen için saydam gösterilmiştir.', 'Koruyucu yapı');
    sk.userData.low = true; g.add(sk);
    const cor = S(new THREE.Mesh(new THREE.SphereGeometry(.95, 32, 16, 0, Math.PI * 2, 0, .9).rotateX(Math.PI / 2), glass(0x9fd8ff, .45)), 'Kornea', 'Gözün ön kısmındaki saydam tabakadır. Işık gözün içine buradan girer.', 'Işığın girişi');
    at(cor, 0, 0, .7); g.add(cor);
    const iris = S(new THREE.Mesh(new THREE.RingGeometry(.3, .72, 48), mt(0x2a7fd6, { side: THREE.DoubleSide })), 'İris', 'Gözün renkli kısmıdır; göz bebeğinin çevresinde yer alır.', 'Renkli tabaka');
    at(iris, 0, 0, 1.2); g.add(iris);
    const pup = S(new THREE.Mesh(new THREE.CircleGeometry(.31, 32), mt(0x000000, { side: THREE.DoubleSide })), 'Göz bebeği', 'İrisin ortasındaki açıklıktır; ışık buradan gözün içine geçer.', 'Işığın geçtiği açıklık');
    at(pup, 0, 0, 1.19); g.add(pup);
    const lens = S(new THREE.Mesh(new THREE.SphereGeometry(.5, 32, 24), glass(0xfff3b0, .6)), 'Mercek', 'Işığı retina üzerinde odaklayan saydam yapıdır.', 'Işığı odaklar');
    lens.scale.set(1, 1, .55); at(lens, 0, 0, .75); g.add(lens);
    const ret = S(new THREE.Mesh(new THREE.SphereGeometry(1.42, 48, 32, 0, Math.PI * 2, 1.85, 1.3).rotateX(Math.PI / 2), mt(0xe0553b, { side: THREE.DoubleSide, emissive: 0x000000 })), 'Retina', 'Işığa duyarlı çubuk ve koni hücrelerini (fotoreseptörler) içerir. Bu reseptörler nöron yapısındadır; ışığı algılayıp elektrik sinyaline dönüştürür. Retinada görüntü ters oluşur; görme sinirleri ile beyne ulaştığında düzeltilir.', 'Fotoreseptör (elektromanyetik) · nöron');
    g.add(ret);
    const nerve = S(new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, 1.4, 16).rotateX(Math.PI / 2), mt(0xf5c542)), 'Görme siniri', 'Retinada oluşan elektrik sinyallerini (uyartıları) beyne taşır.', 'Uyartının iletimi');
    at(nerve, 0, 0, -2.0); g.add(nerve);
    // ışık ışınları
    const rays = [];
    [-1, 0, 1].forEach(k => {
      const pts = [new THREE.Vector3(0, k * 1.1, 4.2), new THREE.Vector3(0, k * .35, .8), new THREE.Vector3(0, 0, -1.38)];
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffd34d }));
      g.add(line);
      const path = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0);
      const orb = glow(0xffe680, .1); g.add(orb); rays.push({ path, orb, off: Math.random() });
    });
    ticks.push(t => rays.forEach(r => { const u = (t * .25 + r.off) % 1; r.orb.position.copy(r.path.getPoint(u)); }));
    return { g, sels, ticks };
  }
};

/* ============ KULAK ============ */
M3.kulak = {
  title: 'Kulak', ico: '👂', tag: 'Mekanoreseptör · Duyu epiteli', cam: [1, 3, 9],
  task: 'Ses dalgalarının soldan sağa yolunu izle. Kulak zarı, kemikçikler ve salyangoza tıkla. Sesin elektrik sinyaline hangi bölümde dönüştüğünü bul.',
  q: { q: 'Kulaktaki tüylü duyu hücreleri hangi reseptör çeşidine ve hangi yapıya örnektir?', o: ['Fotoreseptör – nöron', 'Mekanoreseptör – duyu epiteli', 'Kemoreseptör – nöron', 'Termoreseptör – duyu epiteli'], a: 1, e: 'Kulak mekanoreseptörleri (tüylü duyu hücreleri) duyu epiteli yapısındadır; ses ve dengeyle ilişkili mekanik uyaranları algılar.' },
  build() {
    const { g, sels, ticks, S } = B();
    const skin = 0xf0b9a0;
    const pinna = S(new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2).rotateZ(-Math.PI / 2), mt(skin, { side: THREE.DoubleSide })), 'Kulak kepçesi', 'Ses dalgalarını toplayıp kulak kanalına yönlendiren dış kulak kısmıdır.', 'Dış kulak');
    pinna.scale.set(1, 1.2, 1.2); at(pinna, -3.3, 0, 0); g.add(pinna);
    const canal = S(new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, 2.2, 20, 1, true).rotateZ(Math.PI / 2), mt(skin, { transparent: true, opacity: .55, side: THREE.DoubleSide })), 'Kulak kanalı', 'Ses dalgalarını kulak zarına ileten kanaldır.', 'Dış kulak');
    at(canal, -1.1, 0, 0); g.add(canal);
    const drum = S(new THREE.Mesh(new THREE.CircleGeometry(.36, 32).rotateY(Math.PI / 2), mt(0xf8f1e7, { side: THREE.DoubleSide })), 'Kulak zarı', 'Ses dalgalarıyla ilk titreşen zardır. Mikrofondaki diyaframa benzer.', 'Mekanik uyaranın alınması');
    at(drum, 0, 0, 0); g.add(drum);
    const bone = 0xe8d8a8;
    const b1 = S(new THREE.Mesh(new THREE.BoxGeometry(.35, .15, .15), mt(bone)), 'Kemikçikler (orta kulak)', 'Kulak zarındaki titreşimi güçlendirerek iç kulağa iletir.', 'Orta kulak');
    at(b1, .45, 0, 0); const b2 = S(new THREE.Mesh(new THREE.SphereGeometry(.17, 16, 16), mt(bone)), 'Kemikçikler (orta kulak)', 'Kulak zarındaki titreşimi güçlendirerek iç kulağa iletir.', 'Orta kulak');
    at(b2, .9, .1, 0); const b3 = S(new THREE.Mesh(new THREE.TorusGeometry(.12, .045, 10, 20), mt(bone)), 'Kemikçikler (orta kulak)', 'Kulak zarındaki titreşimi güçlendirerek iç kulağa iletir.', 'Orta kulak');
    at(b3, 1.3, 0, 0); b3.rotation.y = Math.PI / 2; g.add(b1, b2, b3);
    const pts = []; for (let i = 0; i <= 80; i++) { const a = i / 80 * Math.PI * 5, r = 1 - i / 80 * .75; pts.push([2.4 + i / 80 * .5, -.8 + Math.sin(a) * r, Math.cos(a) * r]); }
    const coch = S(new THREE.Mesh(tubeGeo(pts, .2, 120), mt(0x9b6be8)), 'Salyangoz (iç kulak)', 'İçindeki tüylü duyu hücreleri (mekanoreseptör, duyu epiteli) titreşimi elektrik sinyaline dönüştürür.', 'Mekanoreseptör · duyu epiteli');
    g.add(coch);
    [0, 1, 2].forEach(i => {
      const t = S(new THREE.Mesh(new THREE.TorusGeometry(.65, .08, 12, 40), mt(0x35c58a)), 'Yarım daire kanalları', 'İç kulakta bulunur; dengeyle ilişkili mekanik uyaranların algılanmasında görev alır. (Konum alma ayrıntısı bu kazanımda işlenmez.)', 'Denge ile ilişkili mekanoreseptörler');
      at(t, 2.7, 1.5, 0); t.rotation.set(i === 0 ? 0 : Math.PI / 2, i === 2 ? Math.PI / 2 : 0, 0); g.add(t);
    });
    const nerve = S(new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, 1.8, 16).rotateZ(Math.PI / 2), mt(0xf5c542)), 'İşitme siniri', 'İç kulakta oluşan elektrik sinyallerini (uyartıları) beyne taşır.', 'Uyartının iletimi');
    at(nerve, 4.3, -.8, 0); g.add(nerve);
    const rings = []; for (let i = 0; i < 4; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.8, .03, 8, 40).rotateY(Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x4fb3ff, transparent: true })); g.add(r); rings.push(r); }
    ticks.push(t => rings.forEach((r, i) => { const u = (t * .22 + i / 4) % 1; r.position.set(-8 + u * 4.5, 0, 0); r.scale.setScalar(.5 + u * .9); r.material.opacity = 1 - u; }));
    return { g, sels, ticks };
  }
};

/* ============ BURUN ============ */
M3.burun = {
  title: 'Burun', ico: '👃', tag: 'Kemoreseptör · Nöron', cam: [4, 1, 7],
  task: 'Koku moleküllerinin burun boşluğuna girişini izle. Koku epiteline ve koku soğanına tıkla. Koku reseptörlerinin hangi yapıda olduğunu yaz.',
  q: { q: 'Burundaki koku reseptörleri için hangisi doğrudur?', o: ['Mekanoreseptör, duyu epiteli', 'Kemoreseptör, nöron', 'Fotoreseptör, nöron', 'Termoreseptör, duyu epiteli'], a: 1, e: 'Koku molekülleri kimyasal uyarandır; koku reseptör nöronları kemoreseptördür.' },
  build() {
    const { g, sels, ticks, S } = B();
    const out = S(new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), glass(0xf0b9a0, .22)), 'Dış burun', 'Havanın (ve içindeki koku moleküllerinin) burun boşluğuna girdiği yapıdır.', 'Hava yolu');
    out.userData.low = true; out.scale.set(1.2, 2, 1.1); at(out, 0, -.6, 0); g.add(out);
    const cav = S(new THREE.Mesh(new THREE.SphereGeometry(.8, 32, 24), glass(0xff9aa8, .35)), 'Burun boşluğu', 'Koku moleküllerinin geçerek koku epiteline ulaştığı boşluktur.', 'Hava yolu');
    cav.scale.set(1, 1.6, 1); at(cav, 0, .1, 0); g.add(cav);
    const ep = S(new THREE.Mesh(new THREE.BoxGeometry(1.5, .12, 1.1), mt(0xffb02e, { emissive: 0x442200 })), 'Koku epiteli', 'Koku reseptör nöronlarının bulunduğu bölgedir. Reseptörler kemoreseptördür ve nöron yapısındadır.', 'Kemoreseptör · nöron');
    at(ep, 0, 1.15, 0); g.add(ep);
    for (let i = 0; i < 22; i++) {
      const x = (Math.random() - .5) * 1.3, z = (Math.random() - .5) * .9;
      const f = S(new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .85, 5), mt(0xffd27a)), 'Koku reseptör nöronları', 'Koku moleküllerini algılayıp elektrik sinyaline dönüştüren, uzantıları koku soğanına uzanan nöronlardır.', 'Kemoreseptör · nöron');
      at(f, x, 1.6, z); g.add(f);
    }
    const bulb = S(new THREE.Mesh(new THREE.SphereGeometry(.5, 24, 24), mt(0x9b6be8)), 'Koku soğanı ve siniri', 'Reseptörlerde oluşan uyartılar buradan nöronlarla merkezî sinir sistemine taşınır.', 'Uyartının iletimi');
    bulb.scale.set(1.3, .8, 1); at(bulb, 0, 2.15, 0); g.add(bulb);
    const bn = S(new THREE.Mesh(tubeGeo([[0, 2.2, 0], [1.2, 2.5, 0], [2.4, 2.4, 0]], .1), mt(0xf5c542)), 'Koku soğanı ve siniri', 'Reseptörlerde oluşan uyartılar buradan nöronlarla merkezî sinir sistemine taşınır.', 'Uyartının iletimi');
    g.add(bn);
    [-.3, .3].forEach(x => { const n = new THREE.Mesh(new THREE.CircleGeometry(.14, 16).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x331122, side: THREE.DoubleSide })); at(n, x, -1.55, 0); g.add(n); });
    const mols = []; for (let i = 0; i < 36; i++) { const m = glow([0xffd34d, 0x6ee7b7, 0xff7ab8][i % 3], .07); g.add(m); mols.push({ m, p: Math.random(), x: (Math.random() - .5) * .6, z: (Math.random() - .5) * .5, s: .1 + Math.random() * .08 }); }
    ticks.push((t, dt) => mols.forEach(o => { o.p += dt * o.s; if (o.p > 1) o.p = 0; o.m.position.set(o.x + Math.sin(t * 2 + o.p * 9) * .12, -2.8 + o.p * 4, o.z); }));
    return { g, sels, ticks };
  }
};

/* ============ DİL ============ */
M3.dil = {
  title: 'Dil', ico: '👅', tag: 'Kemoreseptör · Duyu epiteli', cam: [0, 4.5, 4.5],
  task: 'Parlayan sarı tat tomurcuklarını bul ve tıkla. Tat tomurcuklarının reseptör çeşidini ve yapısını belirle.',
  q: { q: 'Dildeki tat tomurcukları için hangisi doğrudur?', o: ['Nöron yapısında mekanoreseptör', 'Duyu epiteli yapısında kemoreseptör', 'Nöron yapısında fotoreseptör', 'Duyu epiteli yapısında nosiseptör'], a: 1, e: 'Tat tomurcukları duyu epiteli yapısındadır ve kimyasal uyaranları (tat molekülleri) algılayan kemoreseptörler içerir. Dilde ayrıca termoreseptörler de bulunur.' },
  build() {
    const { g, sels, ticks, S } = B();
    const body = S(new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), mt(0xe0707f, { roughness: .8 })), 'Dil gövdesi', 'Kas yapılı organdır. Yüzeyindeki papillalarda tat tomurcukları bulunur. Dilde kemoreseptörlerin yanı sıra termoreseptörler de yer alır.', 'Duyu organı');
    body.scale.set(1.3, .35, 2.2); g.add(body);
    for (let i = 0; i < 160; i++) {
      const x = (Math.random() * 2 - 1) * 1.15, z = (Math.random() * 2 - 1) * 2;
      const q = (x / 1.3) ** 2 + (z / 2.2) ** 2; if (q > .85) continue;
      const y = .35 * Math.sqrt(1 - q);
      const p = S(new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 8), mt(0xf08a98)), 'Papilla', 'Dil yüzeyindeki küçük çıkıntılardır. Bazılarının çevresinde tat tomurcukları bulunur.', 'Dil yüzeyi');
      at(p, x, y + .02, z); g.add(p);
    }
    const buds = [];
    [[-.7, -1.2], [-.35, -1.5], [0, -1.65], [.35, -1.5], [.7, -1.2], [-.5, .3], [.5, .2], [0, 1.6], [-.3, 1.0], [.4, 1.2]].forEach(([x, z]) => {
      const q = (x / 1.3) ** 2 + (z / 2.2) ** 2, y = .35 * Math.sqrt(Math.max(0, 1 - q));
      const b = S(new THREE.Mesh(new THREE.SphereGeometry(.11, 14, 14), mt(0xffd34d, { emissive: 0x886600 })), 'Tat tomurcuğu', 'Tat tomurcukları duyu epiteli yapısındadır. İçlerindeki kemoreseptörler tat moleküllerini algılar; uyartılar nöronlarla merkezî sinir sistemine iletilir.', 'Kemoreseptör · duyu epiteli');
      at(b, x, y + .08, z); g.add(b); buds.push(b);
    });
    ticks.push(t => buds.forEach((b, i) => b.scale.setScalar(1 + Math.sin(t * 3 + i) * .18)));
    const mols = []; for (let i = 0; i < 30; i++) { const m = glow([0x6ee7b7, 0xffd34d, 0xff7ab8][i % 3], .06); g.add(m); mols.push({ m, p: Math.random(), x: (Math.random() - .5) * 2, z: (Math.random() - .5) * 3.5, s: .15 + Math.random() * .1 }); }
    ticks.push((t, dt) => mols.forEach(o => { o.p += dt * o.s; if (o.p > 1) o.p = 0; o.m.position.set(o.x, 2.2 - o.p * 1.9, o.z); }));
    return { g, sels, ticks };
  }
};

/* ============ DERİ ============ */
M3.deri = {
  title: 'Deri', ico: '🖐️', tag: 'Mekano · Termo · Nosiseptör', cam: [5, 3.5, 6],
  task: 'Deri katmanlarını ve reseptörleri tek tek tıkla. Mekanoreseptör, termoreseptör ve ağrı reseptörünü ayırt edip hangi uyaranı algıladıklarını yaz.',
  q: { q: 'Derideki serbest sinir uçları hangi reseptöre örnektir?', o: ['Fotoreseptör', 'Ağrı reseptörü (nosiseptör)', 'Kemoreseptör', 'Elektromanyetik reseptör'], a: 1, e: 'Ağrı reseptörleri serbest sinir uçlarıdır; doku hasarına yol açabilecek uyaranları algılar.' },
  build() {
    const { g, sels, ticks, S } = B();
    const lay = (h, y, c, n, i) => { const m = S(new THREE.Mesh(new THREE.BoxGeometry(4.4, h, 3), mt(c, { transparent: true, opacity: .55, depthWrite: false })), n, i, 'Deri katmanı'); m.userData.low = true; at(m, 0, y, 0); g.add(m); };
    lay(.35, 1.55, 0xf3c2a2, 'Epidermis (üst deri)', 'Derinin en dış katmanıdır; serbest sinir uçları buraya kadar uzanır.');
    lay(1.3, .7, 0xe88a9a, 'Dermis (asıl deri)', 'Reseptörlerin ve sinir uçlarının çoğunun bulunduğu katmandır.');
    lay(.9, -.4, 0xf2d27a, 'Hipodermis (deri altı)', 'Deri altı katmanıdır; basınç algılayan kapsüllü yapılar burada yer alabilir.');
    const hair = S(new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1.8, 8), mt(0x4a2f1b)), 'Kıl', 'Kılın dibindeki sinir uçları hareketi ve dokunmayı algılar.', 'Mekanik uyaran');
    at(hair, -1.4, 1.5, .4); g.add(hair);
    const pac = S(new THREE.Mesh(new THREE.SphereGeometry(.4, 24, 18), mt(0xf0a43a)), 'Mekanoreseptör (kapsüllü yapı)', 'Dokunma ve basınç gibi mekanik uyaranları algılar. Deride bulunan kapsüllü yapılar nöron yapısındadır.', 'Mekanoreseptör · nöron');
    pac.scale.set(.8, 1.3, .8); at(pac, 1.4, -.15, .3); g.add(pac);
    for (let i = 0; i < 4; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.3, .018, 6, 24), mt(0xb56c10)); r.rotation.x = Math.PI / 2; at(r, 1.4, -.5 + i * .25, .3); g.add(r); }
    const mei = S(new THREE.Mesh(new THREE.SphereGeometry(.22, 20, 16), mt(0x34c38f)), 'Mekanoreseptör (dokunma)', 'Hafif dokunmayı algılayan mekanoreseptördür; nöron yapısındadır.', 'Mekanoreseptör · nöron');
    mei.scale.set(.8, 1.3, .8); at(mei, .2, 1.2, .5); g.add(mei);
    const hot = S(new THREE.Mesh(new THREE.SphereGeometry(.17, 16, 16), mt(0xff4d4d, { emissive: 0x551111 })), 'Termoreseptör (sıcak)', 'Sıcaklık artışını algılar. Termoreseptörler çoğunlukla deri ve dilde bulunur.', 'Termoreseptör');
    at(hot, -.5, 1.05, -.7); g.add(hot);
    const cold = S(new THREE.Mesh(new THREE.SphereGeometry(.17, 16, 16), mt(0x3aa0ff, { emissive: 0x112a55 })), 'Termoreseptör (soğuk)', 'Sıcaklık azalmasını (soğuğu) algılar.', 'Termoreseptör');
    at(cold, .7, 1.05, -.8); g.add(cold);
    [[-.1, -.2], [.3, .4], [-.9, -.6]].forEach(([x, z], i) => {
      const f = S(new THREE.Mesh(tubeGeo([[x, .4, z], [x + .1, 1.0, z], [x - .1, 1.45, z], [x + .05, 1.78, z]], .025), mt(0xffe14d, { emissive: 0x665500 })), 'Ağrı reseptörü (serbest sinir ucu)', 'Doku hasarına duyarlıdır (nosiseptör). Serbest sinir uçlarıdır ve beyin hariç tüm vücutta bulunur; fiziksel ve kimyasal uyaranları algılar.', 'Nosiseptör · nöron');
      g.add(f);
    });
    const nerve = S(new THREE.Mesh(tubeGeo([[0, -.9, 0], [0, 0, -.2], [-.3, .7, 0], [-.1, 1.0, -.2]], .08), mt(0xf5c542)), 'Duyu siniri', 'Reseptörlerde oluşan uyartıları nöronlarla merkezî sinir sistemine taşır.', 'Uyartının iletimi');
    g.add(nerve);
    const pulse = glow(0xffffff, .11); g.add(pulse);
    const pc = new THREE.CatmullRomCurve3([[0, 1.0, -.2], [-.3, .7, 0], [0, 0, -.2], [0, -.9, 0]].map(p => new THREE.Vector3(...p)));
    ticks.push(t => pulse.position.copy(pc.getPoint((t * .3) % 1)));
    return { g, sels, ticks };
  }
};

/* ============ NÖRON ============ */
M3.noron = {
  title: 'Nöron', ico: '🧬', tag: 'Hücre gövdesi · Dendrit · Akson', cam: [0, 3, 9],
  task: 'Nöronun 7 yapısını tek tek tıkla: dendrit, hücre gövdesi, çekirdek, miyelin kılıf, Ranvier boğumu, akson ve akson ucu. Uyartının ilerleme yönünü takip et.',
  q: { q: 'Uyartı nöronda hangi yönde ilerler?', o: ['Akson ucundan dendrite', 'Dendritten aksona', 'Ranvier boğumundan çekirdeğe', 'Her zaman çift yönlü'], a: 1, e: 'Nöronlarda uyartının ilerleme yönü dendritten aksona doğrudur.' },
  build() {
    const { g, sels, ticks, S } = B();
    const soma = S(new THREE.Mesh(new THREE.SphereGeometry(.85, 32, 24), glass(0x7a6af0, .55)), 'Hücre gövdesi', 'Çekirdek, organeller ve sitoplazmayı bulundurur. Enerji ihtiyacı fazla olduğundan çok sayıda mitokondri vardır; nörofibriller nörona şekil verir.', 'Nöronun yaşamsal faaliyet merkezi');
    at(soma, -3.2, 0, 0); soma.userData.low = true; g.add(soma);
    const nuc = S(new THREE.Mesh(new THREE.SphereGeometry(.35, 24, 20), mt(0x4b2bb8)), 'Çekirdek', 'Hücrenin faaliyetlerini yönetir ve kalıtsal bilgiyi taşır.', 'Hücre gövdesi');
    at(nuc, -3.2, 0, 0); g.add(nuc);
    const dm = mt(0x4da3ff);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + .3, dx = -Math.cos(a) * .2 - .2, dy = Math.sin(a), dz = Math.cos(a * 2) * .6;
      const x0 = -3.2 + Math.cos(a) * -.8, y0 = Math.sin(a) * .8;
      const ex = -3.2 - Math.abs(Math.cos(a)) * 1.9 - .6, ey = Math.sin(a) * 1.9, ez = dz;
      const d = S(new THREE.Mesh(tubeGeo([[x0, y0, 0], [(x0 + ex) / 2, (y0 + ey) / 2, ez / 2], [ex, ey, ez]], .06), dm), 'Dendrit', 'Diğer nöron ve reseptörlerden gelen uyarıları alır ve elektrik sinyalleri hâlinde hücre gövdesine iletir.', 'Uyarıyı alır');
      g.add(d);
      [-.5, .5].forEach(s => { const b = S(new THREE.Mesh(tubeGeo([[ex, ey, ez], [ex - .3, ey + s * .4, ez + s * .2], [ex - .6, ey + s * .7, ez + s * .3]], .035), dm), 'Dendrit', 'Diğer nöron ve reseptörlerden gelen uyarıları alır ve elektrik sinyalleri hâlinde hücre gövdesine iletir.', 'Uyarıyı alır'); g.add(b); });
    }
    const axon = S(new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, 6.4, 12).rotateZ(Math.PI / 2), mt(0x6f6ae0)), 'Akson', 'Hücre gövdesinden çıkan, dendrite göre daha kalın ve uzun uzantıdır. Uyartıyı akson ucuna iletir. Çap kalınlaştıkça iletim hızlanır.', 'Uyartıyı iletir');
    at(axon, -.1, 0, 0); g.add(axon);
    for (let i = 0; i < 5; i++) {
      const x = -2.0 + i * 1.0 + .43;
      const my = S(new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .8, 20).rotateZ(Math.PI / 2), mt(0xf5c542)), 'Miyelin kılıf', 'Schwann hücrelerinin akson çevresinde oluşturduğu lipoprotein yapılı örtüdür. Elektriksel yalıtım sağlar ve uyartı iletimini hızlandırır.', 'Yalıtım');
      at(my, x, 0, 0); g.add(my);
      const nd = S(new THREE.Mesh(new THREE.TorusGeometry(.13, .06, 10, 20).rotateY(Math.PI / 2), mt(0x3be0c8)), 'Ranvier boğumu', 'Miyelin kılıfın kesintiye uğradığı (yalıtımsız) yerlerdir.', 'Miyelinsiz aralık');
      at(nd, x + .5, 0, 0); g.add(nd);
    }
    const sch = S(new THREE.Mesh(new THREE.SphereGeometry(.25, 16, 12), mt(0x7de3d1)), 'Schwann hücresi', 'Akson etrafında miyelin kılıfı oluşturan hücredir.', 'Miyelini yapar');
    sch.scale.set(1.4, .6, .8); at(sch, -1.6, .33, 0); g.add(sch);
    const tx = 3.0, tp = [[1.6, 1], [2.1, .4], [2.1, -.4], [1.6, -1]];
    tp.forEach(([dx, dy]) => {
      const br = S(new THREE.Mesh(tubeGeo([[tx - .2, 0, 0], [tx + dx * .4, dy * .35, 0], [tx + dx, dy, 0]], .05), mt(0x6f6ae0)), 'Akson ucu', 'Aksonun sonlandığı ve dallanarak genişlediği bölgedir. Her dal bir sinaptik uçla sonlanır; salgılanan kimyasal maddelerle uyartı diğer hücreye aktarılır.', 'Uyartıyı aktarır');
      g.add(br);
      const bt = S(new THREE.Mesh(new THREE.SphereGeometry(.17, 16, 16), mt(0xffc93c, { emissive: 0x664400 })), 'Sinaptik uç', 'Akson ucundaki dalların sonlandığı uçtur; içindeki keseciklerde nörotransmitter bulunur ve uyartıyı alıcı hücreye aktarır.', 'Sinaps');
      at(bt, tx + dx, dy, 0); g.add(bt);
    });
    const pulse = glow(0xffffff, .18); g.add(pulse);
    ticks.push(t => { const u = (t * .22) % 1; pulse.position.set(-2.4 + u * 5.2, 0, 0); pulse.scale.setScalar(1 + Math.sin(t * 8) * .15); });
    return { g, sels, ticks };
  }
};

/* ============ SİNAPS ============ */
M3.sinaps = {
  title: 'Sinaps', ico: '🔗', tag: 'Kimyasal sinaps', cam: [5, 0, 7],
  task: 'Sinaptik kesecikleri, sinaps boşluğunu ve reseptörleri tıkla. Nörotransmitterlerin hangi yönde hareket ettiğini izle.',
  q: { q: 'Nörotransmitterler sinaps boşluğuna döküldükten sonra ne yapar?', o: ['Miyelin kılıfa bağlanır', 'Komşu hücrenin zarındaki reseptörlere bağlanır', 'Çekirdeğe girer', 'Akson ucunu parçalar'], a: 1, e: 'Nörotransmitterler komşu hücrenin zarındaki reseptörlere bağlanır ve uyartı komşu hücreye aktarılır.' },
  build() {
    const { g, sels, ticks, S } = B();
    const neck = S(new THREE.Mesh(new THREE.CylinderGeometry(.35, .7, 1.4, 24), glass(0x4da3ff, .55)), 'Akson ucu', 'Aksonun sonlanıp genişlediği bölgedir; uyartı buraya elektrokimyasal iletimle ulaşır.', 'Uyartının geldiği yer');
    at(neck, 0, 3.0, 0); g.add(neck);
    const bulb = S(new THREE.Mesh(new THREE.SphereGeometry(1.3, 36, 28), glass(0x4da3ff, .5)), 'Sinaptik yumru (sinaptik uç)', 'Aksonun sinaps boşluğunda sonlanan ucudur. İçinde nörotransmitter dolu sinaptik keseciklerle bulunur.', 'Sinaps öncesi');
    bulb.scale.set(1.1, .8, 1); at(bulb, 0, 1.4, 0); g.add(bulb);
    const vesPos = [[-.7, 1.1, .2], [0, 1.0, -.3], [.7, 1.1, .2], [-.3, 1.6, .3], [.4, 1.7, -.2]];
    vesPos.forEach(([x, y, z]) => {
      const v = S(new THREE.Mesh(new THREE.SphereGeometry(.26, 20, 16), glass(0xbfe3ff, .5)), 'Sinaptik kesecik', 'İçinde nörotransmitter madde bulunan keseciktir. Uyartı gelince içeriğini sinaps boşluğuna bırakır.', 'Nörotransmitter deposu');
      at(v, x, y, z); g.add(v);
      for (let k = 0; k < 5; k++) { const d = glow(0xffc93c, .05); at(d, x + (Math.random() - .5) * .25, y + (Math.random() - .5) * .25, z + (Math.random() - .5) * .25); g.add(d); }
    });
    const post = S(new THREE.Mesh(new THREE.SphereGeometry(1.4, 36, 28, 0, Math.PI * 2, 1.45, 1.7), mt(0xb085f0, { side: THREE.DoubleSide })), 'Komşu hücrenin zarı', 'Alıcı hücrenin (nöronun dendriti, kas veya bez hücresi) zarıdır; üzerinde nörotransmitterleri tanıyan reseptörler bulunur.', 'Sinaps sonrası');
    post.scale.set(1.6, .8, 1.5); at(post, 0, -1.9, 0); g.add(post);
    const recs = [-1.3, -.45, .45, 1.3].map(x => { const r = S(new THREE.Mesh(new THREE.BoxGeometry(.3, .4, .3), mt(0x3b6bff)), 'Reseptör', 'Nörotransmitterin bağlandığı zar proteinidir; bağlanma ile komşu hücreye uyartı aktarılır.', 'Alıcı protein'); at(r, x, -1.0 - Math.abs(x) * .06, 0); g.add(r); return r; });
    const cleft = S(new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 2.2), glass(0xffe9a8, .15)), 'Sinaps boşluğu', 'Hücrelerin fiziksel olarak temas etmediği, aralarındaki boşluktur. Uyartı bu boşluğu nörotransmitterlerle geçer.', 'İki hücre arası');
    cleft.userData.low = true; at(cleft, 0, -.15, 0); g.add(cleft);
    const nts = []; for (let i = 0; i < 40; i++) { const m = glow(0xffc93c, .07); m.userData.nt = true; g.add(m); nts.push({ m, p: Math.random(), x: (Math.random() - .5) * 2.2, z: (Math.random() - .5) * 1.2, s: .18 + Math.random() * .1 }); }
    ticks.push((t, dt) => nts.forEach(o => { o.p += dt * o.s; if (o.p > 1) o.p = 0; o.m.position.set(o.x + Math.sin(o.p * 8) * .12, .6 - o.p * 1.5, o.z); }));
    const sp = glow(0xffffff, .2); g.add(sp);
    ticks.push(t => { const u = (t * .3) % 1; sp.position.set(0, 4.4 - u * 2.6, 0); sp.visible = u < .8; });
    return { g, sels, ticks };
  }
};

/* ============ GÖRÜNTÜLEYİCİ ============ */
function mount3D(box, key, onPick) {
  const def = M3[key];
  const w = box.clientWidth || 340, h = Math.round(Math.min(560, Math.max(320, w * .75)));
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h); box.appendChild(renderer.domElement);
  renderer.domElement.style.touchAction = 'none';
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(45, w / h, .1, 100);
  cam.position.set(...def.cam);
  scene.add(new THREE.AmbientLight(0xffffff, .75));
  const d1 = new THREE.DirectionalLight(0xffffff, .9); d1.position.set(4, 6, 6); scene.add(d1);
  const d2 = new THREE.PointLight(0x38e1c8, .6, 40); d2.position.set(-6, -2, 4); scene.add(d2);
  const built = def.build(); scene.add(built.g);
  const ctl = new THREE.OrbitControls(cam, renderer.domElement);
  ctl.enableDamping = true; ctl.dampingFactor = .08; ctl.autoRotate = true; ctl.autoRotateSpeed = 1.2; ctl.minDistance = 2.5; ctl.maxDistance = 22;
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  let down = null, alive = true, selName = null;
  const names = []; built.sels.forEach(m => { if (!names.includes(m.userData.name)) names.push(m.userData.name); });
  function highlight(name) {
    selName = name;
    built.sels.forEach(m => { const on = m.userData.name === name; m.material.emissive.setHex(on ? 0x2288ff : (m.userData.baseEm || 0)); if (m.material.emissiveIntensity !== undefined) m.material.emissiveIntensity = on ? .9 : 1; });
  }
  built.sels.forEach(m => { m.userData.baseEm = m.material.emissive.getHex(); });
  function info(name) { const m = built.sels.find(x => x.userData.name === name); return m ? m.userData : null; }
  function pick(ev) {
    const r = renderer.domElement.getBoundingClientRect();
    mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mouse, cam);
    const hits = ray.intersectObjects(built.sels, false);
    const hit = hits.find(x => !x.object.userData.low) || hits[0];
    if (hit) { highlight(hit.object.userData.name); onPick && onPick(hit.object.userData); }
  }
  const el = renderer.domElement;
  el.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; ctl.autoRotate = false; });
  el.addEventListener('pointerup', e => { if (down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 6) pick(e); down = null; });
  const clock = new THREE.Clock();
  (function loop() {
    if (!alive) return; requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
    built.ticks.forEach(f => f(t, dt));
    ctl.update(); renderer.render(scene, cam);
  })();
  function onResize() { const nw = box.clientWidth; if (!nw) return; const nh = Math.round(Math.min(560, Math.max(320, nw * .75))); renderer.setSize(nw, nh); cam.aspect = nw / nh; cam.updateProjectionMatrix(); }
  window.addEventListener('resize', onResize);
  return {
    names, info, select(n) { highlight(n); const i = info(n); onPick && onPick(i); },
    auto(v) { ctl.autoRotate = v; }, isAuto() { return ctl.autoRotate; },
    reset() { cam.position.set(...def.cam); ctl.target.set(0, 0, 0); ctl.update(); },
    destroy() { alive = false; window.removeEventListener('resize', onResize); renderer.dispose(); box.innerHTML = ''; }
  };
}
