/* صفحة المصادر والمنهج: قائمة المراجع وإحصاءات المكتبة */
W.on('about', () => {
  const D = W.D, esc = W.esc, bl = $('#biblio'), bq = $('#biblioQ');
  if (bl) {
    const draw = () => {
      const tk = TU.nz(bq.value || '').split(' ').filter(Boolean);
      W.html(bl, (D.biblio || []).filter(b => !tk.length || tk.every(t => TU.nz(b.t + ' ' + b.a + ' ' + (b.n || '')).includes(t))).map((b, i) => '<div class="glass rv" style="--i:' + (i % 6) + '"><h3>' + esc(b.t) + '</h3><p><b style="color:var(--teal)">' + esc(b.a) + '</b>' + (b.d ? ' — ' + esc(b.d) : '') + '</p>' + (b.n ? '<p style="margin-top:6px">' + esc(b.n) + '</p>' : '') + '</div>').join('') || '<p class="loadst">لا نتائج</p>');
    };
    let t = 0; bq.oninput = () => { clearTimeout(t); t = setTimeout(draw, 180); }; draw();
  }
});
