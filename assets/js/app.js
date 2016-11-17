define(['doc', 'router'], function($, router) {
	var $main = $('#main');
	$main.on('templateLoad', function() {
		$('#menu-principal-trigger').first().checked = false;
		$main.addClass('loading');
	});

	$main.on('templateLoaded', function() {
		$main.removeClass('loading');
	});

	router
		.register('/palestrante/(.*)', '/api/palestrante/{0}', 'speaker')
		.register('/palestrantes', '/api/palestrantes', 'speakers')
		.register('/eventos', '/api/eventos', 'events')
		.register('/', '/api/atual', 'home')
		.bind();
});
