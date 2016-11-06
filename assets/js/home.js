(function() {
	'use strict'

	var mapa = document.getElementsByClassName('mapa')[0];
	if(mapa) {
		mapa.classList.add('visivel');
		mapa.addEventListener('click', () => mapa.classList.add('selecionado'));
		mapa.addEventListener('mouseleave', () => mapa.classList.remove('selecionado'));
	}

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

	if(navigator.onLine) {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js', {scope: '/'})
			.then(function(reg) {
				console.log('Registration succeeded. Scope is ' + reg.scope);
			}).catch(function(error) {
				console.log('Registration failed with ' + error);
			});
		}
	} else {
		connectionTreatment.offline();
	}

	window.addEventListener('load', function() {
		window.addEventListener('online',  () => connectionTreatment.online());
		window.addEventListener('offline', () => connectionTreatment.offline());
	});
})();
