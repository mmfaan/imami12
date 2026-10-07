/* المجسمات ثلاثية الأبعاد: كون الخلفية، نجمة الواجهة، القبة الذهبية، النجمة، الكرة الأرضية، الساعة الرملية، الكرة الفلكية */
(() => {
  'use strict';
  const W = window.W || {}, $$ = s => Array.from(document.querySelectorAll(s));
  const fail = () => {
    $$('.cv').forEach(c => { const p = document.createElement('p'); p.className = 'loadst'; p.textContent = 'تعذّر عرض المجسمات ثلاثية الأبعاد في هذا المتصفح — جرّب متصفحاً حديثاً وتأكّد من اتصال الإنترنت.'; c.replaceWith(p); });
    const h = document.getElementById('hero3d'); if (h) h.remove();
  };
  if (!window.THREE) { fail(); return; }
  const T = THREE;
  const M = (c, m = .55, r = .32, e = .16) => new T.MeshStandardMaterial({ color: c, metalness: m, roughness: r, emissive: c, emissiveIntensity: e });
  const halo = (stops, scale) => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    stops.forEach(s => g.addColorStop(s[0], s[1])); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    const sp = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(c), blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
    sp.scale.set(scale, scale, 1); return sp;
  };
  const star = (R1, R2, n, depth, m, bv) => {
    const sh = new T.Shape();
    for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n + Math.PI / 2, r = i % 2 ? R2 : R1; i ? sh.lineTo(Math.cos(a) * r, Math.sin(a) * r) : sh.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    sh.closePath();
    const b = bv == null ? .06 : bv;
    const geo = new T.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelSize: b, bevelThickness: b, bevelSegments: 2 });
    geo.translate(0, 0, -depth / 2); return new T.Mesh(geo, m);
  };

  /* ───── كون الخلفية: نواة سلكية، حلقات، أنجم، اثنا عشر نوراً (الأئمة) والأخير بلون مختلف، نجمة اثنا عشرية خطية، شمس خلف السحاب ───── */
  function bg() {
    const cv = document.getElementById('bg'); if (!cv) return;
    const R = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }), S = new T.Scene(), C = new T.PerspectiveCamera(60, 1, .1, 100);
    const core = new T.Mesh(new T.IcosahedronGeometry(1.7, 1), new T.MeshBasicMaterial({ color: 0xe8c872, wireframe: true, transparent: true, opacity: .3 }));
    const rm = new T.MeshBasicMaterial({ color: 0x7fe3d0, transparent: true, opacity: .38 });
    const r1 = new T.Mesh(new T.TorusGeometry(3.1, .012, 8, 200), rm), r2 = new T.Mesh(r1.geometry, rm); r2.rotation.x = 1.2;
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array(4200).map(() => (Math.random() - .5) * 40), 3));
    const st = new T.Points(g, new T.PointsMaterial({ size: .05, color: 0xffffff, transparent: true }));
    S.add(core, r1, r2, st);
    const sun = halo([[0, 'rgba(255,240,190,.9)'], [.35, 'rgba(232,200,114,.35)'], [1, 'rgba(232,200,114,0)']], 9); core.add(sun);
    const og = new T.Group();
    for (let i = 0; i < 12; i++) {
      const m = new T.Mesh(new T.OctahedronGeometry(i === 11 ? .17 : .1), new T.MeshBasicMaterial({ color: i === 11 ? 0x7fe3d0 : 0xe8c872, transparent: true })), a = i * Math.PI / 6;
      m.position.set(Math.cos(a) * 4.1, Math.sin(a * 2) * .6, Math.sin(a) * 4.1); og.add(m);
    }
    og.rotation.x = .32;
    const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(new Float32Array(1500).map(() => (Math.random() - .5) * 26), 3));
    const dust = new T.Points(dg, new T.PointsMaterial({ size: .06, color: 0x7fe3d0, transparent: true, opacity: .6, blending: T.AdditiveBlending, depthWrite: false }));
    const pts = []; for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, r = i % 2 ? 4.7 : 6.2; pts.push(new T.Vector3(Math.cos(a) * r, Math.sin(a) * r, -2)); }
    const sring = new T.LineLoop(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0xe8c872, transparent: true, opacity: .25 }));
    S.add(og, dust, sring);
    const MS = window.MS = { S, C, core, dim: 1, tick: [], zBase: 7 };
    let mx = 0, my = 0; addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    const rs = () => { R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setSize(innerWidth, innerHeight); C.aspect = innerWidth / innerHeight; C.updateProjectionMatrix(); MS.zBase = innerWidth < innerHeight ? 12 : 7; };
    rs(); addEventListener('resize', rs); C.position.z = MS.zBase;
    (function a(t) {
      const tg = Math.max(.2, 1 - scrollY / (innerHeight * .8)); MS.dim += (tg - MS.dim) * .08; const d = MS.dim;
      core.rotation.y += .004; core.rotation.x += .002; r1.rotation.z += .003; r2.rotation.y += .004; st.rotation.y += .0007;
      og.rotation.y += .006; og.rotation.z = Math.sin(t / 3000) * .15; dust.rotation.y -= .0004; sring.rotation.z += .0015;
      og.children.forEach(m => { m.material.opacity = .95 * (.3 + .7 * d); m.rotation.y += .02; m.rotation.x += .013; });
      dust.material.opacity = .6 * (.35 + .65 * d); sring.material.opacity = .25 * (.3 + .7 * d);
      sun.material.opacity = .12 + .88 * d; const k = 1 + Math.sin(t / 1600) * .05; sun.scale.set(9 * k, 9 * k, 1);
      core.position.x = mx * -1.2; core.position.y = my * -1;
      core.material.opacity = .3 * d; rm.opacity = .38 * d; st.material.opacity = .45 + .55 * d;
      C.position.y = -scrollY * .002; C.position.z += (MS.zBase + Math.min(scrollY * .0008, 3) - C.position.z) * .08;
      MS.tick.forEach(f => f(t || 0, d));
      R.render(S, C); requestAnimationFrame(a);
    })(0);
  }

  /* ───── مشهد مستقل لكل لوحة: إضاءة ثلاثية، سحب بالفأرة، ولا يُرسم إلا حين يكون ظاهراً ───── */
  function mk(c, fov, z) {
    const R = new T.WebGLRenderer({ canvas: c, alpha: true, antialias: true }), S = new T.Scene(), C = new T.PerspectiveCamera(fov, 1, .1, 100), o = { S, C, R, z, v: 0, on: 0, f: [], mx: 0, my: 0 };
    C.position.z = z;
    S.add(new T.HemisphereLight(0xdfeaff, 0x16243a, .9));
    const key = new T.PointLight(0xffe2a0, 2.6), fill = new T.PointLight(0x7fe3d0, 1.5), rim = new T.PointLight(0xe8c872, 1.6);
    key.position.set(5, 6, 8); fill.position.set(-7, 2, 5); rim.position.set(0, 4, -7); S.add(key, fill, rim);
    R.setPixelRatio(Math.min(devicePixelRatio, 2));
    const rs = () => { const w = c.clientWidth || 300, h = c.clientHeight || 300; R.setSize(w, h, false); C.aspect = w / h; C.updateProjectionMatrix(); };
    rs(); if (window.ResizeObserver) new ResizeObserver(rs).observe(c); else addEventListener('resize', rs);
    let d = 0, x0 = 0;
    c.addEventListener('pointerdown', e => { d = 1; x0 = e.clientX; });
    addEventListener('pointerup', () => d = 0);
    addEventListener('pointermove', e => { if (d) { o.v = (e.clientX - x0) * .012; x0 = e.clientX; } o.mx = e.clientX / innerWidth - .5; o.my = e.clientY / innerHeight - .5; });
    new IntersectionObserver(e => o.on = e[0].isIntersecting).observe(c);
    (function a(t) { if (o.on) { o.v *= .94; for (const f of o.f) f(o, t / 1000); R.render(S, C); } requestAnimationFrame(a); })(0);
    return o;
  }

  /* 1) القبة الذهبية والمآذن */
  function dome(o) {
    const G = new T.Group(), g = M(0xe8c872, .7, .26, .2), t = M(0x168a8a, .35, .45, .05), w = M(0x1b3552, .2, .6, .05), k = M(0x0b2a44, .2, .6, .05);
    const add = (geo, m, x = 0, y = 0, z = 0) => { const e = new T.Mesh(geo, m); e.position.set(x, y, z); G.add(e); return e; };
    const lathe = (pts, m, x = 0, y = 0, z = 0) => add(new T.LatheGeometry(pts.map(p => new T.Vector2(p[0], p[1])), 64), m, x, y, z);
    add(new T.BoxGeometry(6.4, .25, 4.8), w, 0, -1.9, 0);
    add(new T.BoxGeometry(5.6, .25, 4.0), w, 0, -1.65, 0);
    add(new T.BoxGeometry(3.6, 1.5, 3), t, 0, -.78, 0);
    add(new T.BoxGeometry(1.3, 1.15, .14), k, 0, -.88, 1.52);
    add(new T.BoxGeometry(1.5, .12, .18), g, 0, -.25, 1.52);
    add(new T.CylinderGeometry(1.3, 1.4, .8, 64), t, 0, .37, 0);
    add(new T.TorusGeometry(1.33, .06, 12, 64), g, 0, .78, 0).rotation.x = Math.PI / 2;
    lathe([[0, 0], [1.3, 0], [1.5, .28], [1.52, .62], [1.34, 1.08], [.98, 1.5], [.6, 1.84], [.3, 2.12], [.1, 2.34], [0, 2.5]], g, 0, .78, 0);
    add(new T.CylinderGeometry(.025, .025, .7, 8), g, 0, 3.6, 0);
    add(new T.SphereGeometry(.1, 16, 16), g, 0, 3.98, 0);
    [[-2.5, -1.65], [2.5, -1.65], [-2.5, 1.65], [2.5, 1.65]].forEach(p => lathe([[.32, 0], [.3, .25], [.22, .32], [.2, .5], [.17, 2.5], [.3, 2.62], [.34, 2.7], [.34, 2.78], [.22, 2.84], [.2, 3.25], [.14, 3.45], [.05, 3.7], [0, 3.9]], g, p[0], -1.78, p[1]).scale.y = 1.28);
    const hl = halo([[0, 'rgba(255,240,190,.95)'], [.3, 'rgba(255,226,150,.35)'], [1, 'rgba(232,200,114,0)']], 3.4); hl.position.set(0, 3.98, 0); G.add(hl);
    add(new T.CylinderGeometry(1.5, .06, 3.6, 32, 1, true), new T.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: .07, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }), 0, 5.8, 0);
    const N = 90, pp = new Float32Array(N * 3), sp = new Float32Array(N);
    for (let i = 0; i < N; i++) { const a = Math.random() * 6.283, r = Math.random() * 1.1; pp[i * 3] = Math.cos(a) * r; pp[i * 3 + 1] = 3.6 + Math.random() * 4; pp[i * 3 + 2] = Math.sin(a) * r; sp[i] = .012 + Math.random() * .02; }
    const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pp, 3));
    G.add(new T.Points(pg, new T.PointsMaterial({ size: .08, color: 0xfff2c0, transparent: true, opacity: .85, blending: T.AdditiveBlending, depthWrite: false })));
    o.S.add(G);
    o.f.push((o, t) => {
      G.rotation.y += .004 + o.v; G.position.y = -1 + Math.sin(t) * .08;
      for (let i = 0; i < N; i++) { pp[i * 3 + 1] += sp[i]; if (pp[i * 3 + 1] > 7.6) pp[i * 3 + 1] = 3.9; }
      pg.attributes.position.needsUpdate = true; hl.scale.setScalar(3.4 + Math.sin(t * 2) * .25);
    });
  }

  /* 2) النجمة الاثنا عشرية: نجمتان متداخلتان وجوهرة وحلقات واثنا عشر نوراً */
  function starModel(o) {
    const G = new T.Group();
    const s1 = star(2.7, 1.9, 12, .5, M(0xe8c872, .7, .28, .2)), s2 = star(1.7, 1.2, 12, .4, M(0x1f9d9a, .4, .4, .25));
    s2.rotation.z = Math.PI / 12; s2.position.z = .35;
    const gem = new T.Mesh(new T.IcosahedronGeometry(.55, 1), M(0xfff2c0, .2, .2, .9)); gem.position.z = .75;
    const ring = new T.Mesh(new T.TorusGeometry(3.2, .04, 10, 160), M(0x7fe3d0, .3, .3, .3)), ring2 = new T.Mesh(new T.TorusGeometry(3.6, .02, 8, 160), M(0xe8c872, .5, .3, .2));
    ring2.rotation.x = .9;
    const orb = new T.Group();
    for (let i = 0; i < 12; i++) { const b = new T.Mesh(new T.SphereGeometry(i === 11 ? .15 : .1, 16, 16), M(i === 11 ? 0x7fe3d0 : 0xfff2c0, .2, .3, .9)), a = i * Math.PI / 6; b.position.set(Math.cos(a) * 3.2, Math.sin(a) * 3.2, 0); orb.add(b); }
    G.add(s1, s2, gem, ring, ring2, orb); o.S.add(G);
    o.f.push((o, t) => { G.rotation.y += .006 + o.v; G.rotation.x = Math.sin(t * .7) * .3; s2.rotation.z += .004; ring2.rotation.z += .01; orb.rotation.z -= .005; gem.rotation.y += .03; });
  }

  /* 3) الكرة الأرضية: قارات حقيقية من قناع أرضي، نبضات عند الأماكن، أقواس تصل سامراء بها */
  function globe(o) {
    if (typeof LAND_B64 === 'undefined') return;
    const G = new T.Group(), RAD = 2.4;
    const bits = (() => { const s = atob(LAND_B64), a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; })();
    const land = (la, lo) => { const r = Math.min(179, Math.max(0, Math.floor(90 - la))), c = Math.min(359, Math.max(0, Math.floor(lo + 180))), k = r * 360 + c; return bits[k >> 3] >> (7 - (k & 7)) & 1; };
    const ll = (a, b, r) => { a *= Math.PI / 180; b *= Math.PI / 180; return [r * Math.cos(a) * Math.sin(b), r * Math.sin(a), r * Math.cos(a) * Math.cos(b)]; };
    const pts = [], N = 24000, ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) { const la = Math.asin(1 - 2 * (i + .5) / N) * 180 / Math.PI, lo = ((ga * i * 180 / Math.PI) % 360 + 360) % 360 - 180; if (land(la, lo)) pts.push(...ll(la, lo, RAD)); }
    const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
    G.add(new T.Mesh(new T.SphereGeometry(RAD - .015, 64, 48), new T.MeshBasicMaterial({ color: 0x06182c })));
    G.add(new T.Points(pg, new T.PointsMaterial({ size: .036, color: 0x7fe3d0, transparent: true, opacity: .95 })));
    const gl = [];
    for (let lo = -180; lo < 180; lo += 30) for (let la = -90; la < 90; la += 6) gl.push(...ll(la, lo, RAD + .005), ...ll(la + 6, lo, RAD + .005));
    for (let la = -60; la <= 60; la += 30) for (let lo = -180; lo < 180; lo += 6) gl.push(...ll(la, lo, RAD + .005), ...ll(la, lo + 6, RAD + .005));
    const gg = new T.BufferGeometry(); gg.setAttribute('position', new T.Float32BufferAttribute(gl, 3));
    G.add(new T.LineSegments(gg, new T.LineBasicMaterial({ color: 0x7fe3d0, transparent: true, opacity: .1 })));
    const ha = halo([[.5, 'rgba(127,227,208,.5)'], [.62, 'rgba(127,227,208,.2)'], [1, 'rgba(127,227,208,0)']], RAD * 2.55); ha.position.z = -.5; o.S.add(ha);
    const PL = ((W.D && W.D.places) || []).filter(p => p.la != null).map(p => [p.n, p.la, p.lo, p.t, p.home]);
    if (!PL.length) PL.push(['سامراء', 34.2, 43.87, 'مولد الإمام الحجة (عج)', 1]);
    let hi = PL.findIndex(p => p[4]); if (hi < 0) hi = 0;
    const ms = [], rings = [], P = PL.map(p => new T.Vector3(...ll(p[1], p[2], RAD + .02)));
    PL.forEach((p, i) => {
      const m = new T.Mesh(new T.SphereGeometry(.065, 16, 16), new T.MeshBasicMaterial({ color: i === hi ? 0xfff2c0 : 0xe8c872 })); m.position.copy(P[i]); G.add(m); ms.push(m);
      const rg = new T.Mesh(new T.RingGeometry(.09, .115, 32), new T.MeshBasicMaterial({ color: 0xe8c872, transparent: true, side: T.DoubleSide, depthWrite: false }));
      rg.position.copy(P[i]); rg.quaternion.setFromUnitVectors(new T.Vector3(0, 0, 1), P[i].clone().normalize()); rg.userData.ph = i * .4; G.add(rg); rings.push(rg);
      if (i !== hi) {
        const mid = P[hi].clone().add(P[i]).multiplyScalar(.5).normalize().multiplyScalar(RAD + .02 + P[hi].distanceTo(P[i]) * .55);
        G.add(new T.Line(new T.BufferGeometry().setFromPoints(new T.QuadraticBezierCurve3(P[hi], mid, P[i]).getPoints(40)), new T.LineBasicMaterial({ color: 0xe8c872, transparent: true, opacity: .55 })));
      }
    });
    G.rotation.set(.45, -45 * Math.PI / 180, 0); o.S.add(G);
    let sel = -1, tg = [0, 0];
    const pl = document.getElementById('pl'), pi = document.getElementById('pi');
    const pick = i => { o.v = 0; sel = i; const p = PL[i]; tg = [p[1] * Math.PI / 180, -p[2] * Math.PI / 180]; if (pi) pi.innerHTML = '<h3>' + W.esc(p[0]) + '</h3><p>' + W.esc(p[3] || '') + '</p>'; if (pl) pl.querySelectorAll('[data-p]').forEach(x => x.classList.toggle('on', +x.dataset.p === i)); };
    if (pl) { pl.innerHTML = PL.map((p, i) => '<button class="chip" data-p="' + i + '">' + W.esc(p[0]) + '</button>').join(''); pl.querySelectorAll('[data-p]').forEach(b => b.onclick = () => pick(+b.dataset.p)); }
    o.f.push((o, t) => {
      if (Math.abs(o.v) > .003) sel = -1;
      if (sel < 0) { G.rotation.y += .0035 + o.v; G.rotation.x += (.3 - G.rotation.x) * .02; }
      else { G.rotation.x += (tg[0] - G.rotation.x) * .06; G.rotation.y += Math.atan2(Math.sin(tg[1] - G.rotation.y), Math.cos(tg[1] - G.rotation.y)) * .06; }
      o.C.position.z += ((sel >= 0 ? 5.9 : o.z) - o.C.position.z) * .05;
      ms.forEach((m, i) => m.scale.setScalar(i === sel ? 1.9 + Math.sin(t * 6) * .35 : 1));
      rings.forEach(r => { const k = (t * .7 + r.userData.ph) % 1; r.scale.setScalar(1 + k * 2.6); r.material.opacity = (1 - k) * .8; });
    });
  }

  /* 4) الساعة الرملية: رمز الانتظار — الرمل ينساب ثم تنقلب الساعة */
  function hourglass(o) {
    const G = new T.Group(), gold = M(0xe8c872, .75, .26, .2), H = 2.1;
    const gm = new T.MeshStandardMaterial({ color: 0xbfefff, metalness: 0, roughness: .08, transparent: true, opacity: .2, side: T.DoubleSide, depthWrite: false, emissive: 0x1f9d9a, emissiveIntensity: .2 });
    const prof = []; for (let i = 0; i <= 40; i++) { const y = -H + 2 * H * i / 40, u = Math.abs(y) / H; prof.push(new T.Vector2(Math.max(.14, .14 + 1.0 * Math.pow(u, 1.5) * (1 - .22 * Math.pow(u, 6))), y)); }
    G.add(new T.Mesh(new T.LatheGeometry(prof, 56), gm));
    [-H - .12, H + .12].forEach(y => { const d = new T.Mesh(new T.CylinderGeometry(1.3, 1.3, .2, 56), gold); d.position.y = y; G.add(d); });
    for (let i = 0; i < 3; i++) { const a = i * Math.PI * 2 / 3 + .5, p = new T.Mesh(new T.CylinderGeometry(.05, .05, 2 * H + .3, 12), gold); p.position.set(Math.cos(a) * 1.2, 0, Math.sin(a) * 1.2); G.add(p); }
    const sandM = new T.MeshStandardMaterial({ color: 0xe8c872, emissive: 0xe8c872, emissiveIntensity: .35, roughness: .65, metalness: .2 });
    const topS = new T.Mesh(new T.ConeGeometry(.92, 2, 36).translate(0, -1, 0), sandM); topS.rotation.x = Math.PI; topS.position.y = .05;
    const botS = new T.Mesh(new T.ConeGeometry(.92, 2, 36).translate(0, 1, 0), sandM); botS.position.y = -H + .05;
    const NS = 70, sp = new Float32Array(NS * 3), sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3));
    const stream = new T.Points(sg, new T.PointsMaterial({ size: .06, color: 0xfff2c0, transparent: true, opacity: .95, blending: T.AdditiveBlending, depthWrite: false }));
    const hl = halo([[0, 'rgba(127,227,208,.55)'], [1, 'rgba(127,227,208,0)']], 6); hl.position.z = -.6;
    G.add(topS, botS, stream, hl); o.S.add(G);
    let k = 0, flip = 0, last = 0;
    o.f.push((o, t) => {
      const dt = Math.min(.1, t - last); last = t;
      if (!flip) { k += dt / 26; if (k >= 1) { k = 1; flip = 1; } }
      else { G.rotation.z += dt * 2.1; if (G.rotation.z >= Math.PI) { G.rotation.z = 0; flip = 0; k = 0; } }
      const s = 1 - k; topS.scale.set(.35 + .65 * s, Math.max(.001, s), .35 + .65 * s); botS.scale.set(.35 + .65 * k, Math.max(.001, k), .35 + .65 * k);
      const yEnd = -H + .05 + 2 * k;
      for (let i = 0; i < NS; i++) { const f = (t * .9 + i / NS) % 1; sp[i * 3] = Math.sin(i * 7.3) * .02; sp[i * 3 + 1] = .05 - f * (.05 - yEnd); sp[i * 3 + 2] = Math.cos(i * 5.1) * .02; if (k <= 0 || k >= 1) sp[i * 3 + 1] = 9; }
      sg.attributes.position.needsUpdate = true;
      if (!flip) G.rotation.y += .004 + o.v; else G.rotation.y *= .96;
      hl.scale.setScalar(6 + Math.sin(t * 1.5) * .4);
    });
  }

  /* 5) الكرة الفلكية: حلقات متداخلة، اثنا عشر نوراً، نواة مضيئة */
  function armillary(o) {
    const G = new T.Group(), gold = M(0xe8c872, .75, .25, .25), teal = M(0x1f9d9a, .5, .35, .3);
    const rings = [3, 2.55, 2.1, 1.65].map((r, i) => { const m = new T.Mesh(new T.TorusGeometry(r, .04 + .01 * i, 12, 128), i % 2 ? teal : gold); m.rotation.set(i * .7, i * .5, 0); G.add(m); return m; });
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, b = new T.Mesh(new T.SphereGeometry(i === 11 ? .15 : .1, 16, 16), M(i === 11 ? 0x7fe3d0 : 0xfff2c0, .2, .3, .9)); b.position.set(Math.cos(a) * 3, Math.sin(a) * 3, 0); rings[0].add(b); }
    const core = new T.Mesh(new T.IcosahedronGeometry(.62, 2), M(0xfff2c0, .2, .2, .9)); G.add(core);
    const hl = halo([[0, 'rgba(255,240,190,.9)'], [.4, 'rgba(232,200,114,.3)'], [1, 'rgba(232,200,114,0)']], 5); G.add(hl);
    o.S.add(G);
    o.f.push((o, t) => { rings.forEach((r, i) => { r.rotation.x += .003 * (i + 1) + o.v * .4; r.rotation.y += .002 * (4 - i); }); core.rotation.y += .02; G.rotation.y += .002 + o.v; hl.scale.setScalar(5 + Math.sin(t * 2) * .3); });
  }

  /* ───── نجمة الواجهة الكبرى: زجاج ذهبي خلف العنوان ───── */
  function hero() {
    const c = document.getElementById('hero3d'); if (!c) return;
    const o = mk(c, 40, 12.5), G = new T.Group();
    const gl = (col, op) => new T.MeshStandardMaterial({ color: col, metalness: .75, roughness: .22, emissive: col, emissiveIntensity: .25, transparent: true, opacity: op });
    const s1 = star(3.4, 2.5, 12, .7, gl(0xe8c872, .55)), s2 = star(2.3, 1.7, 12, .55, gl(0x1f9d9a, .6)), s3 = star(1.3, .98, 12, .45, gl(0xfff2c0, .5));
    s2.rotation.z = Math.PI / 12; s2.position.z = .45; s3.position.z = .85;
    const gem = new T.Mesh(new T.IcosahedronGeometry(.3, 1), M(0x9ff0d9, .3, .2, .45)); gem.position.z = 1.3;
    const hl = halo([[0, 'rgba(255,240,190,.9)'], [.25, 'rgba(255,226,150,.35)'], [1, 'rgba(232,200,114,0)']], 10); hl.position.z = -.6;
    const r1 = new T.Mesh(new T.TorusGeometry(4.5, .03, 10, 200), M(0x7fe3d0, .3, .3, .4)), r2 = new T.Mesh(new T.TorusGeometry(5.1, .018, 8, 200), M(0xe8c872, .5, .3, .3));
    r1.rotation.set(-.35, .3, 0); r2.rotation.x = 1.05;
    const orb = new T.Group();
    for (let i = 0; i < 12; i++) { const b = new T.Mesh(new T.SphereGeometry(i === 11 ? .2 : .13, 20, 20), M(i === 11 ? 0x7fe3d0 : 0xfff2c0, .2, .3, .9)), a = i * Math.PI / 6; b.position.set(Math.cos(a) * 4.5, Math.sin(a) * 4.5, 0); orb.add(b); }
    orb.rotation.set(-.35, .3, 0);
    const N = 420, pp = new Float32Array(N * 3), sp = new Float32Array(N);
    for (let i = 0; i < N; i++) { const a = Math.random() * 6.283, r = 1.5 + Math.random() * 4.2; pp[i * 3] = Math.cos(a) * r; pp[i * 3 + 1] = (Math.random() - .5) * 9; pp[i * 3 + 2] = Math.sin(a) * r * .5; sp[i] = .006 + Math.random() * .014; }
    const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pp, 3));
    const sparks = new T.Points(pg, new T.PointsMaterial({ size: .07, color: 0xfff2c0, transparent: true, opacity: .8, blending: T.AdditiveBlending, depthWrite: false }));
    G.add(s1, s2, s3, gem, hl, r1, r2, orb, sparks); o.S.add(G);
    const fit = () => { const a = c.clientWidth / Math.max(1, c.clientHeight); G.scale.setScalar(Math.max(.26, Math.min(.58, .58 * a / 1.3))); };
    o.f.push((o, t) => {
      fit(); G.rotation.y += ((Math.sin(t * .35) * .45 + o.mx * .7) - G.rotation.y) * .05; G.rotation.x += ((Math.sin(t * .27) * .1 + o.my * .45) - G.rotation.x) * .05;
      s2.rotation.z += .004; s3.rotation.z -= .007; gem.rotation.y += .03; orb.rotation.z += .004; r2.rotation.z += .003;
      for (let i = 0; i < N; i++) { pp[i * 3 + 1] += sp[i]; if (pp[i * 3 + 1] > 4.6) pp[i * 3 + 1] = -4.6; }
      pg.attributes.position.needsUpdate = true; hl.scale.setScalar(10 + Math.sin(t * 1.6) * .5);
    });
  }

  const MODELS = { dome: [45, 12.5, dome], star: [45, 10, starModel], globe: [45, 6.8, globe], hourglass: [45, 9.5, hourglass], armillary: [45, 9.5, armillary] };
  try {
    bg();
    $$('.cv[data-model]').forEach(c => { const m = MODELS[c.dataset.model]; if (m) { try { m[2](mk(c, m[0], m[1])); } catch (e) { console.warn('[3d:' + c.dataset.model + ']', e); } } });
    hero();
  } catch (e) { console.warn('[3d]', e); fail(); }
})();
