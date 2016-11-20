define(['doc', 'router'], function($, router) {
	let $main = $('#main');
	$main.on('templateLoad', function() {
		$('#menu-principal-trigger').first().checked = false;
		$main.addClass('loading');
	});

	$main.on('templateLoaded', function() {
		$main.removeClass('loading');
	});

	router
		.register({uriRegex: '/palestrante/(.*)', apiRegex: '/api/palestrante/{0}', templateName: 'speaker'})
		.register({uriRegex: '/palestrantes', apiRegex: '/api/palestrantes', templateName: 'speakers'})
		.register({uriRegex: '/eventos', apiRegex: '/api/eventos', templateName: 'events'})
		.register({uriRegex: '/', apiRegex: '/api/atual', templateName: 'home'})
		.bind();
});
