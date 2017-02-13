importScripts('/assets/js/vendor/idbKeyval.js');

var CACHE_NAME = '0.12.2';

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
	    fetch('/assets/js/cache.json')
	      .then(function(response) {
	        return response.json();
	      })
	      .then(function(files) {
				caches.open(CACHE_NAME).then(function(cache) {
					cache.addAll(files);
				})
	      })
	      .then(function() {
	        return self.skipWaiting(); //this is for skip the sw activate rules (when all tabs running this sw are closed)
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

self.addEventListener('sync', function(event) {
	console.log(event);
		idbKeyval.get(event.tag).then(config => {
			fetch(config.action, {
				'method': 'POST',
				'body': JSON.stringify(config.data),
				'headers': {
					'Content-Type': 'application/json'
				}
			}).then(() => {
				idbKeyval.delete(event.tag);
				console.log('Post success!');
			})
			.catch(() => console.log('Post failure =('));
		});
});

self.addEventListener('push', function(event) {
	const title = '4 Edição do Front7';
	const options = {
		icon: '/assets/images/favicons/favicon-144x144.png',
		body: 'Venha conhecer mais sobre PWA no dia 05/12!',
		tag: 'front7'
	};

	event.waitUntil(self.registration.showNotification(title, options));
});
