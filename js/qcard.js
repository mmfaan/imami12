/* بطاقات الاقتباس: رسم فني على Canvas (1080×1350) وتنزيل PNG */
(() => {
  'use strict';
  const W = window.W || (window.W = {});
  const TH = {
    night: { bg: ['#0b1a3a', '#050a14'], ink: '#fff6d6', acc: '#e8c872', acc2: '#7fe3d0', glow: 'rgba(232,200,114,.16)' },
    emerald: { bg: ['#0d4a47', '#031a1c'], ink: '#f2fff9', acc: '#9ff0d9', acc2: '#e8c872', glow: 'rgba(159,240,217,.16)' },
    parchment: { bg: ['#f7edd3', '#e3cf9e'], ink: '#2b1d07', acc: '#8a5a12', acc2: '#1f7d79', glow: 'rgba(138,90,18,.12)' }
  };
  const starPath = (ctx, cx, cy, R, r, rot) => {
    ctx.beginPath();
    for (let i = 0; i < 24; i++) { const a = (rot || 0) - Math.PI / 2 + i * Math.PI / 12, d = i % 2 ? r : R; i ? ctx.lineTo(cx + Math.cos(a) * d, cy + Math.sin(a) * d) : ctx.moveTo(cx + Math.cos(a) * d, cy + Math.sin(a) * d); }
    ctx.closePath();
  };
  const wrap = (ctx, text, maxW) => {
    const words = String(text).replace(/\s+/g, ' ').trim().split(' '), lines = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines;
  };
  function paint(cv, o) {
    const Wd = 1080, Ht = 1350, ctx = cv.getContext('2d'), th = TH[o.theme] || TH.night;
    cv.width = Wd; cv.height = Ht; ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const g = ctx.createLinearGradient(0, 0, Wd * .4, Ht); g.addColorStop(0, th.bg[0]); g.addColorStop(1, th.bg[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, Wd, Ht);
    const rg = ctx.createRadialGradient(Wd / 2, Ht * .42, 0, Wd / 2, Ht * .42, 700); rg.addColorStop(0, th.glow); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, Wd, Ht);
    ctx.save(); ctx.globalAlpha = .09; ctx.strokeStyle = th.acc; ctx.lineWidth = 2;
    starPath(ctx, Wd / 2, Ht * .5, 520, 380, 0); ctx.stroke(); starPath(ctx, Wd / 2, Ht * .5, 380, 270, Math.PI / 12); ctx.stroke(); starPath(ctx, Wd / 2, Ht * .5, 240, 170, 0); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = th.acc; ctx.lineWidth = 3; ctx.globalAlpha = .85; ctx.strokeRect(40, 40, Wd - 80, Ht - 80); ctx.lineWidth = 1; ctx.globalAlpha = .5; ctx.strokeRect(58, 58, Wd - 116, Ht - 116); ctx.globalAlpha = 1;
    ctx.fillStyle = th.acc;[[40, 40], [Wd - 40, 40], [40, Ht - 40], [Wd - 40, Ht - 40]].forEach(p => { starPath(ctx, p[0], p[1], 26, 17, 0); ctx.fill(); });
    ctx.fillStyle = th.acc; starPath(ctx, Wd / 2, 140, 46, 33, 0); ctx.fill(); ctx.fillStyle = th.bg[1]; starPath(ctx, Wd / 2, 140, 30, 21, Math.PI / 12); ctx.fill(); ctx.fillStyle = th.acc2; ctx.beginPath(); ctx.arc(Wd / 2, 140, 7, 0, 7); ctx.fill();
    ctx.fillStyle = th.acc2; ctx.font = '700 34px Amiri, serif'; ctx.fillText('موسوعة الإمام المهدي (عج)', Wd / 2, 225);
    ctx.fillStyle = th.acc; ctx.globalAlpha = .28; ctx.font = '700 170px Amiri, serif'; ctx.fillText('«', Wd - 200, 330); ctx.globalAlpha = 1;
    const maxW = 800, top = 300, hh = 760; let fs = 68, lines = [];
    for (; fs >= 28; fs -= 2) { ctx.font = '700 ' + fs + 'px Amiri, serif'; lines = wrap(ctx, o.text || '', maxW); if (lines.length * fs * 1.8 <= hh) break; }
    ctx.fillStyle = th.ink; const lh = fs * 1.8, y0 = top + (hh - lines.length * lh) / 2 + lh / 2;
    lines.forEach((l, i) => ctx.fillText(l, Wd / 2, y0 + i * lh));
    ctx.strokeStyle = th.acc; ctx.globalAlpha = .6; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(250, 1100); ctx.lineTo(480, 1100); ctx.moveTo(600, 1100); ctx.lineTo(830, 1100); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = th.acc; starPath(ctx, Wd / 2, 1100, 16, 11, 0); ctx.fill();
    ctx.fillStyle = th.acc; let sf = 34; ctx.font = '400 ' + sf + 'px Amiri, serif'; let sl = wrap(ctx, o.src || '', 840);
    while (sl.length > 2 && sf > 22) { sf -= 2; ctx.font = '400 ' + sf + 'px Amiri, serif'; sl = wrap(ctx, o.src || '', 840); }
    sl.slice(0, 2).forEach((l, i) => ctx.fillText(l, Wd / 2, 1160 + i * (sf * 1.5)));
    ctx.fillStyle = th.acc2; ctx.globalAlpha = .85; ctx.font = '400 28px Cairo, sans-serif'; ctx.fillText('اللهم عجّل لوليّك الفرج', Wd / 2, 1275); ctx.globalAlpha = 1;
  }
  W.qcard = {
    themes: Object.keys(TH),
    draw(cv, o) {
      paint(cv, o);
      if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('700 40px Amiri'), document.fonts.load('400 30px Amiri'), document.fonts.load('400 28px Cairo')]).then(() => paint(cv, o)).catch(() => { });
    },
    download(cv, name) {
      cv.toBlob(b => { if (!b) return; const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name || 'mahdi-quote.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/png');
    },
    excerpt(t, n) { n = n || 520; t = String(t).trim(); if (t.length <= n) return t; const k = t.lastIndexOf(' ', n - 20); return t.slice(0, k > 200 ? k : n - 20) + ' …'; },
    modal(text, src) {
      W.modal('<h3 style="color:var(--gold);font:700 26px var(--f-serif)">بطاقة اقتباس للمشاركة</h3><canvas id="qcCv" style="width:100%;max-width:400px;display:block;margin:14px auto;border-radius:16px;box-shadow:0 20px 50px #000a"></canvas>' +
        '<div class="lib-row" style="justify-content:center;gap:8px"><button class="chip on" data-th="night">ليلي</button><button class="chip" data-th="emerald">زمرّدي</button><button class="chip" data-th="parchment">رقّ</button><button class="btn gold sm" id="qcDl">تنزيل PNG</button></div>');
      const cv = document.getElementById('qcCv'); let th = 'night';
      const go = () => W.qcard.draw(cv, { text: W.qcard.excerpt(text), src, theme: th }); go();
      document.querySelectorAll('[data-th]').forEach(b => b.onclick = () => { th = b.dataset.th; document.querySelectorAll('[data-th]').forEach(x => x.classList.toggle('on', x === b)); go(); });
      document.getElementById('qcDl').onclick = () => W.qcard.download(cv);
    }
  };
})();
