/* النجمة الاثنا عشرية — شعار الموقع ورمزه. تعمل في المتصفح وفي Node (المولِّد) */
(function (g) {
  const P = (n, R, r, rot) => {
    const a = [];
    for (let i = 0; i < n * 2; i++) {
      const t = (rot || 0) - Math.PI / 2 + i * Math.PI / n, d = i % 2 ? r : R;
      a.push([+(50 + d * Math.cos(t)).toFixed(2), +(50 + d * Math.sin(t)).toFixed(2)]);
    }
    return a;
  };
  const S = p => p.map(x => x.join(',')).join(' ');
  const clip = (k) => 'polygon(' + P(12, 50, 50 * (k || .74)).map(p => p[0] + '% ' + p[1] + '%').join(',') + ')';

  /* الشعار الكامل: نجمة ذهبية خارجية + نجمة داخلية مدارة 15° + حلقة اثنتي عشرة نقطة (الأئمة) + نور في القلب */
  function emblem(o) {
    o = o || {};
    const id = o.id || 's' + ((Math.random() * 1e6) | 0);
    const out = S(P(12, 47, 35)), inn = S(P(12, 37, 27, Math.PI / 12));
    if (o.line) {
      return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<polygon class="dr" points="' + out + '"/><polygon class="dr" points="' + inn + '" style="animation-delay:.5s"/>' +
        '<circle class="dr" cx="50" cy="50" r="19.5" style="animation-delay:1s"/><circle class="dr" cx="50" cy="50" r="6" style="animation-delay:1.3s"/></svg>';
    }
    let dots = '';
    for (let i = 0; i < 12; i++) {
      const t = -Math.PI / 2 + i * Math.PI / 6, x = (50 + 19.5 * Math.cos(t)).toFixed(2), y = (50 + 19.5 * Math.sin(t)).toFixed(2);
      if (i === 0) dots += '<circle cx="' + x + '" cy="' + y + '" r="4.2" fill="#7fe3d0" opacity=".35"/><circle cx="' + x + '" cy="' + y + '" r="2.4" fill="#7fe3d0"/>';
      else dots += '<circle cx="' + x + '" cy="' + y + '" r="1.5" fill="#f9ebb4"/>';
    }
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="النجمة الاثنا عشرية"><defs>' +
      '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#e8c872"/><stop offset="1" stop-color="#a87a2c"/></linearGradient>' +
      '<radialGradient id="' + id + 'c"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#c9fbef"/><stop offset="1" stop-color="#2fb3aa" stop-opacity="0"/></radialGradient></defs>' +
      '<polygon points="' + out + '" fill="url(#' + id + 'g)"/>' +
      '<polygon points="' + inn + '" fill="#0a1630" stroke="url(#' + id + 'g)" stroke-width=".7"/>' +
      '<circle cx="50" cy="50" r="19.5" fill="none" stroke="#e8c872" stroke-opacity=".55" stroke-width=".4" stroke-dasharray="1.2 1.8"/>' +
      dots + '<circle cx="50" cy="50" r="9" fill="url(#' + id + 'c)"/><circle cx="50" cy="50" r="2.6" fill="#fff"/></svg>';
  }

  /* أيقونة بسيطة بخط ذهبي */
  const ICON = {
    imam: null,
    ghayba: '<path d="M18 8h28M18 56h28M20 8c0 14 12 18 12 24S20 42 20 56M44 8c0 14-12 18-12 24s12 10 12 24"/><path d="M26 50c4-3 8-3 12 0" />',
    hadith: '<path d="M8 14c8-3 16-2 24 3 8-5 16-6 24-3v36c-8-3-16-2-24 3-8-5-16-6-24-3z"/><path d="M32 17v36M15 24c5-1 9 0 13 2M15 32c5-1 9 0 13 2M36 26c4-2 8-3 13-2M36 34c4-2 8-3 13-2"/>',
    duas: '<path d="M32 5c5 7 7 11 7 15a7 7 0 0 1-14 0c0-4 2-8 7-15z"/><rect x="25" y="30" width="14" height="24" rx="3"/><path d="M19 56h26M32 30v-3"/>',
    events: '<rect x="8" y="12" width="48" height="44" rx="9"/><path d="M8 25h48M21 5v12M43 5v12"/><path d="M32 31l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
    encyclopedia: '<circle cx="32" cy="32" r="24"/><path d="M8 32h48M32 8c-9 8-9 40 0 48M32 8c9 8 9 40 0 48M13 19h38M13 45h38"/>',
    about: '<path d="M32 5l21 8v17c0 14-9 24-21 29C20 54 11 44 11 30V13z"/><path d="M22 32l7 7 13-15"/>'
  };
  function icon(k, size) {
    if (k === 'imam') return emblem({ id: 'ic' + ((Math.random() * 1e5) | 0) });
    return '<svg viewBox="0 0 64 64" width="' + (size || 74) + '" height="' + (size || 74) + '" fill="none" stroke="#e8c872" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[k] || '') + '</svg>';
  }

  /* نمط الخلفية: نجمة اثنا عشرية خطية وحلقة */
  function pattern() {
    const o = S(P(12, 38, 28));
    const r = "<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'><g fill='none' stroke='#e8c872' stroke-width='.6'><polygon points='" + o + "'/><circle cx='50' cy='50' r='16'/><path d='M0 0L12 12M100 0L88 12M0 100L12 88M100 100L88 88'/></g></svg>";
    return 'url("data:image/svg+xml,' + encodeURIComponent(r) + '")';
  }

  const api = { P, S, clip, emblem, icon, pattern };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else g.STAR = api;
})(typeof window !== 'undefined' ? window : globalThis);
