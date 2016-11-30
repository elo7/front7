define(['doc', 'router'], function($, router) {
	let $main = $('#main');
	$main.on('templateLoad', function() {
		$('#menu-principal-trigger').first().checked = false;
		$main.addClass('loading');
	});

	$main.on('templateLoaded', function() {
		$main.removeClass('loading');
	});

	var connectionTreatment = (() => {
		let elements = document.querySelectorAll('.mapa', '.inscricao'),
			infoElement = document.querySelector('.offline-message');

		return {
			online: function() {
				elements.forEach(function(el) {
					el.classList.remove('hide');
				});
				infoElement.classList.add('hide');
			},
			offline: function() {
				elements.forEach(function(el) {
					el.classList.add('hide');
				});
				infoElement.classList.remove('hide');
			}
		}
	})();

	function pushManager(serviceWorker) {
		$('.secao.push').removeClass('hide');

		serviceWorker.pushManager.getSubscription().then(subscription => {
			if(subscription) {
				$('#push-notification-preference').attr('checked', 'checked');
			}
		});

		$('#push-notification-preference').on('change', e => {
			if(e.target.checked) {
				serviceWorker.pushManager.subscribe({userVisibleOnly: true})
					.then((subscription) => {
						fetch('/subscription', {
							method: 'POST',
							body: JSON.stringify({subscriptionId: subscription.endpoint.split('gcm/send/')[1]}),
							headers: new Headers({
								'Content-Type': 'application/json'
							})
						}).then(function() {
							console.log('Post subscription');
						}).catch(function(e) {
							console.log('Fetch error', e);
						});
					})
					.catch(() => e.target.checked = false);
			} else {
				serviceWorker.pushManager.getSubscription().then(subscribe => {
					subscribe.unsubscribe().then(state => console.log('unsubscribe: ', state));
				});
			}
		});
	}

	if(navigator.onLine) {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js', {scope: '/'})
			.then(function(reg) {
				pushManager(reg);
				console.log('Registration succeeded. Scope is ' + reg.scope);
			}).catch(function(error) {
				console.log('Registration failed with ' + error);
			});
		}
	} else {
		connectionTreatment.offline();
	}

	$(window).on('load', ()=> {
		$(window).on('online',  () => connectionTreatment.online());
		$(window).on('offline', () => connectionTreatment.offline());
	});

	router
		.register({uriRegex: '/palestrante/(.*)', apiRegex: '/api/palestrante/{0}', templateName: 'speaker'})
		.register({uriRegex: '/palestrantes', apiRegex: '/api/palestrantes', templateName: 'speakers'})
		.register({uriRegex: '/eventos', apiRegex: '/api/eventos', templateName: 'events'})
		.register({uriRegex: '/evento/(.*)', apiRegex: '/api/evento/{0}', templateName: 'event'})
		.register({uriRegex: '/', apiRegex: '/api/atual', templateName: 'home'})
		.bind();
});
