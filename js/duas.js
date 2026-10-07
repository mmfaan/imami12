/* الأدعية والزيارات: بطاقات مصفّاة وقارئ سينمائي بتمرير تلقائي وتمييز للسطر الحالي */
W.on('duas', () => {
  const D = W.D, esc = W.esc, grid = $('#duaGrid'), rd = $('#reader'); if (!grid || !rd) return;
  const CATS = D.duaCats || [['all', 'الكل']], catName = c => (CATS.find(x => x[0] === c) || [0, c])[1];
  let cat = 'all', q = '', cur = null, play = false, raf = 0, acc = 0, mk = 0;
  let speed = +W.store.get('rdspeed', 2) || 2, fs = +W.store.get('rdfs', 30) || 30;
  const body = $('.rd-body', rd), inn = $('.rd-in', rd), title = $('.rd-top h3', rd), bar = $('.rd-bot i', rd);
  const f = $('#duaF'), qi = $('#duaQ');
  if (f) { f.innerHTML = CATS.map(c => '<button class="chip' + (c[0] === cat ? ' on' : '') + '" data-c="' + c[0] + '">' + c[1] + '</button>').join(''); f.onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; cat = b.dataset.c; $$('.chip', f).forEach(x => x.classList.toggle('on', x === b)); draw(); }; }
  if (qi) { let t = 0; qi.oninput = () => { clearTimeout(t); t = setTimeout(() => { q = qi.value; draw(); }, 200); }; }
  function draw() {
    const tk = TU.nz(q).split(' ').filter(Boolean);
    const arr = (D.duas || []).filter(d => (cat === 'all' || d.cat === cat) && (!tk.length || tk.every(t => (d._n || (d._n = TU.nz(d.t + ' ' + (d.sub || '') + ' ' + d.lines.join(' ')))).includes(t))));
    W.html(grid, arr.map((d, i) => '<div class="glass dua-card tilt rv" style="--i:' + (i % 6) + '" data-id="' + d.id + '"><h3>' + esc(d.t) + '</h3><p>' + esc(d.sub || '') + '</p><div class="meta"><span class="tag g">' + esc(catName(d.cat)) + '</span>' +
      (d.v ? '<span class="tag">✓ مطابق للمصدر</span>' : '<span class="tag" style="color:#ffd9a0;border-color:#ffd9a044">نص متداول — قابله بمفاتيح الجنان</span>') + '<span class="tag">' + d.lines.length + ' سطراً</span></div><button class="btn gold sm">اقرأ الآن</button></div>').join('') || '<p class="loadst">لا نتائج مطابقة.</p>');
  }
  grid.onclick = e => { const c = e.target.closest('.dua-card'); if (c) open(c.dataset.id); };
  function open(id) {
    const d = (D.duas || []).find(x => x.id === id); if (!d) return; cur = d; title.textContent = d.t;
    inn.innerHTML = '<p class="rd-intro">' + esc(d.intro || '') + '</p>' +
      (d.v ? '<p class="rd-intro ok">النص مطابق حرفياً لما في مصدره المذكور أدناه.</p>' : '<p class="rd-intro note">هذا النص متداول في كتب الأدعية (كمفاتيح الجنان) ولم تتم مطابقته آلياً بمكتبة الموقع؛ فإن وجدتَ اختلافاً فالمعتمد ما في المصدر المطبوع الموثوق.</p>') +
      d.lines.map((l, i) => '<div class="rd-line" data-i="' + i + '">' + esc(l) + '</div>').join('') +
      '<p class="rd-intro" style="margin-top:56px">' + esc(d.src || '') + (d.url ? ' <a class="src" target="_blank" rel="noopener" href="' + esc(d.url) + '">المصدر ↗</a>' : '') + '</p>';
    rd.style.setProperty('--fs', fs + 'px'); rd.classList.add('open'); body.scrollTop = 0; document.body.style.overflow = 'hidden';
    history.replaceState(null, '', '#' + id); mark(); upd();
  }
  function close() { rd.classList.remove('open'); play = false; cancelAnimationFrame(raf); document.body.style.overflow = ''; history.replaceState(null, '', location.pathname + location.search); upd(); }
  W.openDua = open;
  function mark() {
    mk = 0; const r = body.getBoundingClientRect(), mid = r.top + r.height * .42; let best = null, bd = 1e9;
    $$('.rd-line', inn).forEach(l => { const b = l.getBoundingClientRect(), d = Math.abs(b.top + b.height / 2 - mid); if (d < bd) { bd = d; best = l; } });
    $$('.rd-line.on', inn).forEach(l => { if (l !== best) l.classList.remove('on'); }); if (best) best.classList.add('on');
    const mx = body.scrollHeight - body.clientHeight; bar.style.width = (mx > 0 ? body.scrollTop / mx * 100 : 0).toFixed(1) + '%';
  }
  body.addEventListener('scroll', () => { if (!mk) mk = requestAnimationFrame(mark); }, { passive: true });
  ['wheel', 'touchstart'].forEach(ev => body.addEventListener(ev, () => { if (play) { play = false; upd(); } }, { passive: true }));
  inn.addEventListener('click', e => { const l = e.target.closest('.rd-line'); if (l) l.scrollIntoView({ block: 'center', behavior: 'smooth' }); });
  function tick() {
    if (!play) return; acc += speed * .55; const px = Math.floor(acc);
    if (px) { body.scrollTop += px; acc -= px; }
    if (body.scrollTop + body.clientHeight >= body.scrollHeight - 2) { play = false; upd(); return; }
    raf = requestAnimationFrame(tick);
  }
  function upd() { const p = $('#rdPlay'), s = $('#rdSpd'); if (p) p.textContent = play ? '⏸' : '▶'; if (s) s.textContent = '×' + speed; }
  const on = (id, fn) => { const b = $('#' + id); if (b) b.onclick = fn; };
  on('rdPlay', () => { play = !play; body.style.scrollBehavior = play ? 'auto' : ''; if (play) { acc = 0; tick(); } upd(); });
  on('rdSpd', () => { speed = speed % 5 + 1; W.store.set('rdspeed', speed); upd(); });
  on('rdPlus', () => { fs = Math.min(64, fs + 3); W.store.set('rdfs', fs); rd.style.setProperty('--fs', fs + 'px'); mark(); });
  on('rdMinus', () => { fs = Math.max(18, fs - 3); W.store.set('rdfs', fs); rd.style.setProperty('--fs', fs + 'px'); mark(); });
  on('rdSepia', () => rd.classList.toggle('sepia'));
  on('rdCopy', () => cur && W.copy(cur.t + '\n\n' + cur.lines.join('\n') + '\n\n' + (cur.src || '')));
  on('rdClose', close);
  document.addEventListener('keydown', e => {
    if (!rd.classList.contains('open')) return;
    if (e.key === 'Escape') close(); else if (e.key === ' ') { e.preventDefault(); $('#rdPlay').click(); } else if (e.key === '+' || e.key === '=') $('#rdPlus').click(); else if (e.key === '-') $('#rdMinus').click();
  });
  draw(); upd();
  const h = location.hash.slice(1); if (h && (D.duas || []).some(d => d.id === h)) setTimeout(() => open(h), 1900);
});
