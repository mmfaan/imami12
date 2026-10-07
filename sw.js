/* عامل الخدمة: الشبكة أولاً مع نسخة احتياطية للعمل دون اتصال */
const V='mhd-mux5uqoq';
const CORE=["./","index.html","imam.html","ghayba.html","library.html","duas.html","events.html","encyclopedia.html","about.html","404.html","css/site.css","js/text-utils.js","js/star.js","js/core.js","js/fx.js","data/site.js","logo.svg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
e.respondWith(fetch(r).then(x=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r,c))}return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))))});
