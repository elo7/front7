var CACHE_NAME = '0.2';
var CACHE_URLS = [
	'/front7/',
	'/front7/js/home.js',
	'/front7/estilos/front7.css',
	'/front7/estilos/reset.css',
	'/front7/imagens/cover.jpg',
	'/front7/palestrantes/aline.jpg',
	'/front7/palestrantes/fernanda.jpg',
	'/front7/palestrantes/luiz.jpg',
	'/front7/palestrantes/sergio.jpg',
	'/front7/palestrantes/tiago.jpg',
	'/front7/imagens/favicons/favicon-16x16.png',
	'/front7/imagens/favicons/favicon-32x32.png',
	'/front7/imagens/favicons/favicon-48x48.png',
	'/front7/imagens/favicons/favicon-57x57.png',
	'/front7/imagens/favicons/favicon-60x60.png',
	'/front7/imagens/favicons/favicon-64x64.png',
	'/front7/imagens/favicons/favicon-72x72.png',
	'/front7/imagens/favicons/favicon-76x76.png',
	'/front7/imagens/favicons/favicon-96x96.png',
	'/front7/imagens/favicons/favicon-114x114.png',
	'/front7/imagens/favicons/favicon-120x120.png',
	'/front7/imagens/favicons/favicon-128x128.png',
	'/front7/imagens/favicons/favicon-144x144.png',
	'/front7/imagens/favicons/favicon-152x152.png',
	'/front7/imagens/favicons/favicon-160x160.png',
	'/front7/imagens/favicons/favicon-180x180.png',
	'/front7/imagens/favicons/favicon-192x192.png'
];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches
			.keys()
			.then(versions => {
				versions
					.filter(version => version != CACHE_NAME)
					.forEach(version => caches.delete(version));
			}).then(() => {
				caches.open(CACHE_NAME).then(cache => {
					return cache.addAll(CACHE_URLS);
				});
			})
	);
});

self.addEventListener('fetch', function(event) {
	if(event.request.url.indexOf(self.location.origin) != -1) {
		event.respondWith(caches.match(event.request));
	}
});

self.addEventListener('push', function(event) {
	console.log(event);
});

self.addEventListener('sync', function(event) {
	console.log(event);
});
