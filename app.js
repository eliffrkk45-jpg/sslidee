/* Nasse Biology — ana uygulama */
const $ = (s, e) => (e || document).querySelector(s);
const $$ = (s, e) => [...(e || document).querySelectorAll(s)];
const view = $('#view');
let cleanup = null, viewer = null;

/* ---------- Durum (ilerleme) ---------- */
let S = { xp: 0, done: {}, streak: 0, last: '', name: '' };
try { S = Object.assign(S, JSON.parse(localStorage.getItem('nasse_v2') || '{}')); } catch (e) { }
function save() { localStorage.setItem('nasse_v2', JSON.stringify(S)); }
const level = () => Math.floor(S.xp / 120) + 1;
function hud() { $('#hudLvl').textContent = 'Sv ' + level(); $('#hudXp').textContent = S.xp + ' XP'; $('#hudStreak').textContent = '🔥 ' + S.streak; $('#hudBar').style.width = (S.xp % 120) / 120 * 100 + '%'; }
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg; document.body.appendChild(t); setTimeout(() => t.classList.add('show'), 20); setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2600); }
function confetti() { for (let i = 0; i < 26; i++) { const c = document.createElement('i'); c.className = 'cf'; c.style.left = Math.random() * 100 + 'vw'; c.style.background = ['#22d3ee', '#2ecc71', '#ffd34d', '#4da3ff', '#ff7ab8'][i % 5]; c.style.animationDelay = Math.random() * .4 + 's'; document.body.appendChild(c); setTimeout(() => c.remove(), 2200); } }
function award(key, xp, msg) {
  if (S.done[key]) return false; S.done[key] = 1; const before = level(); S.xp += xp; save(); hud();
  toast(`⭐ +${xp} XP · ${msg || 'Harika!'}`); confetti(); if (level() > before) setTimeout(() => toast('🚀 Seviye atladın! Sv ' + level()), 900); return true;
}
(function streak() { const d = new Date().toISOString().slice(0, 10); if (S.last !== d) { const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); S.streak = S.last === y ? S.streak + 1 : 1; S.last = d; save(); } })();

/* ---------- Yardımcılar ---------- */
function h(html, cls) { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; return d; }
function norm(s) { return String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
function matchAny(input, list) { const n = norm(input), ns = n.replace(/ /g, ''); if (!n) return false; return list.some(g => g.split('+').every(t => { const tt = norm(t); return n.includes(tt) || ns.includes(tt.replace(/ /g, '')); })); }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
function flowHTML(arr) { return `<div class="flow">${arr.map((x, i) => `<span class="chip" style="animation-delay:${i * .12}s">${x}</span>${i < arr.length - 1 ? '<i class="arr">➜</i>' : ''}`).join('')}</div>`; }

/* Çoktan seçmeli kutusu */
function makeMC(spec, o) {
  o = o || {}; const order = o.shuffle ? shuffle(spec.o.map((t, i) => i)) : spec.o.map((t, i) => i);
  const d = h(`<div class="qt">${spec.q}</div><div class="opts">${order.map((oi, k) => `<button class="opt" data-i="${oi}"><b>${'ABCD'[k]}</b> ${spec.o[oi]}</button>`).join('')}</div><div class="fb"></div>`, 'qbox');
  let locked = false;
  $$('.opt', d).forEach(b => b.onclick = () => {
    if (locked) return; const i = +b.dataset.i, good = i === spec.a; locked = true;
    $$('.opt', d).forEach(x => { x.disabled = true; if (+x.dataset.i === spec.a) x.classList.add('ok'); });
    if (!good) b.classList.add('bad');
    $('.fb', d).innerHTML = `<div class="${good ? 'good' : 'warn'} result">${good ? '✅ Doğru!' : '❌ Yanlış.'} ${spec.e || ''}</div>`;
    if (good && o.key) award(o.key, o.xp || 10, o.msg);
    if (o.onAnswer) o.onAnswer(good);
  });
  return d;
}
function taskBox(t) { return h(`<b>🎯 Görev</b><p>${t}</p>`, 'task'); }
function obsBox(spec, key) { const w = h('<b>🔎 Gözlem sorusu</b>', 'obs'); w.appendChild(makeMC(spec, { key, xp: 20, msg: 'Gözlemini doğru yorumladın!' })); return w; }

/* ---------- Sayfalar ---------- */
const ROUTES = {};

ROUTES.home = () => {
  const done = k => Object.keys(S.done).filter(x => x.startsWith(k)).length;
  const secs = [
    ['#/konu', '📖', 'Konu Anlatımı', done('k_'), TOPICS.length], ['#/3d', '🧊', '3B Duyu Organları ve Sinir Sistemi', done('m_'), Object.keys(M3).length],
    ['#/sim', '🔬', 'Simülasyonlar', done('sim_'), Object.keys(SIMS).length], ['#/oyun', '🎮', 'Oyunlar', done('g_'), Object.keys(GAMES).length],
    ['#/soru', '📝', 'Soru Bankası', done('q_'), BANK.length], ['#/baglam', '🧠', 'Bağlam Temelli Sorular', done('bt_'), BAGLAM.length]
  ];
  const badges = [['🥇', 'Reseptör Kaşifi', done('k_') >= 4], ['🧬', 'Nöron Mühendisi', S.done.g_neuron], ['🔋', 'Zar Potansiyeli Ustası', S.done.g_charge && S.done.sim_ap], ['🌳', 'Ağaç Avcısı', S.done.g_tree], ['🧊', '3B Gezgin', done('m_') >= 3], ['🏆', 'Bağlam Ustası', done('bt_') >= 6]];
  view.innerHTML = '';
  view.appendChild(h(`<div class="hero"><div class="orbit"><span>🧠</span><span>👁️</span><span>👂</span><span>👃</span><span>👅</span><span>🖐️</span></div>
   <h1>Nasse Biology</h1><p class="sub">11. sınıf · Duyu Reseptörleri ve Duyu Organları · Nöron ve Sinaps</p>
   <p class="kaz">${KAZANIM}</p>
   <div class="credit">Los Galacticos · Barış Köseoğlu</div>
   <a class="btn big" href="#/konu">🚀 Öğrenmeye başla</a></div>`));
  view.appendChild(h(`<div class="grid">${secs.map(s => `<a class="tile" href="${s[0]}"><div class="ti">${s[1]}</div><b>${s[2]}</b><div class="pbar"><i style="width:${s[4] ? s[3] / s[4] * 100 : 0}%"></i></div><small>${s[3]} / ${s[4]}</small></a>`).join('')}</div>`));
  view.appendChild(h(`<h3>🏅 Rozetler</h3><div class="badges">${badges.map(b => `<div class="badge ${b[2] ? 'on' : ''}"><span>${b[0]}</span>${b[1]}</div>`).join('')}</div>`, 'sec'));
  view.appendChild(h(`<h3>Kapsam</h3><p>Bu site, 11. sınıf Biyoloji “1.5. Duyu Reseptörleri ve Duyu Organları” kazanımı slaytlarına göre hazırlanmıştır. Ayrıntılı moleküler mekanizmalar (iyon kanalı/pompası çeşitleri, nörotransmitter çeşitleri), glia hücre çeşitleri, göz uyumu, görme kusurları ve denge ayrıntıları kapsam dışıdır.</p>`, 'sec'));
};

ROUTES.konu = (id) => {
  view.innerHTML = '';
  if (!id) {
    view.appendChild(h('<h2>📖 Konu Anlatımı</h2><p class="sub">Maarif modeline uygun: <b>Merak Et → Öğren → Bağ Kur → Becerini Dene</b></p>'));
    view.appendChild(h(`<div class="grid">${TOPICS.map((t, i) => `<a class="tile" href="#/konu/${t.id}"><div class="ti">${t.ico}</div><b>${i + 1}. ${t.title}</b><small>${t.code}${S.done['k_' + t.id] ? ' · ✅' : ''}</small></a>`).join('')}</div>`));
    return;
  }
  const i = TOPICS.findIndex(t => t.id === id), t = TOPICS[i]; if (!t) return;
  const wrap = h(`<a class="back" href="#/konu">← Konular</a><div class="topic"><span class="code">${t.code}</span><h2>${t.ico} ${t.title}</h2>
   <div class="step s1"><h4>🔍 Merak Et</h4><p>${t.merak}</p></div>
   ${t.flow ? flowHTML(t.flow) : ''}
   <div class="step s2"><h4>📖 Öğren</h4>${t.ogren}</div>
   <div class="step s3"><h4>🧩 Bağ Kur</h4><p>${t.bag}</p></div>
   <div class="step s4 note"><h4>⚠️ Kapsam Notu</h4><p>${t.note}</p></div>
   <div class="links">${t.m3 ? `<a class="btn alt" href="#/3d/${t.m3}">🧊 3B modeli incele</a>` : ''}${t.sim ? `<a class="btn alt" href="#/sim/${t.sim}">🔬 Simülasyonu dene</a>` : ''}</div>
   <div class="step s5"><h4>✅ Becerini Dene</h4></div></div>`);
  $('.s5', wrap).appendChild(makeMC(t.check, { key: 'k_' + t.id, xp: 15, msg: 'Konu pekişti!' }));
  wrap.appendChild(h(`${i > 0 ? `<a class="btn ghost" href="#/konu/${TOPICS[i - 1].id}">← Önceki</a>` : '<span></span>'}${i < TOPICS.length - 1 ? `<a class="btn" href="#/konu/${TOPICS[i + 1].id}">Sonraki →</a>` : `<a class="btn" href="#/baglam">Bağlam sorularına geç →</a>`}`, 'nav2'));
  view.appendChild(wrap);
};

ROUTES['3d'] = (key) => {
  view.innerHTML = '';
  key = key && M3[key] ? key : 'goz';
  view.appendChild(h(`<h2>🧊 3B Modeller</h2><p class="sub">Döndür, yakınlaştır (iki parmak/tekerlek) ve parçalara tıkla. Duyu organları, nöron, sinaps ve sinir sistemi modelleri burada.</p>
   <div class="tabs">${Object.keys(M3).map(k => `<a class="tab ${k === key ? 'on' : ''}" href="#/3d/${k}">${M3[k].ico} ${M3[k].title}</a>`).join('')}</div>`));
  const def = M3[key];
  if (def.lab) view.appendChild(h(`<span class="tagp">${def.tag}</span>${def.note ? ` <small class="lab-not">${def.note}</small>` : ''}`, 'lab-etiket'));
  view.appendChild(taskBox(def.task));
  const labId = def.lab || def.detail;
  /* Nöron ve sinaps: SlideLab'ın temel modeli + lloga'dan gelen ayrıntılı model (miyelinli/miyelinsiz iletim, adım adım sinaps vb.) */
  const modes = def.detail ? h('<button class="btn ghost on" data-m="base">🧊 Temel model</button><button class="btn ghost" data-m="lab">🔬 Ayrıntılı model</button>', 'btns') : null;
  if (modes) view.appendChild(modes);
  const box = h('', 'v3d'); view.appendChild(box);
  const acts = h('', 'btns'); view.appendChild(acts);
  const bar = h('', 'btns');
  const bAuto = h('<button class="btn ghost">⏯ Otomatik dönme</button>'), bRes = h('<button class="btn ghost">🎯 Görünümü sıfırla</button>');
  view.appendChild(bar); bar.appendChild(bAuto.firstChild); bar.appendChild(bRes.firstChild);
  const chips = h('', 'chips'); view.appendChild(chips);
  const infoHtml = '<b>Bir parçaya tıkla</b><p>Seçtiğin yapının adı, görevi ve reseptör bilgisi burada görünür.</p>';
  const infoC = h(infoHtml, 'info'); view.appendChild(infoC);
  const picked = new Set();
  let token = 0;
  const onPick = d => {
    if (!d) return; infoC.innerHTML = `<b>${d.name}</b>${d.tag ? `<span class="tagp">${d.tag}</span>` : ''}<p>${d.info}</p>`;
    $$('.chip2', chips).forEach(c => c.classList.toggle('on', c.dataset.n === d.name));
    picked.add(d.name); if (viewer && picked.size >= Math.min(4, viewer.names.length)) award('x_' + key, 5, 'Modeli keşfettin!');
  };
  async function mount(m) {
    const my = ++token;
    if (viewer) { viewer.destroy(); viewer = null; }
    box.innerHTML = ''; chips.innerHTML = ''; acts.innerHTML = ''; infoC.innerHTML = infoHtml;
    if (modes) $$('button', modes).forEach(b => b.classList.toggle('on', b.dataset.m === m));
    if (m === 'base') viewer = mount3D(box, key, onPick);
    else {
      box.innerHTML = '<p class="labmsg">⏳ Ayrıntılı 3B model yükleniyor…</p>';
      try {
        const mod = await import('./lab/bridge.js');
        if (my !== token) return;            /* bu arada sekme veya mod değişti */
        box.innerHTML = '';
        viewer = mod.mountLab(box, labId, onPick);
      } catch (e) {
        if (my !== token) return;
        console.error(e);
        box.innerHTML = '<p class="labmsg">⚠️ Ayrıntılı model yüklenemedi. İnternet bağlantını kontrol et, tarayıcını güncelle ve sayfayı yenile.</p>';
        return;
      }
    }
    viewer.names.forEach(n => { const c = h(n, 'chip2'); c.dataset.n = n; c.onclick = () => viewer.select(n); chips.appendChild(c); });
    (viewer.actions || []).forEach(ey => {
      const b = document.createElement('button'); b.className = 'btn alt'; b.textContent = ey.ad;
      b.onclick = () => { const y = ey.ac(); if (typeof y === 'string') b.textContent = y; };
      acts.appendChild(b);
    });
  }
  bar.children[0].onclick = () => viewer && viewer.auto(!viewer.isAuto());
  bar.children[1].onclick = () => viewer && viewer.reset();
  if (modes) modes.onclick = e => { const b = e.target.closest('button'); if (b && b.dataset.m) mount(b.dataset.m); };
  view.appendChild(obsBox(def.q, 'm_' + key));
  cleanup = () => { token++; viewer && viewer.destroy(); viewer = null; };
  mount(def.lab ? 'lab' : 'base');
};

ROUTES.sim = (id) => {
  view.innerHTML = '';
  if (!id || !SIMS[id]) { view.appendChild(h('<h2>🔬 Simülasyonlar</h2><p class="sub">Her simülasyondan önce bir <b>görev</b>, sonra bir <b>gözlem sorusu</b> var.</p>')); view.appendChild(h(`<div class="grid">${Object.keys(SIMS).map(k => `<a class="tile" href="#/sim/${k}"><div class="ti">${SIMS[k].ico}</div><b>${SIMS[k].title}</b><small>${S.done['sim_' + k] ? '✅ tamamlandı' : 'başla'}</small></a>`).join('')}</div>`)); return; }
  view.appendChild(h(`<a class="back" href="#/sim">← Simülasyonlar</a><h2>${SIMS[id].ico} ${SIMS[id].title}</h2>`));
  view.appendChild(taskBox(SIM_META[id].task));
  const box = h('', 'simbox'); view.appendChild(box);
  requestAnimationFrame(() => { cleanup = SIM_FN[id](box); });
  view.appendChild(obsBox(SIM_META[id].q, 'sim_' + id));
};

ROUTES.oyun = (id) => {
  view.innerHTML = '';
  if (!id || !GAMES[id]) { view.appendChild(h('<h2>🎮 Oyunlar</h2><p class="sub">Ayırt et, grupla, doğru biçimde etiketle!</p>')); view.appendChild(h(`<div class="grid">${Object.keys(GAMES).map(k => `<a class="tile" href="#/oyun/${k}"><div class="ti">${GAMES[k].ico}</div><b>${GAMES[k].title}</b><small>${GAMES[k].desc}${S.done['g_' + k] ? ' ✅' : ''}</small></a>`).join('')}</div>`)); return; }
  view.appendChild(h(`<a class="back" href="#/oyun">← Oyunlar</a><h2>${GAMES[id].ico} ${GAMES[id].title}</h2>`));
  GAME_FN[id](view);
};

ROUTES.soru = () => {
  view.innerHTML = '';
  view.appendChild(h(`<h2>📝 Soru Bankası</h2><p class="sub">${BANK.length} soru · konu seç, 10 soruluk tur başlat.</p>
   <div class="ctl"><select id="qt"><option value="">Tüm konular</option>${TOPICS.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}</select><button class="btn" id="qs">▶ Başlat</button></div><div id="qa"></div>`));
  $('#qs').onclick = () => {
    const f = $('#qt').value; let pool = BANK.map((q, i) => ({ q, i })).filter(x => !f || x.q.t === f); pool = shuffle(pool).slice(0, 10);
    let n = 0, score = 0; const qa = $('#qa');
    function next() {
      if (n >= pool.length) { const good = score >= Math.ceil(pool.length * .8); if (good && pool.length >= 5) award('qr_' + Date.now(), 20, 'Tur bonusu!'); qa.innerHTML = ''; qa.appendChild(h(`<div class="result ${good ? 'good' : 'warn'}">Tur bitti: <b>${score}/${pool.length}</b> ${good ? '🎉' : '— tekrar dene!'}</div>`)); return; }
      const it = pool[n]; qa.innerHTML = ''; qa.appendChild(h(`<div class="prog">Soru ${n + 1}/${pool.length} · Skor ${score}</div>`));
      qa.appendChild(makeMC(it.q, { shuffle: true, onAnswer: g => { if (g) { score++; award('q_' + it.i, 5, 'Doğru!'); } const b = h('<button class="btn">Sonraki →</button>'); b.firstChild.onclick = () => { n++; next(); }; qa.appendChild(b.firstChild); } }));
    }
    next();
  };
};

ROUTES.baglam = () => {
  view.innerHTML = '';
  view.appendChild(h(`<h2>🧠 Bağlam Temelli Sorular</h2><p class="sub">Senaryoyu oku, yazılı cevabını kutulara gir. Yazım farklılıklarına toleranslıdır; “Model cevap” ile karşılaştır.</p>
   <div class="ctl"><select id="bf"><option value="">Tüm konular</option>${TOPICS.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}</select></div><div id="bl"></div>`));
  function list() {
    const f = $('#bf').value, bl = $('#bl'); bl.innerHTML = '';
    BAGLAM.filter(b => !f || b.topic === f).forEach((b, idx) => {
      const c = h(`<div class="bt-h"><span>${S.done['bt_' + b.id] ? '✅' : '❓'}</span><b>${b.title}</b></div><div class="ctx">${b.ctx}</div><p class="ask"><b>Soru:</b> ${b.ask}</p>
       ${b.parts.map((p, i) => `<label class="fld">${p.l}<input type="text" data-i="${i}" placeholder="Cevabını yaz…" autocomplete="off"></label>`).join('')}
       <div class="btns"><button class="btn chk">Kontrol et</button><button class="btn ghost mod">Model cevap</button></div><div class="fb"></div>`, 'btcard');
      $('.chk', c).onclick = () => {
        let ok = 0; $$('input', c).forEach((inp, i) => { const g = matchAny(inp.value, b.parts[i].a); inp.className = g ? 'ok' : 'bad'; if (g) ok++; });
        $('.fb', c).innerHTML = `<div class="result ${ok === b.parts.length ? 'good' : 'warn'}">${ok}/${b.parts.length} bölüm doğru ${ok === b.parts.length ? '🎉' : '— ipucu: kavramın bilimsel adını yaz'}</div>`;
        if (ok === b.parts.length) { award('bt_' + b.id, 25, 'Bağlam sorusu çözüldü!'); $('.bt-h span', c).textContent = '✅'; }
      };
      $('.mod', c).onclick = () => { $('.fb', c).innerHTML = `<div class="result good"><b>Model cevap:</b> ${b.model}</div>`; };
      bl.appendChild(c);
    });
  }
  $('#bf').onchange = list; list();
};

/* ---------- Yönlendirici ---------- */
function route() {
  if (cleanup) { try { cleanup(); } catch (e) { } cleanup = null; }
  const [, r, p] = (location.hash || '#/home').split('/'); const name = ROUTES[r] ? r : 'home';
  $$('nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + name));
  window.scrollTo(0, 0); ROUTES[name](p); hud();
}
window.addEventListener('hashchange', route);
window.addEventListener('load', route);
