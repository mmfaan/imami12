/* المؤثرات: المؤشر الذهبي وأثره، لمعان الزجاج، الإمالة ثلاثية الأبعاد، الأزرار المغناطيسية، العدّادات، انفجار النجوم */
(() => {
  'use strict';
  const W = window.W || (window.W = {});
  const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
  const fine = matchMedia('(pointer:fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* شريط التقدّم وحالة الشريط العلوي والتمويه المتفاوت */
  let sTick = 0;
  const onScroll = () => {
    sTick = 0;
    const h = document.documentElement, mx = h.scrollHeight - innerHeight, p = mx > 0 ? scrollY / mx : 0;
    const bar = $('#prog i'); if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
    const nav = $('#nav'); if (nav) nav.classList.toggle('sc', scrollY > 30);
    $$('[data-par]').forEach(el => { const f = +el.dataset.par || .1; el.style.translate = '0 ' + (scrollY * f).toFixed(1) + 'px'; });
    const hc = $('#hero3d'); if (hc) hc.style.opacity = Math.max(0, 1 - scrollY / (innerHeight * .85)).toFixed(2);
  };
  addEventListener('scroll', () => { if (!sTick) sTick = requestAnimationFrame(onScroll); }, { passive: true });
  onScroll();

  /* نجمة اثنا عشرية كمسار للرسم */
  const SP = new Path2D();
  for (let i = 0; i < 24; i++) { const t = -Math.PI / 2 + i * Math.PI / 12, r = i % 2 ? .52 : 1; i ? SP.lineTo(Math.cos(t) * r, Math.sin(t) * r) : SP.moveTo(Math.cos(t) * r, Math.sin(t) * r); }
  SP.closePath();

  /* لوحة الأثر والجسيمات */
  const cv = $('#tr'); let cx = null, parts = [], run = 0;
  const fit = () => { if (!cv) return; cv.width = innerWidth; cv.height = innerHeight; };
  if (cv) { cx = cv.getContext('2d'); fit(); addEventListener('resize', fit); }
  const COL = ['#e8c872', '#f9ebb4', '#7fe3d0', '#ffffff'];
  function step() {
    run = 0; if (!cx) return;
    cx.clearRect(0, 0, cv.width, cv.height); cx.globalCompositeOperation = 'lighter';
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.life -= p.d; if (p.life <= 0) { parts.splice(i, 1); continue; }
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= .985; p.r += p.rv;
      cx.globalAlpha = Math.max(0, p.life); cx.fillStyle = p.c;
      if (p.star) { cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.scale(p.s, p.s); cx.fill(SP); cx.restore(); }
      else { cx.beginPath(); cx.arc(p.x, p.y, p.s, 0, 6.283); cx.fill(); }
    }
    cx.globalAlpha = 1;
    if (parts.length) run = requestAnimationFrame(step);
  }
  const push = p => { if (parts.length > 260) parts.shift(); parts.push(p); if (!run) run = requestAnimationFrame(step); };
  W.burst = (x, y, n, big) => {
    if (reduce) return;
    for (let i = 0; i < (n || 14); i++) {
      const a = Math.random() * 6.283, v = (big ? 3 : 1.6) + Math.random() * (big ? 6 : 3.4);
      push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, g: .05, life: 1, d: .012 + Math.random() * .012, s: 4 + Math.random() * (big ? 11 : 7), c: COL[(Math.random() * 4) | 0], star: Math.random() < .75, r: Math.random() * 6, rv: (Math.random() - .5) * .12 });
    }
  };
  W.rain = (n) => { for (let i = 0; i < (n || 60); i++) setTimeout(() => push({ x: Math.random() * innerWidth, y: -10, vx: (Math.random() - .5) * 1.2, vy: 1 + Math.random() * 2.5, g: .02, life: 1.6, d: .006, s: 5 + Math.random() * 9, c: COL[(Math.random() * 3) | 0], star: true, r: 0, rv: (Math.random() - .5) * .08 }), i * 22); };

  /* المؤشر + الأثر + الإمالة + اللمعان + المغناطيس */
  const cur = $('#cur'); let tx = -99, ty = -99, x = -99, y = -99, tgt = null, raf = 0, last = null, lastBtn = null, mv = 0;
  if (!fine && cur) cur.remove();
  function frame() {
    raf = 0;
    if (cur && fine) { x += (tx - x) * .22; y += (ty - y) * .22; cur.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)'; if (Math.abs(tx - x) + Math.abs(ty - y) > .4) raf = requestAnimationFrame(frame); }
  }
  document.addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY; tgt = e.target;
    if (!raf) raf = requestAnimationFrame(frame);
    if (cur) cur.classList.toggle('big', !!(tgt.closest && tgt.closest('a,button,.chip,.sel,.fld,.glass,.mem-c,.candle,.soi-node')));
    if (fine && !reduce && ++mv % 2 === 0 && e.pointerType === 'mouse') push({ x: tx, y: ty, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, g: 0, life: .8, d: .035, s: 1.6 + Math.random() * 2.2, c: COL[(Math.random() * 3) | 0], star: false, r: 0, rv: 0 });
    const g = tgt.closest && tgt.closest('.glass');
    if (last && last !== g && last.classList.contains('tilt')) { last.style.setProperty('--rx', '0deg'); last.style.setProperty('--ry', '0deg'); }
    last = g;
    if (g) {
      const r = g.getBoundingClientRect(), u = (tx - r.left) / r.width, v = (ty - r.top) / r.height;
      g.style.setProperty('--mx', (u * 100).toFixed(1) + '%'); g.style.setProperty('--my', (v * 100).toFixed(1) + '%');
      if (g.classList.contains('tilt') && !reduce) { g.style.setProperty('--ry', ((u - .5) * 10).toFixed(2) + 'deg'); g.style.setProperty('--rx', ((.5 - v) * 8).toFixed(2) + 'deg'); }
    }
    const b = tgt.closest && tgt.closest('.btn,.mag');
    if (lastBtn && lastBtn !== b) { lastBtn.style.translate = ''; }
    lastBtn = b;
    if (b) {
      const r = b.getBoundingClientRect(); b.style.setProperty('--bx', ((tx - r.left) / r.width * 100).toFixed(0) + '%'); b.style.setProperty('--by', ((ty - r.top) / r.height * 100).toFixed(0) + '%');
      if (b.classList.contains('gold') && !reduce) b.style.translate = ((tx - r.left - r.width / 2) * .12).toFixed(1) + 'px ' + ((ty - r.top - r.height / 2) * .22).toFixed(1) + 'px';
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => { if (last && last.classList.contains('tilt')) { last.style.setProperty('--rx', '0deg'); last.style.setProperty('--ry', '0deg'); } });
  document.addEventListener('click', e => { if (!e.target.closest('input,textarea,select')) W.burst(e.clientX, e.clientY, 9); });

  /* عدّادات تصاعدية */
  const ease = t => 1 - Math.pow(1 - t, 3);
  W.count = el => {
    const to = +el.dataset.count || 0, suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1900;
    const f = t => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * ease(k)).toLocaleString('en-US') + suf; if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  };
  W.on && W.on('counters', () => {
    const els = $$('[data-count]'); if (!els.length) return;
    const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { W.count(e.target); o.unobserve(e.target); } }), { threshold: .4 });
    els.forEach(e => o.observe(e));
  });

  /* ظهور متتابع تلقائي لبطاقات الشبكات */
  W.on && W.on('autorv', () => {
    $$('.grid').forEach(g => Array.from(g.children).forEach((c, i) => { if (c.classList.contains('glass') && !c.classList.contains('rv')) { c.classList.add('rv'); c.style.setProperty('--i', i % 8); } }));
    $$('.sec-h,.page-hero > *').forEach((c, i) => { if (!c.classList.contains('rv')) { c.classList.add('rv'); c.style.setProperty('--i', i % 4); } });
  });

  /* انتقال سلس بين الصفحات: تعتيم قصير عند مغادرة الصفحة إن لم يكن المتصفح يدعم انتقالات العرض */
  if (!CSS.supports || !CSS.supports('view-transition-name', 'x')) {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]'); if (!a || a.target || /^(#|mailto:|https?:)/.test(a.getAttribute('href'))) return;
      e.preventDefault(); document.body.style.transition = 'opacity .3s'; document.body.style.opacity = 0; setTimeout(() => location.href = a.href, 280);
    });
    addEventListener('pageshow', () => { document.body.style.opacity = 1; });
  }
})();
