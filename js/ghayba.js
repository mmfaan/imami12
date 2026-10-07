/* صفحة الغيبة: خط زمني يتوهّج، شمس خلف السحاب، السفراء الأربعة، التوقيعات، ٣١٣ نجماً، علامات الظهور، الواجبات */
W.on('ghayba', () => {
  const D = W.D, esc = W.esc;

  /* الخط الزمني */
  const tl = $('#tl');
  if (tl && D.timeline) {
    W.html(tl, '<div class="tl-line"></div>' + D.timeline.map((e, i) => '<div class="tl-i k-' + (e.k || 'event') + ' rv" style="--i:' + (i % 3) + '"><span class="dt"></span><div class="glass"><div class="y">' + esc(e.y) + '</div><h4>' + esc(e.t) + '</h4><p>' + esc(e.p) + '</p></div></div>').join(''));
    const line = $('.tl-line', tl), items = $$('.tl-i', tl);
    const upd = () => { const r = tl.getBoundingClientRect(), y = innerHeight * .55; line.style.height = Math.max(0, Math.min(r.height, y - r.top)) + 'px'; items.forEach(it => it.classList.toggle('lit', it.getBoundingClientRect().top < y)); };
    let q = 0; addEventListener('scroll', () => { if (!q) q = requestAnimationFrame(() => { q = 0; upd(); }); }, { passive: true }); upd();
  }

  /* الشمس خلف السحاب */
  const sw = $('#sunWrap'), scv = sw && $('canvas', sw);
  if (scv) {
    const cx = scv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
    let w = 0, h = 0, px = .5, tpx = .5, on = false;
    const rs = () => { const r = scv.getBoundingClientRect(); w = scv.width = Math.max(300, Math.floor(r.width * dpr)); h = scv.height = Math.max(200, Math.floor(r.height * dpr)); };
    rs(); addEventListener('resize', rs);
    new IntersectionObserver(e => on = e[0].isIntersecting).observe(scv);
    scv.addEventListener('pointermove', e => { const r = scv.getBoundingClientRect(); tpx = (e.clientX - r.left) / r.width; });
    const clouds = Array.from({ length: 10 }, () => ({ x: Math.random() * 1.4 - .2, y: .22 + Math.random() * .5, s: .11 + Math.random() * .15, v: .00005 + Math.random() * .00007, a: .55 + Math.random() * .4, p: Array.from({ length: 8 }, () => [(Math.random() - .5) * 2, (Math.random() - .5) * .55, .42 + Math.random() * .55]) }));
    const stars = Array.from({ length: 70 }, () => [Math.random(), Math.random() * .6, Math.random() * 6.28]);
    const sky = [[0, '#07122b'], [.5, '#1b3a6e'], [.82, '#c98a52'], [1, '#f1b36b']];
    (function loop(t) {
      requestAnimationFrame(loop); if (!on) return;
      px += (tpx - px) * .04;
      const g = cx.createLinearGradient(0, 0, 0, h); sky.forEach(s => g.addColorStop(s[0], s[1])); cx.fillStyle = g; cx.fillRect(0, 0, w, h);
      stars.forEach(s => { cx.globalAlpha = (.4 + .6 * Math.sin(t * .002 + s[2])) * .8; cx.fillStyle = '#fff'; cx.fillRect(s[0] * w, s[1] * h, 1.6 * dpr, 1.6 * dpr); }); cx.globalAlpha = 1;
      const sx = w * .5, sy = h * .5, sr = h * .1;
      const hg = cx.createRadialGradient(sx, sy, 0, sx, sy, sr * 5); hg.addColorStop(0, 'rgba(255,244,200,.95)'); hg.addColorStop(.25, 'rgba(255,214,130,.45)'); hg.addColorStop(1, 'rgba(255,214,130,0)'); cx.fillStyle = hg; cx.fillRect(0, 0, w, h);
      cx.save(); cx.translate(sx, sy); cx.rotate(t * .00012);
      for (let i = 0; i < 24; i++) { cx.rotate(Math.PI / 12); const lg = cx.createLinearGradient(0, 0, sr * 7, 0); lg.addColorStop(0, 'rgba(255,236,170,.5)'); lg.addColorStop(1, 'rgba(255,236,170,0)'); cx.fillStyle = lg; cx.beginPath(); cx.moveTo(sr * .6, -sr * .07); cx.lineTo(sr * 7, -sr * .22); cx.lineTo(sr * 7, sr * .22); cx.lineTo(sr * .6, sr * .07); cx.fill(); }
      cx.restore();
      const sg = cx.createRadialGradient(sx, sy, 0, sx, sy, sr); sg.addColorStop(0, '#fffbe6'); sg.addColorStop(1, '#ffd77a'); cx.fillStyle = sg; cx.beginPath(); cx.arc(sx, sy, sr, 0, 6.283); cx.fill();
      clouds.forEach((c, i) => {
        c.x += c.v * 16; if (c.x > 1.3) c.x = -.3;
        const bx = (c.x + (px - .5) * .5 * (i % 2 ? 1 : -1)) * w, by = c.y * h;
        c.p.forEach(p => { const rr = c.s * h * p[2], x = bx + p[0] * c.s * h, y = by + p[1] * c.s * h, gg = cx.createRadialGradient(x, y, 0, x, y, rr); gg.addColorStop(0, 'rgba(238,243,255,' + c.a + ')'); gg.addColorStop(.6, 'rgba(210,220,245,' + c.a * .5 + ')'); gg.addColorStop(1, 'rgba(210,220,245,0)'); cx.fillStyle = gg; cx.beginPath(); cx.arc(x, y, rr, 0, 6.283); cx.fill(); });
      });
      /* أفق المدينة: قباب ومآذن */
      cx.fillStyle = '#050a14'; cx.beginPath(); cx.moveTo(0, h);
      const sk = [[0, .88], [.08, .88], [.1, .8], [.12, .88], [.2, .88], [.2, .84], [.28, .84], [.28, .88], [.36, .88], [.4, .74], [.42, .74], [.42, .88], [.46, .88]];
      sk.forEach(p => cx.lineTo(p[0] * w, p[1] * h));
      cx.arc(.54 * w, .88 * h, .075 * h * 1.5, Math.PI, 0); cx.lineTo(.62 * w, .88 * h); cx.lineTo(.66 * w, .88 * h); cx.lineTo(.67 * w, .72 * h); cx.lineTo(.68 * w, .88 * h); cx.lineTo(.76 * w, .88 * h); cx.lineTo(.76 * w, .83 * h); cx.lineTo(.86 * w, .83 * h); cx.lineTo(.86 * w, .88 * h); cx.lineTo(w, .88 * h); cx.lineTo(w, h); cx.fill();
      cx.fillStyle = '#e8c872'; cx.beginPath(); cx.arc(.54 * w, .88 * h - .075 * h * 1.5 - 4, 3 * dpr, 0, 6.283); cx.fill();
    })(0);
  }

  /* السفراء الأربعة */
  const am = $('#amb');
  if (am && D.ambassadors) W.html(am, D.ambassadors.map((a, i) => '<div class="glass amb tilt rv" style="--i:' + i + '"><span class="no">' + (i + 1) + '</span><h3>' + esc(a.n) + '</h3><p>' + esc(a.p) + '</p><dl>' + a.kv.map(r => '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>').join('') + '</dl></div>').join(''));

  /* التوقيعات الشريفة */
  const tq = $('#tq');
  if (tq && D.tawqi && D.tawqi.length) {
    tq.innerHTML = '<div class="tq-list"></div><div class="glass tq-view"></div>';
    const list = $('.tq-list', tq), view = $('.tq-view', tq);
    list.innerHTML = D.tawqi.map((x, i) => '<button data-i="' + i + '">' + esc(x.t) + '</button>').join('');
    const show = i => {
      const x = D.tawqi[i]; $$('button', list).forEach(b => b.classList.toggle('on', +b.dataset.i === i));
      view.innerHTML = '<h3>' + esc(x.t) + '</h3><p class="note" style="margin:10px 0 16px">' + esc(x.ctx) + '</p><div class="txt">' + esc(x.text) + '</div><a class="src" target="_blank" rel="noopener" href="' + esc(x.url) + '">' + esc(x.src) + ' ↗</a> <button class="chip" id="tqCp">نسخ النص</button>';
      $('#tqCp').onclick = () => W.copy(x.text + '\n— ' + x.src);
    };
    list.onclick = e => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); };
    show(0);
  }

  /* ٣١٣ نجماً */
  const c3 = $('#c313cv');
  if (c3) {
    const cx = c3.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1), num = $('#c313n');
    let w = 0, h = 0, shown = 0, on = false, mx = .5, my = .5;
    const rs = () => { const r = c3.getBoundingClientRect(); w = c3.width = Math.floor(r.width * dpr); h = c3.height = Math.floor(r.height * dpr); };
    rs(); addEventListener('resize', rs);
    new IntersectionObserver(e => on = e[0].isIntersecting, { threshold: .25 }).observe(c3);
    c3.addEventListener('pointermove', e => { const r = c3.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; });
    (function loop(t) {
      requestAnimationFrame(loop); if (!on) return;
      cx.clearRect(0, 0, w, h);
      if (shown < 313) shown = Math.min(313, shown + 1.1);
      const k = Math.min(w, h) * .45 / Math.sqrt(313), ox = w / 2 + (mx - .5) * 30 * dpr, oy = h / 2 + (my - .5) * 20 * dpr;
      cx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < Math.floor(shown); i++) {
        const a = i * 2.39996 + t * .00006 * (1 + i / 313), r = k * Math.sqrt(i + .5) * (1 + Math.sin(t * .0008 + i) * .012);
        const x = ox + Math.cos(a) * r, y = oy + Math.sin(a) * r, tw = .45 + .55 * Math.sin(t * .003 + i * 1.7), s = (1.6 + 2.2 * tw) * dpr;
        const gr = cx.createRadialGradient(x, y, 0, x, y, s * 4); gr.addColorStop(0, i === 0 ? 'rgba(127,227,208,.95)' : 'rgba(255,230,150,' + (.35 + .5 * tw) + ')'); gr.addColorStop(1, 'rgba(232,200,114,0)');
        cx.fillStyle = gr; cx.beginPath(); cx.arc(x, y, s * 4, 0, 6.283); cx.fill();
        cx.fillStyle = i === 0 ? '#c9fbef' : '#fff6d0'; cx.beginPath(); cx.arc(x, y, s * .8, 0, 6.283); cx.fill();
      }
      cx.globalCompositeOperation = 'source-over';
      if (num) num.textContent = Math.floor(shown);
    })(0);
  }

  /* علامات الظهور */
  const sg = $('#signs'), sf = $('#signF');
  if (sg && D.signs) {
    const kinds = [['all', 'الكل'], ['hatm', 'المحتومة'], ['other', 'غير المحتومة والعامة']];
    let k = 'all';
    const draw = () => {
      W.html(sg, D.signs.filter(s => k === 'all' || s.k === k).map((s, i) => '<div class="glass sg-card rv" style="--i:' + (i % 6) + '"><div class="t"><h3>' + esc(s.t) + '</h3><span class="tag' + (s.k === 'hatm' ? ' g' : '') + '">' + (s.k === 'hatm' ? 'محتومة' : 'غير محتومة') + '</span></div><p>' + esc(s.p) + '</p><div class="more">' + esc(s.more || '') + (s.src ? '<br><span class="src">' + esc(s.src) + '</span>' : '') + '</div></div>').join(''));
      $$('.sg-card', sg).forEach(c => c.addEventListener('click', () => c.classList.toggle('open')));
    };
    if (sf) { sf.innerHTML = kinds.map(x => '<button class="chip' + (x[0] === k ? ' on' : '') + '" data-k="' + x[0] + '">' + x[1] + '</button>').join(''); sf.onclick = e => { const b = e.target.closest('[data-k]'); if (!b) return; k = b.dataset.k; $$('.chip', sf).forEach(c => c.classList.toggle('on', c === b)); draw(); }; }
    draw();
  }

  /* طريق الظهور */
  const pt = $('#pathEl');
  if (pt && D.path) W.html(pt, D.path.map((s, i) => '<div class="st rv" style="--i:' + i + '"><div class="ic">' + (i + 1) + '</div><h4>' + esc(s.t) + '</h4><p>' + esc(s.p) + '</p></div>').join(''));

  /* واجبات المنتظرين */
  const du = $('#duties');
  if (du && D.duties) W.html(du, D.duties.map((d, i) => '<div class="glass tilt rv" style="--i:' + (i % 6) + '"><h3>' + esc(d.t) + '</h3><p>' + esc(d.p) + '</p>' + (d.src ? '<span class="src">' + esc(d.src) + '</span>' : '') + '</div>').join(''));
});
