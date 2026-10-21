const C='sodo-15704097';
const CORE=['./','./index.html','./xlsx.full.min.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function withTimeout(p,ms){return new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('timeout')),ms);p.then(r=>{clearTimeout(t);res(r);},e=>{clearTimeout(t);rej(e);});});}
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(req.mode==='navigate'){
    e.respondWith(withTimeout(fetch(req),4000).then(r=>{const cc=r.clone();caches.open(C).then(c=>c.put('./index.html',cc));return r;}).catch(()=>caches.match('./index.html')));
    return;
  }
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.host)){
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(r2=>{const cc=r2.clone();caches.open(C).then(c=>c.put(req,cc));return r2;})));
  }
});
