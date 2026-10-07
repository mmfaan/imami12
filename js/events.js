/* الفعاليات: تقويم هجري حيّ، شموع الجمعة الاثنا عشر، عهد الأربعين، عدّاد الفرج، مسابقة، لعبة الذاكرة، مصمّم البطاقات */
W.on('events', () => {
  const D = W.D, esc = W.esc, IM = D.imams || [], OC = D.occasions || [];

  /* ─── التقويم ─── */
  W.safe('cal', () => {
    const grid = $('#calGrid'), head = $('#calHead'), selBox = $('#calSel'), upc = $('#occList'); if (!grid) return;
    if (!W.hj(new Date())) { grid.innerHTML = '<p class="loadst">متصفحك لا يدعم التقويم الهجري.</p>'; return; }
    let first = W.monthStart(new Date()), sel = W.noon(new Date());
    const same = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    const kind = os => os.some(o => o.k === 'mah') ? 'mah' : os.some(o => o.k === 'mou') ? 'mou' : os.length ? 'occ' : '';
    const detail = () => {
      const h = W.hj(sel), os = OC.filter(o => o.m === h.m && o.d === h.d);
      selBox.innerHTML = '<h3 style="color:var(--gold);font:700 28px var(--f-serif)">' + h.d + ' ' + W.HM[h.m - 1] + ' ' + h.y + ' هـ</h3><p style="color:var(--ink2);margin:0 0 12px">' + W.gFmt(sel) + '</p>' +
        (os.length ? os.map(o => '<div class="note" style="margin-bottom:10px"><b style="color:var(--gold)">' + esc(o.t) + '</b><br>' + esc(o.p || '') + '</div>').join('') : '<p style="color:var(--ink2)">لا مناسبة مسجّلة في هذا اليوم. ' + (sel.getDay() === 5 ? '<b style="color:var(--teal)">لكنه يوم الجمعة — يوم الإمام صاحب الزمان.</b>' : '') + '</p>');
    };
    const draw = () => {
      const h0 = W.hj(first), len = W.monthLen(first), dow = first.getDay(), today = W.noon(new Date());
      head.innerHTML = '<button class="chip" id="calNext">التالي ›</button><h3>' + W.HM[h0.m - 1] + ' ' + h0.y + ' هـ</h3><span style="display:flex;gap:8px"><button class="chip" id="calToday">اليوم</button><button class="chip" id="calPrev">‹ السابق</button></span>';
      let html = W.DAYS.map((d, i) => '<div class="cal-w' + (i === 5 ? ' f' : '') + '">' + d + '</div>').join('');
      for (let i = 0; i < dow; i++) html += '<div class="cal-day pad"></div>';
      for (let d = 1; d <= len; d++) {
        const g = W.addDays(first, d - 1), os = OC.filter(o => o.m === h0.m && o.d === d), cls = ['cal-day'];
        if (g.getDay() === 5) cls.push('f'); if (same(g, today)) cls.push('today'); const k = kind(os); if (k) cls.push(k); if (same(g, sel)) cls.push('chosen');
        html += '<button class="' + cls.join(' ') + '" data-d="' + d + '" title="' + esc(os.map(o => o.t).join(' — ')) + '"><b>' + d + '</b><small>' + g.getDate() + '/' + (g.getMonth() + 1) + '</small></button>';
      }
      grid.innerHTML = html; detail();
      $('#calNext').onclick = () => { first = W.addDays(first, len); draw(); };
      $('#calPrev').onclick = () => { first = W.monthStart(W.addDays(first, -1)); draw(); };
      $('#calToday').onclick = () => { first = W.monthStart(new Date()); sel = W.noon(new Date()); draw(); };
    };
    grid.onclick = e => { const b = e.target.closest('[data-d]'); if (!b) return; sel = W.addDays(first, +b.dataset.d - 1); $$('.cal-day.chosen', grid).forEach(x => x.classList.remove('chosen')); b.classList.add('chosen'); detail(); };
    const adj = $('#calAdj'); if (adj) { adj.value = String(W.hAdj); adj.onchange = () => { W.setAdj(+adj.value); W._oi = null; first = W.monthStart(new Date()); sel = W.noon(new Date()); draw(); up(); const c = $('#hjChip'); if (c) c.textContent = W.hjStr(W.hj(new Date())); }; }
    const up = () => {
      if (!upc) return;
      const L = OC.map(o => ({ o, n: W.nextOcc(o.m, o.d) })).filter(x => x.n).sort((a, b) => a.n.days - b.n.days).slice(0, 12);
      W.html(upc, L.map((x, i) => '<div class="glass occ-i rv" style="--i:' + (i % 6) + '"><div class="dd">' + x.o.d + '<small>' + W.HM[x.o.m - 1] + '</small></div><div><b style="color:var(--gold)">' + esc(x.o.t) + '</b><div style="font-size:14px;color:var(--ink2)">' + (x.n.days === 0 ? 'اليوم' : x.n.days === 1 ? 'غداً' : 'بعد ' + x.n.days + ' يوماً') + ' — ' + W.gFmt(x.n.date, { weekday: 'long', day: 'numeric', month: 'long' }) + '</div></div></div>').join(''));
    };
    draw(); up();
  });

  /* ─── شموع الجمعة: اثنتا عشرة شمعة للأئمة، والأخيرة بلهب زمردي ─── */
  W.safe('candles', () => {
    const box = $('#candles'), msg = $('#candleMsg'); if (!box || !IM.length) return;
    box.innerHTML = IM.map((m, i) => '<div class="candle' + (i === 11 ? ' m' : '') + '" data-i="' + i + '"><div class="wax"><span class="fl"></span></div><small>' + esc(m.short) + '</small></div>').join('');
    const count = () => $$('.candle.lit', box).length;
    const upd = () => {
      const n = count();
      if (n === 12) { msg.innerHTML = '<span class="ok">اكتملت الشموع الاثنتا عشرة.</span><br>«اللَّهُمَّ كُنْ لِوَلِيِّكَ الْحُجَّةِ بْنِ الْحَسَنِ صَلَوَاتُكَ عَلَيْهِ وَعَلَى آبَائِهِ فِي هَذِهِ السَّاعَةِ وَفِي كُلِّ سَاعَةٍ وَلِيّاً وَحَافِظاً وَقَائِداً وَنَاصِراً وَدَلِيلاً وَعَيْناً»'; W.rain(70); const r = box.getBoundingClientRect(); W.burst(r.left + r.width / 2, r.top + r.height / 2, 40, true); }
      else msg.textContent = n ? 'أُضيئت ' + n + ' من 12 — اضغط على الشموع لإضاءتها.' : 'اضغط على كل شمعة لتضيء، وسمِّ صاحبها في قلبك.';
    };
    box.onclick = e => { const c = e.target.closest('.candle'); if (!c) return; c.classList.toggle('lit'); upd(); };
    const all = $('#candleAll'); if (all) all.onclick = () => { $$('.candle', box).forEach((c, i) => setTimeout(() => { c.classList.add('lit'); if (i === 11) upd(); }, i * 260)); };
    const off = $('#candleOff'); if (off) off.onclick = () => { $$('.candle', box).forEach(c => c.classList.remove('lit')); upd(); };
    upd();
  });

  /* ─── عهد الأربعين صباحاً ─── */
  W.safe('ahd', () => {
    const box = $('#ahd'), info = $('#ahdInfo'); if (!box) return;
    let done = W.store.get('ahd', []);
    box.innerHTML = Array.from({ length: 40 }, (_, i) => '<button data-i="' + i + '" class="' + (done.includes(i) ? 'd' : '') + '">' + (i + 1) + '</button>').join('');
    const upd = () => { info.innerHTML = 'أتممتَ <b style="color:var(--gold)">' + done.length + '</b> من 40 صباحاً' + (done.length === 40 ? ' — <span class="ok">أتممتَ الأربعين، تقبّل الله منك.</span>' : ''); };
    box.onclick = e => { const b = e.target.closest('button'); if (!b) return; const i = +b.dataset.i; done = done.includes(i) ? done.filter(x => x !== i) : done.concat(i); W.store.set('ahd', done); b.classList.toggle('d'); upd(); if (done.length === 40) { W.rain(90); W.toast('أتممتَ العهد أربعين صباحاً'); } else if (b.classList.contains('d')) { const r = b.getBoundingClientRect(); W.burst(r.left + r.width / 2, r.top + r.height / 2, 10); } };
    const rs = $('#ahdReset'); if (rs) rs.onclick = () => { if (confirm('مسح تقدّمك؟')) { done = []; W.store.set('ahd', done); $$('button', box).forEach(b => b.classList.remove('d')); upd(); } };
    upd();
  });

  /* ─── عدّاد الفرج ─── */
  W.safe('faraj', () => {
    const rb = $('#ringBox'); if (!rb) return;
    const st = Object.assign({ n: 0, total: 0, target: 313, ph: 0 }, W.store.get('faraj', {}));
    const PH = ['اللهم صلِّ على محمد وآل محمد وعجِّل فرجهم', 'اللهم عجِّل لوليِّك الفرج', 'يا صاحب الزمان أدركنا'], C = 2 * Math.PI * 44;
    rb.innerHTML = '<div class="ring"><svg viewBox="0 0 100 100"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8c872"/><stop offset="1" stop-color="#7fe3d0"/></linearGradient></defs><circle class="bgc" cx="50" cy="50" r="44"/><circle class="fgc" cx="50" cy="50" r="44" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg><div class="in"><b id="frN">0</b><span id="frT"></span></div></div>' +
      '<button class="tap" id="frTap"></button><div class="lib-row" style="justify-content:center;margin-top:18px"><select class="sel" id="frPh">' + PH.map((p, i) => '<option value="' + i + '">' + p + '</option>').join('') + '</select><select class="sel" id="frTg" style="flex:0 1 150px">' + [33, 100, 313, 1000].map(n => '<option value="' + n + '">' + n + '</option>').join('') + '</select><button class="chip" id="frReset">تصفير</button></div><p id="frTot" style="margin-top:14px;text-align:center;color:var(--ink2);font-size:15px"></p>';
    const fg = $('.fgc', rb), tap = $('#frTap'), n = $('#frN'), t = $('#frT'), tot = $('#frTot');
    $('#frPh').value = st.ph; $('#frTg').value = st.target;
    const paint = () => {
      const cyc = st.n > 0 && st.n % st.target === 0 ? st.target : st.n % st.target;
      fg.style.strokeDashoffset = C * (1 - cyc / st.target); n.textContent = cyc; t.textContent = 'من ' + st.target; tap.textContent = PH[st.ph]; tot.textContent = 'مجموع ما ذكرتَ معنا في هذا المتصفح: ' + st.total.toLocaleString('en-US') + (st.total >= 313 ? ' — أكثر من عدد أصحاب القائم (313)' : '');
      W.store.set('faraj', st);
    };
    tap.onclick = e => { st.n++; st.total++; paint(); if (st.n % st.target === 0) { const r = tap.getBoundingClientRect(); W.burst(r.left + r.width / 2, r.top + r.height / 2, 46, true); W.toast('أتممتَ ' + st.target + ' — تقبّل الله'); } };
    $('#frPh').onchange = e => { st.ph = +e.target.value; paint(); };
    $('#frTg').onchange = e => { st.target = +e.target.value; st.n = 0; paint(); };
    $('#frReset').onclick = () => { st.n = 0; paint(); };
    paint();
  });

  /* ─── المسابقة المهدوية ─── */
  W.safe('quiz', () => {
    const qz = $('#quiz'); if (!qz || !(D.quiz || []).length) return;
    let order = [], i = 0, score = 0, answered = false, timer = 0, left = 25;
    const start = () => { order = W.shuffle(D.quiz).slice(0, 10); i = 0; score = 0; ask(); };
    const ask = () => {
      const q = order[i]; answered = false; left = 25;
      const opts = W.shuffle(q.o.map((t, j) => [t, j]));
      qz.innerHTML = '<div class="glass"><div class="qbar"><i style="width:100%"></i></div><div class="hd-meta"><span class="tag g">السؤال ' + (i + 1) + ' / ' + order.length + '</span><span class="tag">النتيجة ' + score + '</span><span class="tag" id="qT">25</span></div><h3 style="font-size:26px;line-height:1.9;color:#fff">' + esc(q.q) + '</h3><div class="opts">' + opts.map(o => '<button class="q-opt" data-j="' + o[1] + '">' + esc(o[0]) + '</button>').join('') + '</div><div id="qX"></div></div>';
      const bar = $('.qbar i', qz); requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = 'width 25s linear'; bar.style.width = '0%'; }));
      clearInterval(timer); timer = setInterval(() => { left--; const e = $('#qT'); if (e) e.textContent = left; if (left <= 0) { clearInterval(timer); pick(-1); } }, 1000);
    };
    const pick = j => {
      if (answered) return; answered = true; clearInterval(timer); const q = order[i];
      $$('.q-opt', qz).forEach(b => { const bj = +b.dataset.j; b.disabled = true; if (bj === q.a) b.classList.add('ok'); else if (bj === j) b.classList.add('no'); });
      if (j === q.a) { score++; W.burst(innerWidth / 2, innerHeight / 2, 16); }
      $('#qX').innerHTML = '<div class="note" style="margin:12px 0">' + (j === q.a ? '✓ أحسنت. ' : j < 0 ? '⏱ انتهى الوقت. ' : '✗ ليست هذه الإجابة. ') + esc(q.x || '') + '</div><button class="btn gold" id="qNext">' + (i + 1 < order.length ? 'السؤال التالي' : 'عرض النتيجة') + '</button>';
      $('#qNext').onclick = () => { i++; i < order.length ? ask() : end(); };
    };
    const end = () => {
      const best = Math.max(+W.store.get('quizBest', 0), score); W.store.set('quizBest', best);
      const msg = score >= 9 ? 'ما شاء الله! معرفتك بالقضية المهدوية راسخة.' : score >= 6 ? 'أحسنت، وفي موسوعتنا ما يزيدك علماً.' : 'بداية طيبة — اقرأ المقالات وأعد المحاولة.';
      qz.innerHTML = '<div class="glass" style="text-align:center"><h3 style="font-size:30px">انتهت المسابقة</h3><div class="stat"><div class="big">' + score + ' / ' + order.length + '</div><div class="lbl">أفضل نتيجة لك: ' + best + '</div></div><p>' + msg + '</p><button class="btn gold" id="qAgain">جولة جديدة</button></div>';
      $('#qAgain').onclick = start; if (score >= 7) W.rain(70);
    };
    qz.addEventListener('click', e => { const b = e.target.closest('.q-opt'); if (b && !answered) pick(+b.dataset.j); });
    start();
  });

  /* ─── لعبة الذاكرة: طابق الإمام مع ترتيبه ─── */
  W.safe('mem', () => {
    const mem = $('#mem'), info = $('#memInfo'); if (!mem || !IM.length) return;
    let first = null, lock = false, moves = 0, matched = 0;
    const upd = () => { info.textContent = 'الحركات: ' + moves + ' — المطابقات: ' + matched + ' / 8'; };
    const build = () => {
      const pick = W.shuffle(IM.map((m, i) => i)).slice(0, 8);
      const cards = W.shuffle(pick.flatMap(i => [{ id: i, t: 'الإمام ' + IM[i].ord }, { id: i, t: IM[i].short }]));
      mem.innerHTML = cards.map(c => '<button class="mem-c" data-id="' + c.id + '" aria-label="بطاقة"><div class="in"><div class="a"></div><div class="b">' + esc(c.t) + '</div></div></button>').join('');
      first = null; lock = false; moves = 0; matched = 0; upd();
    };
    mem.onclick = e => {
      const c = e.target.closest('.mem-c'); if (!c || lock || c.classList.contains('f') || c.classList.contains('m')) return;
      c.classList.add('f');
      if (!first) { first = c; return; }
      moves++; const a = first; first = null;
      if (a.dataset.id === c.dataset.id) { a.classList.add('m'); c.classList.add('m'); matched++; const r = c.getBoundingClientRect(); W.burst(r.left + r.width / 2, r.top + r.height / 2, 12); if (matched === 8) { W.rain(80); W.toast('أحسنت! أتممتَ اللعبة في ' + moves + ' حركة'); } }
      else { lock = true; setTimeout(() => { a.classList.remove('f'); c.classList.remove('f'); lock = false; }, 900); }
      upd();
    };
    const nb = $('#memNew'); if (nb) nb.onclick = build;
    build();
  });

  /* ─── مصمّم بطاقات الاقتباس ─── */
  W.safe('dz', () => {
    const cv = $('#dzCv'), txt = $('#dzTxt'), src = $('#dzSrc'), pk = $('#dzPick'), th = $('#dzTh'); if (!cv || !W.qcard) return;
    let theme = 'night';
    const draw = () => W.qcard.draw(cv, { text: txt.value, src: src.value, theme });
    const F = D.featured || [];
    if (pk) { pk.innerHTML = '<option value="-1">اختر نصاً موثقاً من المكتبة…</option>' + F.map((x, i) => '<option value="' + i + '">' + esc(x.src) + '</option>').join(''); pk.onchange = () => { const x = F[+pk.value]; if (x) { txt.value = W.qcard.excerpt(x.t, 480); src.value = x.src; draw(); } }; }
    th.innerHTML = W.qcard.themes.map(t => '<button class="chip' + (t === theme ? ' on' : '') + '" data-th="' + t + '">' + ({ night: 'ليلي', emerald: 'زمرّدي', parchment: 'رقّ' }[t]) + '</button>').join('');
    th.onclick = e => { const b = e.target.closest('[data-th]'); if (!b) return; theme = b.dataset.th; $$('.chip', th).forEach(x => x.classList.toggle('on', x === b)); draw(); };
    txt.oninput = draw; src.oninput = draw;
    $('#dzDl').onclick = () => W.qcard.download(cv);
    $('#dzCp').onclick = () => W.copy(txt.value + '\n— ' + src.value);
    txt.value = 'اللَّهُمَّ كُنْ لِوَلِيِّكَ الْحُجَّةِ بْنِ الْحَسَنِ صَلَوَاتُكَ عَلَيْهِ وَعَلَى آبَائِهِ فِي هَذِهِ السَّاعَةِ وَفِي كُلِّ سَاعَةٍ وَلِيّاً وَحَافِظاً وَقَائِداً وَنَاصِراً وَدَلِيلاً وَعَيْناً';
    src.value = 'دعاء الفرج — من مفاتيح الجنان'; draw();
  });
});
