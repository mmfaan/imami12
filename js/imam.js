/* صفحة الإمام: بطاقة الهوية، سلسلة النسب، نجمة الأئمة الاثني عشر التفاعلية، الأسماء والألقاب، القصص */
W.on('imam', () => {
  const D = W.D, esc = W.esc;
  const idc = $('#idcard');
  if (idc && D.idcard) W.html(idc, D.idcard.map(r => '<div class="kv"><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>').join(''));

  /* سلسلة النسب */
  const ch = $('#chain');
  if (ch && D.imams) {
    W.html(ch, '<div class="cn rv" style="--i:0"><div class="dot">ص</div><h4>النبي الأكرم</h4><small>محمد بن عبد الله (ص)</small></div>' +
      D.imams.map((m, i) => '<div class="cn rv' + (i === 11 ? ' last' : '') + '" style="--i:' + ((i + 1) % 8) + '"><div class="dot">' + (i + 1) + '</div><h4>' + esc(m.short) + '</h4><small>' + esc(m.lq || '') + '</small></div>').join(''));
    const last = $('.cn.last', ch); if (last) setTimeout(() => last.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }), 400);
  }

  /* نجمة الأئمة: اثنتا عشرة عقدة، وخط واحد مغلق يصل كل إمام بالخامس بعده فتتشكل النجمة الاثنا عشرية */
  const st = $('#soiStage');
  if (st && D.imams) {
    const pos = i => { const a = i * Math.PI / 6; return [50 + 41 * Math.sin(a), 50 - 41 * Math.cos(a)]; };
    let path = ''; for (let k = 0; k < 12; k++) { const p = pos((k * 5) % 12); path += (k ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2); } path += 'Z';
    const ring = '<circle cx="50" cy="50" r="41" fill="none" stroke="#e8c872" stroke-opacity=".28" stroke-dasharray="1 2"/><circle cx="50" cy="50" r="24" fill="none" stroke="#7fe3d0" stroke-opacity=".18"/>';
    st.innerHTML = '<svg class="bgs" viewBox="0 0 100 100" aria-hidden="true">' + ring +
      '<path d="' + path + '" fill="none" stroke="#e8c872" stroke-width=".5" stroke-opacity=".75" style="stroke-dasharray:420;stroke-dashoffset:420;animation:draw 4s .4s var(--ease) forwards"/></svg>' +
      '<div class="soi-center" style="animation:spin 80s linear infinite">' + STAR.emblem({ id: 'soiE' }) + '</div>' +
      D.imams.map((m, i) => { const p = pos(i); return '<button class="soi-node' + (i === 11 ? ' m' : '') + '" data-i="' + i + '" style="right:' + (100 - p[0]).toFixed(2) + '%;top:' + p[1].toFixed(2) + '%" aria-label="' + esc(m.name) + '"><span>' + esc(m.short) + '<em>' + (i + 1) + '</em></span></button>'; }).join('');
    const panel = $('#soiPanel'); let cur = -1, auto = true;
    const show = i => {
      cur = i; const m = D.imams[i];
      $$('.soi-node', st).forEach(n => n.classList.toggle('on', +n.dataset.i === i));
      if (!panel) return;
      panel.innerHTML = '<h3>' + esc(m.name) + ' <small style="font:400 15px var(--f-body);color:var(--teal)">(عليه السلام) — الإمام ' + esc(m.ord) + '</small></h3>' +
        '<div class="meta">' + (m.kun ? '<span class="tag g">' + esc(m.kun) + '</span>' : '') + (m.lq ? '<span class="tag">' + esc(m.lq) + '</span>' : '') + '</div>' +
        '<div class="idcard"><div class="kv"><b>الولادة</b><span>' + esc(m.born) + '</span></div><div class="kv"><b>الأم</b><span>' + esc(m.mother) + '</span></div><div class="kv"><b>الوفاة/الشهادة</b><span>' + esc(m.died) + '</span></div></div>' +
        '<p style="margin-top:10px">' + esc(m.bio) + '</p>' +
        (m.q ? '<q>' + esc(m.q.t) + '</q><a class="src" target="_blank" rel="noopener" href="' + esc(m.q.url) + '">' + esc(m.q.src) + ' ↗</a>' : '');
    };
    st.addEventListener('click', e => { const b = e.target.closest('.soi-node'); if (b) { auto = false; show(+b.dataset.i); } });
    st.addEventListener('pointerover', e => { const b = e.target.closest('.soi-node'); if (b && auto) show(+b.dataset.i); });
    show(11);
    setInterval(() => { if (auto && !document.hidden) show((cur + 1) % 12); }, 7000);
  }

  /* الأسماء والألقاب: بطاقات تنقلب */
  const nm = $('#names');
  if (nm && D.names) {
    W.html(nm, D.names.map((n, i) => '<div class="fl rv" tabindex="0" style="--i:' + (i % 8) + '"><div class="fc"><div class="ff"><b>' + esc(n.n) + '</b><span>' + esc(n.s || '') + '</span></div><div class="fb">' + esc(n.b) + '</div></div></div>').join(''));
    $$('.fl', nm).forEach(f => f.addEventListener('click', () => f.classList.toggle('fp')));
  }

  /* قصص وبطاقات */
  const sy = $('#story');
  if (sy && D.story) W.html(sy, D.story.map((s, i) => '<div class="glass tilt rv" style="--i:' + (i % 6) + '"><h3>' + esc(s.t) + '</h3><p>' + esc(s.p) + '</p>' + (s.src ? '<span class="src">' + esc(s.src) + '</span>' : '') + '</div>').join(''));
});
