const C='sodo-20261024-1310';
const CORE=['./','./index.html','./xlsx.full.min.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./leaflet.js','./docx.umd.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!=='sodo-tiles').map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function withTimeout(p,ms){return new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('timeout')),ms);p.then(r=>{clearTimeout(t);res(r);},e=>{clearTimeout(t);rej(e);});});}
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(req.mode==='navigate'){
    e.respondWith(withTimeout(fetch(req.url,{cache:'no-store'}),4000).then(r=>{const cc=r.clone();caches.open(C).then(c=>c.put('./index.html',cc));return r;}).catch(()=>caches.match('./index.html')));
    return;
  }
  if(/arcgisonline\.com$|tile\.openstreetmap\.org$/.test(u.host)){
    e.respondWith(caches.open('sodo-tiles').then(c=>c.match(req).then(r=>r||fetch(req).then(r2=>{if(r2.ok||r2.type==='opaque'){c.put(req,r2.clone());c.keys().then(k=>{if(k.length>4000)k.slice(0,300).forEach(x=>c.delete(x));});}return r2;}))));
    return;
  }
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.host)){
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(r2=>{const cc=r2.clone();caches.open(C).then(c=>c.put(req,cc));return r2;})));
  }
});
