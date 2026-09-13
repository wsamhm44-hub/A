const CACHE='satchel-reader-v3';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('satchel-reader-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==location.origin||url.pathname.endsWith('.zip'))return;
  if(event.request.mode==='navigate'){
    event.respondWith(caches.match('./index.html').then(cached=>cached||fetch(event.request)));return;
  }
  const allowed=SHELL.map(p=>new URL(p,self.registration.scope).pathname);
  if(!allowed.includes(url.pathname))return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
