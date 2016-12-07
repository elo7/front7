var CACHE_NAME = '0.6';
var CACHE_URLS = [
	'index.html',
	'js/home.js',
	'estilos/front7.css',
	'estilos/reset.css',
	'imagens/cover.jpg',
	'palestrantes/aline.jpg',
	'palestrantes/erika.jpg',
	'palestrantes/fernanda.jpg',
	'palestrantes/luiz.jpg',
	'palestrantes/sergio.jpg',
	'palestrantes/tiago.jpg',
	'imagens/favicons/favicon-16x16.png',
	'imagens/favicons/favicon-32x32.png',
	'imagens/favicons/favicon-48x48.png',
	'imagens/favicons/favicon-57x57.png',
	'imagens/favicons/favicon-60x60.png',
	'imagens/favicons/favicon-64x64.png',
	'imagens/favicons/favicon-72x72.png',
	'imagens/favicons/favicon-76x76.png',
	'imagens/favicons/favicon-96x96.png',
	'imagens/favicons/favicon-114x114.png',
	'imagens/favicons/favicon-120x120.png',
	'imagens/favicons/favicon-128x128.png',
	'imagens/favicons/favicon-144x144.png',
	'imagens/favicons/favicon-152x152.png',
	'imagens/favicons/favicon-160x160.png',
	'imagens/favicons/favicon-180x180.png',
	'imagens/favicons/favicon-192x192.png'
];

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(versions) {
			return Promise.all(
				versions.map(function(version) {
					if (CACHE_NAME != version) {
						return caches.delete(version);
					}
				})
			);
		})
	);
});

self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(CACHE_URLS);
		})
	);
});

self.addEventListener('fetch', function(event) {
	if(event.request.url.indexOf(self.location.origin) != -1) {
		event.respondWith(
			caches.match(event.request).then(function(response){
				return response || fetch(event.request.clone());
			})
		);
	}
});

self.addEventListener('push', function(event) {
	console.log(event);
});

self.addEventListener('sync', function(event) {
	console.log(event);
});
