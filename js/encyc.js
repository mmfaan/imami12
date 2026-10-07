/* الموسوعة: قارئ المقالات (فهرس، بحث، تقدّم القراءة، اقتباسات موثقة)، الأسئلة الشائعة، المصطلحات (أ–ي)، الأماكن والخريطة */
W.on('encyc', () => {
  const D = W.D, esc = W.esc, A = D.articles || [];
  const tabs = $('#encTabs'), SEC = { art: $('#secArt'), faq: $('#secFaq'), gl: $('#secGl'), pl: $('#secPl') };
  const T = [['art', 'المقالات'], ['faq', 'الأسئلة الشائعة'], ['gl', 'المصطلحات'], ['pl', 'الأماكن والخريطة']];
  const nz = s => TU.nz(s);
  function tab(t) {
    Object.keys(SEC).forEach(k => { if (SEC[k]) SEC[k].hidden = k !== t; });
    $$('.chip', tabs).forEach(c => c.classList.toggle('on', c.dataset.t === t));
    if (t === 'pl') window.dispatchEvent(new Event('resize'));
  }
  tabs.innerHTML = T.map(t => '<button class="chip" data-t="' + t[0] + '">' + t[1] + '</button>').join('');
  tabs.onclick = e => { const b = e.target.closest('[data-t]'); if (b) { tab(b.dataset.t); history.replaceState(null, '', '#' + (b.dataset.t === 'art' ? '' : b.dataset.t)); } };

  /* ─── المقالات ─── */
  const toc = $('#encToc'), art = $('#encBody'), qin = $('#encQ'), prog = $('.art-prog i');
  const GR = D.artGroups || [], gname = g => (GR.find(x => x[0] === g) || [0, g])[1];
  let cur = null;
  function tocDraw() {
    const tk = nz(qin.value || '').split(' ').filter(Boolean), by = {};
    A.forEach(a => { if (tk.length && !tk.every(t => (a._n || (a._n = nz(a.title + ' ' + a.sum + ' ' + (a.tags || []).join(' ')))).includes(t))) return; (by[a.group] = by[a.group] || []).push(a); });
    toc.innerHTML = GR.filter(g => by[g[0]]).map(g => '<div class="enc-g">' + esc(g[1]) + '</div>' + by[g[0]].map(a => '<button class="enc-b' + (cur && cur.id === a.id ? ' on' : '') + '" data-id="' + a.id + '">' + esc(a.title) + '</button>').join('')).join('') || '<p class="loadst">لا نتائج</p>';
  }
  const blk = (b, i) => {
    const k = b[0], v = b[1];
    if (k === 'h') return '<h2 id="s' + i + '">' + esc(v) + '</h2>';
    if (k === 'p') return '<p>' + esc(v) + '</p>';
    if (k === 'ul') return '<ul>' + v.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    if (k === 'note') return '<div class="note" style="margin:16px 0">' + esc(v) + '</div>';
    if (k === 'q') return '<blockquote><q>' + esc(v.t) + '</q><cite>' + esc(v.src) + (v.g ? ' — <span class="grade">' + esc(v.g) + '</span>' : '') + (v.url ? ' <a class="src" target="_blank" rel="noopener" href="' + esc(v.url) + '">المصدر ↗</a>' : '') + '</cite></blockquote>';
    return '';
  };
  function open(id, keep) {
    const a = A.find(x => x.id === id) || A[0]; if (!a) return; cur = a;
    const words = a.blocks.reduce((n, b) => n + (typeof b[1] === 'string' ? b[1] : Array.isArray(b[1]) ? b[1].join(' ') : (b[1] && b[1].t) || '').split(/\s+/).length, 0);
    const hs = a.blocks.map((b, i) => [b, i]).filter(x => x[0][0] === 'h'), ix = A.indexOf(a), pv = A[ix - 1], nx = A[ix + 1];
    art.innerHTML = '<div class="hd-meta"><span class="tag g">' + esc(gname(a.group)) + '</span><span>≈ ' + Math.max(1, Math.round(words / 170)) + ' دقائق قراءة</span>' + (a.tags || []).map(t => '<span class="tag">' + esc(t) + '</span>').join('') + '</div><h1>' + esc(a.title) + '</h1><div class="sum">' + esc(a.sum) + '</div>' +
      (hs.length > 2 ? '<div class="tabs" style="justify-content:flex-start;margin-bottom:10px">' + hs.map(h => '<button class="chip" data-s="s' + h[1] + '">' + esc(h[0][1]) + '</button>').join('') + '</div>' : '') +
      a.blocks.map(blk).join('') + (a.refs && a.refs.length ? '<div class="refs"><b style="color:var(--gold)">المصادر والمراجع</b><ul>' + a.refs.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul></div>' : '') +
      '<div class="cta" style="margin-top:30px;justify-content:space-between">' + (pv ? '<button class="btn ghost" data-id="' + pv.id + '">‹ ' + esc(pv.title) + '</button>' : '<span></span>') + (nx ? '<button class="btn ghost" data-id="' + nx.id + '">' + esc(nx.title) + ' ›</button>' : '<span></span>') + '</div>';
    $$('.enc-b', toc).forEach(b => b.classList.toggle('on', b.dataset.id === a.id));
    if (!keep) scrollTo({ top: $('.enc').getBoundingClientRect().top + scrollY - 90, behavior: 'smooth' });
    if (location.hash !== '#a-' + a.id) history.replaceState(null, '', '#a-' + a.id);
  }
  if (toc && art) {
    let t = 0; qin.oninput = () => { clearTimeout(t); t = setTimeout(tocDraw, 180); };
    toc.onclick = e => { const b = e.target.closest('[data-id]'); if (b) open(b.dataset.id); };
    art.onclick = e => { const b = e.target.closest('[data-id]'); if (b) { open(b.dataset.id); return; } const s = e.target.closest('[data-s]'); if (s) { const h = document.getElementById(s.dataset.s); h && scrollTo({ top: h.getBoundingClientRect().top + scrollY - 100, behavior: 'smooth' }); } };
    addEventListener('scroll', () => { if (!prog || !art.offsetHeight) return; const r = art.getBoundingClientRect(), p = (innerHeight * .3 - r.top) / Math.max(1, r.height - innerHeight * .4); prog.style.width = Math.max(0, Math.min(1, p)) * 100 + '%'; }, { passive: true });
    tocDraw();
  }

  /* ─── الأسئلة الشائعة ─── */
  const fl = $('#faqList'), fq = $('#faqQ');
  const faq = () => {
    const tk = nz(fq.value || '').split(' ').filter(Boolean);
    W.html(fl, (D.faq || []).filter(x => !tk.length || tk.every(t => (x._n || (x._n = nz(x.q + ' ' + x.a))).includes(t))).map((x, i) => '<div class="glass faq-i rv" style="--i:' + (i % 5) + '"><button>' + esc(x.q) + '</button><div class="a">' + esc(x.a) + (x.src ? '<br><span class="src">' + esc(x.src) + '</span>' : '') + '</div></div>').join('') || '<p class="loadst">لا نتائج</p>');
  };
  if (fl) { fl.onclick = e => { const b = e.target.closest('.faq-i button'); if (b) b.parentElement.classList.toggle('open'); }; let t = 0; fq.oninput = () => { clearTimeout(t); t = setTimeout(faq, 180); }; faq(); }

  /* ─── المصطلحات ─── */
  const gl = $('#glList'), az = $('#glAz'), gq = $('#glQ');
  if (gl) {
    const first = t => { const s = t.replace(/^(ال|أل)/, '').replace(/[ً-ٰٟ]/g, ''), c = s.charAt(0); return /[أإآٱ]/.test(c) ? 'ا' : c === 'ى' ? 'ي' : c; };
    const G = (D.glossary || []).slice().sort((a, b) => a.t.localeCompare(b.t, 'ar'));
    const letters = Array.from(new Set(G.map(g => first(g.t)))); let L = '';
    const draw = () => {
      const tk = nz(gq.value || '').split(' ').filter(Boolean);
      W.html(gl, G.filter(g => (!L || first(g.t) === L) && (!tk.length || tk.every(t => (g._n || (g._n = nz(g.t + ' ' + g.d))).includes(t)))).map((g, i) => '<div class="glass gl-i rv" style="--i:' + (i % 6) + '"><h4>' + esc(g.t) + '</h4><p>' + esc(g.d) + '</p></div>').join('') || '<p class="loadst">لا نتائج</p>');
      $$('button', az).forEach(b => b.classList.toggle('on', b.dataset.l === L));
    };
    az.innerHTML = '<button data-l="">الكل</button>' + letters.map(l => '<button data-l="' + l + '">' + l + '</button>').join('');
    az.onclick = e => { const b = e.target.closest('button'); if (b) { L = b.dataset.l; draw(); } };
    let t = 0; gq.oninput = () => { clearTimeout(t); t = setTimeout(draw, 180); }; draw();
  }

  /* ─── الأماكن ─── */
  const pl = $('#plList');
  if (pl && D.places) W.html(pl, D.places.map((p, i) => '<div class="glass tilt rv" style="--i:' + (i % 6) + '"><h3>' + esc(p.n) + '</h3><p>' + esc(p.t) + '</p>' + (p.cat ? '<span class="tag">' + esc(p.cat) + '</span>' : '') + '</div>').join(''));

  /* ─── التوجيه ─── */
  function route() {
    const h = location.hash.slice(1);
    if (h.indexOf('a-') === 0) { tab('art'); open(h.slice(2), true); }
    else if (SEC[h]) tab(h); else { tab('art'); if (!cur) open(A[0] && A[0].id, true); }
  }
  addEventListener('hashchange', route); route();
});
