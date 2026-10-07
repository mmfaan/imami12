/* النواة: أدوات مشتركة، التقويم الهجري، النوافذ، البحث السريع، الإقلاع */
(() => {
  'use strict';
  const W = window.W = window.W || {};
  const $ = W.$ = (s, r) => (r || document).querySelector(s);
  const $$ = W.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  window.$ = $; window.$$ = $$;
  W.D = window.D = window.D || {};
  W.inits = [];
  W.on = (n, f) => W.inits.push({ n, f });
  W.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  W.store = {
    get(k, d) { try { const v = localStorage.getItem('mhd.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('mhd.' + k, JSON.stringify(v)); } catch (e) { } }
  };
  W.safe = (n, f) => { try { return f(); } catch (e) { console.warn('[' + n + ']', e); } };
  W.html = (el, h) => { if (!el) return el; el.innerHTML = h; W.reveal(el); return el; };
  W.rand = a => a[Math.floor(Math.random() * a.length)];
  W.shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  W.copy = async t => {
    try { await navigator.clipboard.writeText(t); } catch (e) {
      const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select();
      try { document.execCommand('copy'); } catch (_) { } a.remove();
    }
    W.toast('تم النسخ ✓');
  };
  W.toast = m => {
    $$('.toast').forEach(x => x.remove());
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t);
    setTimeout(() => t.remove(), 2600);
  };

  /* ───── الهجري ───── */
  const HM = W.HM = ['محرّم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجّة'];
  W.DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  let fm = null;
  try { fm = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' }); } catch (e) { }
  W.hAdj = +W.store.get('hadj', 0) || 0;
  W.setAdj = n => { W.hAdj = n; W.store.set('hadj', n); };
  W.hj = (d, adj) => {
    if (!fm) return null;
    const x = new Date(d.getTime() + (adj == null ? W.hAdj : adj) * 864e5), p = {};
    fm.formatToParts(x).forEach(o => p[o.type] = o.value);
    return { y: +p.year, m: +p.month, d: +p.day };
  };
  W.noon = d => { const x = new Date(d); x.setHours(12, 0, 0, 0); return x; };
  W.addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  W.hjStr = h => h ? h.d + ' ' + HM[h.m - 1] + ' ' + h.y + ' هـ' : '';
  W.nextOcc = (m, d) => {
    if (!W._oi) { const o = {}, s = W.noon(new Date()); for (let i = 0; i < 400; i++) { const x = W.addDays(s, i), h = W.hj(x); if (!h) break; const k = h.m * 100 + h.d; if (o[k] == null) o[k] = i; } W._oi = { o, s }; }
    const i = W._oi.o[m * 100 + d]; return i == null ? null : { date: W.addDays(W._oi.s, i), days: i };
  };
  W.openDua = id => { location.href = 'duas.html#' + id; };
  W.gFmt = (d, o) => d.toLocaleDateString('ar-IQ-u-nu-latn', o || { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  W.monthStart = d => { const s = W.noon(d), h = W.hj(s); return W.addDays(s, -(h.d - 1)); };
  W.monthLen = first => { const h0 = W.hj(first); let n = 0; for (let i = 0; i < 31; i++) { if (W.hj(W.addDays(first, i)).m !== h0.m) break; n++; } return n; };
  W.untilFriday = () => { const n = new Date().getDay(); return (5 - n + 7) % 7; };

  /* ───── الكشف عن العناصر عند التمرير ───── */
  let io = null;
  try {
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1, rootMargin: '0px 0px -5% 0px' });
  } catch (e) { }
  W.reveal = (root) => {
    $$('.rv:not(.seen)', root || document).forEach(el => { el.classList.add('seen'); if (io) io.observe(el); else el.classList.add('in'); });
  };

  /* ───── نافذة منبثقة ───── */
  W.modal = (h, cls) => {
    const m = $('#modal'); if (!m) return;
    $('.modal-box', m).className = 'modal-box glass ' + (cls || '');
    $('#modalBody').innerHTML = h; m.classList.add('open'); W.reveal(m);
  };
  W.closeModal = () => { const m = $('#modal'); m && m.classList.remove('open'); };

  /* ───── البحث السريع (Ctrl+K) ───── */
  function palette() {
    const pal = $('#pal'), inp = $('#palIn'), res = $('#palRes'); if (!pal || !inp || !res) return;
    let sel = 0, list = [];
    const nz = s => (window.TU ? TU.nz(s) : String(s).toLowerCase());
    const render = q => {
      const S = (W.D && W.D.search) || [];
      const toks = nz(q || '').split(' ').filter(Boolean);
      if (!toks.length) list = S.filter(s => s[0] === 'صفحة').concat(S.filter(s => s[0] === 'مقالة').slice(0, 8));
      else list = S.map(s => {
        const hay = s._n || (s._n = nz(s[1] + ' ' + (s[3] || ''))), tt = s._t || (s._t = nz(s[1]));
        let sc = 0; for (const t of toks) { if (!hay.includes(t)) return null; sc += tt.includes(t) ? 3 : 1; }
        return [sc, s];
      }).filter(Boolean).sort((a, b) => b[0] - a[0]).slice(0, 40).map(x => x[1]);
      sel = 0; paint();
    };
    const paint = () => {
      res.innerHTML = list.length ? list.map((s, i) => '<a href="' + W.esc(s[2]) + '" class="' + (i === sel ? 'on' : '') + '"><small>' + W.esc(s[0]) + '</small><span>' + W.esc(s[1]) + '</span></a>').join('') : '<p class="loadst">لا نتائج مطابقة</p>';
      const on = $('a.on', res); on && on.scrollIntoView({ block: 'nearest' });
    };
    const open = () => { pal.classList.add('open'); inp.value = ''; render(''); setTimeout(() => inp.focus(), 40); };
    const close = () => pal.classList.remove('open');
    W.openPalette = open;
    inp.addEventListener('input', () => render(inp.value));
    inp.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, list.length - 1); paint(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); paint(); e.preventDefault(); }
      else if (e.key === 'Enter' && list[sel]) { location.href = list[sel][2]; }
    });
    pal.addEventListener('click', e => { if (e.target === pal) close(); });
    document.addEventListener('keydown', e => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); open(); }
      if (e.key === 'Escape') { close(); W.closeModal(); }
    });
    $$('[data-pal]').forEach(b => b.addEventListener('click', open));
  }

  /* ───── الهيكل العام ───── */
  function shell() {
    const chip = $('#hjChip'), h = W.hj(new Date());
    if (chip && h) chip.textContent = W.hjStr(h);
    const bg = $('.burger'), ln = $('.links');
    if (bg && ln) { bg.addEventListener('click', () => ln.classList.toggle('open')); ln.addEventListener('click', e => { if (e.target.closest('a')) ln.classList.remove('open'); }); }
    const m = $('#modal');
    if (m) { m.addEventListener('click', e => { if (e.target === m || e.target.closest('.modal-x')) W.closeModal(); }); }
    palette();
    $$('[data-copy]').forEach(b => b.addEventListener('click', () => W.copy(b.dataset.copy)));
    if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { });
  }

  function boot() {
    W.safe('shell', shell);
    W.inits.forEach(i => W.safe(i.n, i.f));
    W.reveal(document);
    const out = () => { const p = $('#pre'); if (!p) return; p.classList.add('out'); setTimeout(() => p.remove(), 1300); };
    const go = () => setTimeout(out, 1700);
    if (document.readyState === 'complete') go(); else addEventListener('load', go);
    setTimeout(out, 5000);
    document.body.classList.add('ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
