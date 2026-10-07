/* مكتبة الأحاديث: تحميل كسول للكتب الأربعة، بحث نصي مع إبراز، أبواب، ترقيم، سند/متن، نسخ، بطاقة، مفضلة */
W.on('library', () => {
  const D = W.D, esc = W.esc, list = $('#libList'); if (!list) return;
  const KEYS = ['kamal', 'numani', 'tusi', 'kafi'];
  const TABS = [['kamal', 'كمال الدين'], ['numani', 'غيبة النعماني'], ['tusi', 'غيبة الطوسي'], ['kafi', 'الكافي'], ['sunni', 'مصادر أهل السنة'], ['quran', 'القرآن وتفسير أهل البيت'], ['fav', '★ مفضلتي']];
  const S = { tab: location.hash.slice(1) || 'kamal', ch: -1, q: '', page: 0, scope: 'book' };
  if (!TABS.some(t => t[0] === S.tab)) S.tab = 'kamal';
  const PS = 12, LIB = () => (window.__LIB = window.__LIB || {});
  const el = { tabs: $('#libTabs'), q: $('#libQ'), ch: $('#libCh'), sc: $('#libScope'), info: $('#libInfo'), stat: $('#libStat'), pager: $('#libPager') };
  let favs = W.store.get('favs', []), cur = [], built = '', token = 0;
  const isLib = () => KEYS.includes(S.tab);
  const nz = s => TU.nz(s);
  const MAP = { 'ا': '[اأإآٱ]', 'ي': '[يىئ]', 'ه': '[هة]', 'و': '[وؤ]' }, DIA = '[\\u064B-\\u065F\\u0670\\u0640]*';
  function hl(text, toks) {
    if (!toks.length) return esc(text);
    const re = new RegExp(toks.map(w => Array.from(w).map(ch => (MAP[ch] || ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) + DIA).join('')).join('|'), 'g');
    let out = '', last = 0, m;
    while ((m = re.exec(text))) { if (!m[0]) { re.lastIndex++; continue; } out += esc(text.slice(last, m.index)) + '<mark>' + esc(m[0]) + '</mark>'; last = m.index + m[0].length; }
    return out + esc(text.slice(last));
  }
  const split = text => {
    let r = null; try { r = TU.splitIsnad(text); } catch (e) { }
    if (!r) return { isn: '', matn: text };
    if (Array.isArray(r)) return { isn: r[0] || '', matn: r[1] || text };
    return { isn: r.isnad || r.isn || r.chain || '', matn: r.matn || r.text || r.body || text };
  };
  const gradeStr = g => !g ? '' : typeof g === 'string' ? g : Array.isArray(g) ? g.join(' | ') : Object.keys(g).map(k => k + ': ' + g[k]).join(' | ');
  const url = it => 'https://thaqalayn.net/hadith/' + it[3];
  const load = k => {
    const L = LIB(); if (L[k]) return Promise.resolve(L[k]);
    if (!load.p) load.p = {};
    return load.p[k] || (load.p[k] = new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'data/lib-' + k + '.js'; s.onload = () => L[k] ? res(L[k]) : rej(new Error('empty')); s.onerror = () => rej(new Error('load')); document.head.appendChild(s); }));
  };
  const toks = () => nz(S.q).split(' ').filter(Boolean);
  const hay = it => it._n || (it._n = nz(it[2] + ' ' + (it[5] || '')));

  function tabsUI() {
    el.tabs.innerHTML = TABS.map(t => '<button class="chip' + (t[0] === S.tab ? ' on' : '') + '" data-t="' + t[0] + '">' + t[1] + '</button>').join('');
    el.sc.style.display = isLib() ? '' : 'none';
    el.ch.style.display = isLib() && S.scope === 'book' ? '' : 'none';
  }
  function pager(total) {
    const pages = Math.ceil(total / PS);
    if (pages <= 1) { el.pager.innerHTML = ''; return; }
    const set = new Set([0, pages - 1, S.page - 2, S.page - 1, S.page, S.page + 1, S.page + 2].filter(p => p >= 0 && p < pages)); let h = '', prev = -1;
    Array.from(set).sort((a, b) => a - b).forEach(p => { if (p - prev > 1) h += '<span style="align-self:center">…</span>'; h += '<button class="chip' + (p === S.page ? ' on' : '') + '" data-pg="' + p + '">' + (p + 1) + '</button>'; prev = p; });
    el.pager.innerHTML = h;
  }
  const stat = (n, total) => { el.stat.textContent = total ? 'عرض ' + (S.page * PS + 1) + '–' + Math.min(total, (S.page + 1) * PS) + ' من ' + total + ' حديثاً' : 'لا نتائج مطابقة'; };

  async function render() {
    const my = ++token; tabsUI();
    if (S.tab === 'quran') return renderQuran();
    if (S.tab === 'sunni') return renderSunni();
    const all = S.tab === 'fav' || S.scope === 'all', keys = all ? KEYS : [S.tab], need = keys.filter(k => !LIB()[k]);
    if (need.length) {
      list.innerHTML = '<p class="loadst">⏳ يُحمَّل النص من مكتبة الموقع…</p>'; el.stat.textContent = '';
      try { await Promise.all(need.map(load)); } catch (e) { list.innerHTML = '<p class="loadst">تعذّر تحميل الكتاب — تأكّد من وجود مجلد data بجوار الصفحة ثم أعد المحاولة.</p>'; return; }
      if (my !== token) return;
    }
    if (!all) {
      const L = LIB()[S.tab];
      if (built !== S.tab) { el.ch.innerHTML = '<option value="-1">كل الأبواب (' + L.items.length + ')</option>' + L.chs.map((c, i) => '<option value="' + i + '">' + esc(c[0]) + ' (' + c[1] + ')</option>').join(''); built = S.tab; }
      el.ch.value = String(S.ch);
      el.info.innerHTML = '<div class="glass rv in"><h3>' + esc(L.name || S.tab) + '</h3><p>' + esc(L.author || '') + (L.blurb ? ' — ' + esc(L.blurb) : '') + '</p><span class="tag g">' + L.items.length + ' حديثاً</span><span class="tag">' + L.chs.length + ' باباً</span></div>';
    } else el.info.innerHTML = S.tab === 'fav' ? '<div class="note">الأحاديث التي حفظتَها بالنجمة تُخزَّن في متصفحك فقط.</div>' : '<div class="note">البحث يشمل الكتب الأربعة معاً.</div>';
    const tk = toks(), rows = [];
    for (const k of keys) for (const it of LIB()[k].items) {
      if (S.tab === 'fav' && !favs.includes(k + ':' + it[3])) continue;
      if (!all && S.ch >= 0 && it[1] !== S.ch) continue;
      if (tk.length) { const h = hay(it); if (!tk.every(t => h.includes(t))) continue; }
      rows.push([k, it]);
    }
    const maxP = Math.max(0, Math.ceil(rows.length / PS) - 1); if (S.page > maxP) S.page = maxP;
    cur = rows.slice(S.page * PS, (S.page + 1) * PS);
    W.html(list, cur.length ? cur.map((r, i) => card(r[0], r[1], i, tk)).join('') : '<p class="loadst">لا توجد نتائج مطابقة — جرّب كلمات أقل أو غيّر الباب.</p>');
    stat(cur.length, rows.length); pager(rows.length);
  }
  function card(k, it, i, tk) {
    const L = LIB()[k], sp = split(it[2]), g = gradeStr(it[4]), key = k + ':' + it[3], f = favs.includes(key);
    return '<article class="glass hd rv" data-i="' + i + '" style="--i:' + (i % 4) + '"><div class="hd-meta"><span class="tag g">' + esc(L.name || k) + '</span><span class="tag">' + esc((L.chs[it[1]] || [''])[0]) + '</span><span>حديث ' + it[0] + '</span>' + (g ? '<span class="grade">' + esc(g) + '</span>' : '') + '</div>' +
      (sp.isn ? '<div class="hd-isn"><b style="color:var(--gold)">السند:</b> ' + hl(sp.isn, tk) + '</div>' : '') +
      '<div class="hd-txt">' + hl(sp.matn, tk) + '</div><div class="hd-act">' + (sp.isn ? '<button class="chip" data-a="isn">السند</button>' : '') + '<button class="chip" data-a="cp">نسخ</button><button class="chip" data-a="qc">بطاقة</button><button class="chip' + (f ? ' on' : '') + '" data-a="fav">' + (f ? '★ محفوظ' : '☆ حفظ') + '</button><a class="src" target="_blank" rel="noopener" href="' + esc(url(it)) + '">المصدر في thaqalayn.net ↗</a></div></article>';
  }
  function plain(items, tk, build) {
    const rows = items.filter(x => !tk.length || tk.every(t => (x._n || (x._n = nz(x.hay))).includes(t)));
    const maxP = Math.max(0, Math.ceil(rows.length / PS) - 1); if (S.page > maxP) S.page = maxP;
    cur = rows.slice(S.page * PS, (S.page + 1) * PS);
    W.html(list, cur.length ? cur.map((x, i) => build(x, i)).join('') : '<p class="loadst">لا توجد نتائج مطابقة.</p>'); stat(cur.length, rows.length); pager(rows.length);
  }
  function renderSunni() {
    el.info.innerHTML = '<div class="note">أحاديث صحيحة في كتب أهل السنة تدل على أن الأئمة اثنا عشر وعلى ظهور المهدي من أهل البيت (ع)؛ أُدرجت بأرقامها المعيارية بعد مطابقة النص بالمصدر. يمكن الرجوع إليها في موقع sunnah.com.</div>'; built = '';
    const tk = toks(); plain((D.sunni || []).map(x => Object.assign(x, { hay: x.t + ' ' + x.src + ' ' + (x.ch || '') })), tk, (x, i) =>
      '<article class="glass hd rv" data-i="' + i + '"><div class="hd-meta"><span class="tag g">' + esc(x.book) + '</span><span class="tag">' + esc(x.ch || '') + '</span><span>' + esc(x.num || '') + '</span></div><div class="hd-txt">' + hl(x.t, tk) + '</div>' + (x.note ? '<p class="note" style="margin-top:12px">' + esc(x.note) + '</p>' : '') + '<div class="hd-act"><button class="chip" data-a="cps">نسخ</button><button class="chip" data-a="qcs">بطاقة</button>' + (x.url ? '<a class="src" target="_blank" rel="noopener" href="' + esc(x.url) + '">المصدر ↗</a>' : '') + '</div></article>');
  }
  function renderQuran() {
    el.info.innerHTML = '<div class="note">نصوص الآيات من مصحف تنزيل (الرسم الإملائي). وما ورد في تفسيرها نُقل من روايات أهل البيت (ع) كما في المصادر المذكورة تحت كل آية.</div>'; built = '';
    const tk = toks(); plain((D.quran || []).map(x => Object.assign(x, { hay: x.r + ' ' + x.t + ' ' + (x.n || '') })), tk, (x, i) =>
      '<article class="glass qr-item hd rv" data-i="' + i + '"><div class="ay">﴿' + hl(x.t, tk) + '﴾</div><span class="ref">' + esc(x.r) + '</span>' + (x.n ? '<p style="margin-top:12px">' + esc(x.n) + '</p>' : '') +
      (x.h || []).map(h => '<blockquote class="note" style="margin-top:12px"><q style="font:400 19px/2 var(--f-serif);color:#fff6d6">' + esc(h.t) + '</q><br><a class="src" target="_blank" rel="noopener" href="' + esc(h.url) + '">' + esc(h.src) + ' ↗</a></blockquote>').join('') +
      '<div class="hd-act"><button class="chip" data-a="cpq">نسخ الآية</button></div></article>');
  }

  /* أحداث */
  el.tabs.onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; S.tab = b.dataset.t; S.ch = -1; S.page = 0; history.replaceState(null, '', '#' + S.tab); render(); };
  el.ch.onchange = () => { S.ch = +el.ch.value; S.page = 0; render(); };
  el.sc.onchange = () => { S.scope = el.sc.value; S.page = 0; render(); };
  let dt = 0; el.q.oninput = () => { clearTimeout(dt); dt = setTimeout(() => { S.q = el.q.value; S.page = 0; render(); }, 220); };
  el.pager.onclick = e => { const b = e.target.closest('[data-pg]'); if (!b) return; S.page = +b.dataset.pg; render().then(() => scrollTo({ top: list.getBoundingClientRect().top + scrollY - 170, behavior: 'smooth' })); };
  list.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b) return; const art = b.closest('.hd'), r = cur[+art.dataset.i]; if (!r) return; const a = b.dataset.a;
    if (a === 'isn') art.classList.toggle('open');
    else if (a === 'cp' || a === 'qc') {
      const k = r[0], it = r[1], L = LIB()[k], sp = split(it[2]), src = (L.name || k) + ' — ' + ((L.chs[it[1]] || [''])[0]) + ' — حديث ' + it[0];
      if (a === 'cp') W.copy('«' + sp.matn + '»\n— ' + src + '\n' + url(it)); else W.qcard.modal(sp.matn, src);
    } else if (a === 'fav') {
      const key = r[0] + ':' + r[1][3]; favs = favs.includes(key) ? favs.filter(x => x !== key) : favs.concat(key); W.store.set('favs', favs);
      b.classList.toggle('on', favs.includes(key)); b.textContent = favs.includes(key) ? '★ محفوظ' : '☆ حفظ'; if (S.tab === 'fav') render();
    } else if (a === 'cps') W.copy('«' + r.t + '»\n— ' + r.book + ' — ' + (r.num || '') + ' — ' + (r.ch || ''));
    else if (a === 'qcs') W.qcard.modal(r.t, r.book + ' — ' + (r.num || '') + (r.ch ? ' — ' + r.ch : ''));
    else if (a === 'cpq') W.copy('﴿' + r.t + '﴾ ' + r.r);
  });
  addEventListener('hashchange', () => { const h = location.hash.slice(1); if (TABS.some(t => t[0] === h) && h !== S.tab) { S.tab = h; S.ch = -1; S.page = 0; render(); } });
  render();
});
