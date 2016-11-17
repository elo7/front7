define(['doc', 'router'], function($, router) {
	router
		.register('/palestrante/(.*)', '/api/palestrante/{0}', 'speaker')
		.register('/palestrantes', '/api/palestrantes', 'speakers')
		.bind();
});
