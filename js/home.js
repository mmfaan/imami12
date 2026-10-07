/* الصفحة الرئيسية: اللوحة الحيّة (التاريخ الهجري والمناسبة القادمة والجمعة)، حديث اليوم، الشريط المتحرك */
W.on('home', () => {
  const D = W.D, esc = W.esc, set = (id, v) => { const e = $('#' + id); if (e) e.textContent = v; };
  const now = new Date(), h = W.hj(now);
  if (h) {
    set('lvHij', h.d + ' ' + W.HM[h.m - 1]);
    set('lvHijY', h.y + ' هـ — ' + W.gFmt(now, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    set('lvYears', (h.y - 329).toLocaleString('en-US') + ' سنة');
  }
  const nx = (D.occasions || []).map(o => { const n = W.nextOcc(o.m, o.d); return n ? { o, n } : null; }).filter(Boolean).sort((a, b) => a.n.days - b.n.days)[0];
  if (nx) { set('lvNext', nx.o.t); set('lvNextT', nx.n.days === 0 ? 'اليوم' : nx.n.days === 1 ? 'غداً' : 'بعد ' + nx.n.days + ' يوماً — ' + W.gFmt(nx.n.date, { day: 'numeric', month: 'long' })); }
  const f = W.untilFriday();
  set('lvFri', f === 0 ? 'اليوم الجمعة' : f === 1 ? 'غداً الجمعة' : 'بعد ' + f + ' أيام');
  set('lvFriT', f === 0 ? 'يوم الإمام صاحب الزمان — أكثِر من الدعاء له' : 'الجمعة يومُ الفرج: دعاء الندبة والعهد');

  /* شريط الأسماء المتحرك */
  const mq = $('#mqIn');
  if (mq && D.titles) { const s = D.titles.map(t => '<span>' + esc(t) + '</span>').join(''); mq.innerHTML = s + s; }

  /* حديث اليوم */
  const box = $('#hdDay');
  if (box && D.featured && D.featured.length) {
    const F = D.featured, d0 = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 864e5);
    let i = d0 % F.length;
    const paint = () => {
      const x = F[i];
      box.innerHTML = '<div class="hd-meta"><span class="tag g">' + esc(x.tag || 'حديث شريف') + '</span><span>' + esc(x.src) + '</span></div>' +
        '<div class="hd-txt">«' + esc(x.t) + '»</div>' +
        '<div class="hd-act"><a class="src" target="_blank" rel="noopener" href="' + esc(x.url) + '">افتح المصدر الأصلي ↗</a>' +
        '<button class="chip" id="hdNext">حديث آخر ↻</button><button class="chip" id="hdCp">نسخ</button></div>';
      $('#hdNext').onclick = () => { i = (i + 1) % F.length; paint(); };
      $('#hdCp').onclick = () => W.copy('«' + x.t + '»\n— ' + x.src);
    };
    paint();
  }

  /* دعاء الفرج في الواجهة */
  const fb = $('#openFaraj');
  if (fb) fb.onclick = () => W.openDua && W.openDua('faraj');
});
