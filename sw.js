// Tarnished Atlas service worker.
// App files: network first (new versions show up right away), cache when offline.
// Map tiles and fonts: cache first, saved as you look at them.
const V="atlas-3c932a24", SHELL=["./", "index.html", "data.js", "icons.webp", "leaflet.js", "manifest.webmanifest", "apple-touch-icon.png", "icon-192.png", "icon-512.png"], LOW=["tiles/M00/0/0_0.webp", "tiles/M00/1/0_0.webp", "tiles/M00/1/0_1.webp", "tiles/M00/1/1_0.webp", "tiles/M00/1/1_1.webp", "tiles/M00/2/0_0.webp", "tiles/M00/2/0_1.webp", "tiles/M00/2/0_2.webp", "tiles/M00/2/1_0.webp", "tiles/M00/2/1_1.webp", "tiles/M00/2/1_2.webp", "tiles/M00/2/2_0.webp", "tiles/M00/2/2_1.webp", "tiles/M00/2/2_2.webp", "tiles/M01/0/0_0.webp", "tiles/M01/1/0_0.webp", "tiles/M01/1/0_1.webp", "tiles/M01/2/0_0.webp", "tiles/M01/2/0_1.webp", "tiles/M01/2/1_0.webp", "tiles/M01/2/1_1.webp", "tiles/M01/2/1_2.webp", "tiles/M10/0/0_0.webp", "tiles/M10/1/0_0.webp", "tiles/M10/2/0_0.webp", "tiles/M10/2/0_1.webp", "tiles/M10/2/1_0.webp", "tiles/M10/2/1_1.webp"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:"reload"}))).then(()=>c.addAll(LOW).catch(()=>{}))).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=="atlas-tiles").map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function netFirst(req){
  return caches.open(V).then(c=>{
    const net=fetch(req,{cache:"no-cache"}).then(r=>{if(r.ok)c.put(req,r.clone());return r;});
    const slow=new Promise(res=>setTimeout(()=>c.match(req,{ignoreSearch:true}).then(res),3500));
    return Promise.race([net.catch(()=>c.match(req,{ignoreSearch:true})),slow.then(r=>r||net)]).then(r=>r||c.match(req,{ignoreSearch:true}));
  });
}
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const u=new URL(req.url), tile=u.pathname.includes("/tiles/"), font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(tile||font){e.respondWith(caches.open(tile?"atlas-tiles":V).then(c=>c.match(req).then(r=>r||fetch(req).then(n=>{if(n.ok||n.type==="opaque")c.put(req,n.clone());return n;}))));return;}
  if(u.origin===location.origin){
    if(req.mode==="navigate"||/\/(index\.html|data\.js|sw\.js|manifest\.webmanifest)?$/.test(u.pathname)||u.pathname.endsWith("data.js")) e.respondWith(netFirst(req));
    else e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req)));
  }
});
