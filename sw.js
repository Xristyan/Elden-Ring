// Tarnished Atlas service worker: app shell + low-zoom tiles up front, detail tiles cached as you look at them.
const V="atlas-7ec48bf0", SHELL=["./", "index.html", "data.js", "icons.webp", "leaflet.js", "manifest.webmanifest", "apple-touch-icon.png", "icon-192.png", "icon-512.png"], LOW=["tiles/M10/2/0_1.webp", "tiles/M10/2/0_0.webp", "tiles/M10/2/1_1.webp", "tiles/M10/2/1_0.webp", "tiles/M10/0/0_0.webp", "tiles/M10/1/0_0.webp", "tiles/M01/2/1_2.webp", "tiles/M01/2/0_1.webp", "tiles/M01/2/0_0.webp", "tiles/M01/2/1_1.webp", "tiles/M01/2/1_0.webp", "tiles/M01/0/0_0.webp", "tiles/M01/1/0_1.webp", "tiles/M01/1/0_0.webp", "tiles/M00/2/1_2.webp", "tiles/M00/2/0_1.webp", "tiles/M00/2/0_0.webp", "tiles/M00/2/2_1.webp", "tiles/M00/2/1_1.webp", "tiles/M00/2/2_2.webp", "tiles/M00/2/2_0.webp", "tiles/M00/2/0_2.webp", "tiles/M00/2/1_0.webp", "tiles/M00/0/0_0.webp", "tiles/M00/1/0_1.webp", "tiles/M00/1/0_0.webp", "tiles/M00/1/1_1.webp", "tiles/M00/1/1_0.webp"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL).then(()=>c.addAll(LOW).catch(()=>{}))).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=="atlas-tiles").map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url); if(e.request.method!=="GET") return;
  const tile=u.pathname.includes("/tiles/"), font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(tile||font){e.respondWith(caches.open(tile?"atlas-tiles":V).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok||n.type==="opaque")c.put(e.request,n.clone());return n;}))));return;}
  if(u.origin===location.origin) e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));
});
