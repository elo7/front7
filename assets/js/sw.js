var CACHE_NAME = '0.11';

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

self.addEventListener('push', function(event) {
	console.log(event);
});

self.addEventListener('sync', function(event) {
	console.log(event);
});
