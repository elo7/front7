(function() {
	'use strict'

	var mapa = document.getElementsByClassName('mapa')[0];
	mapa.classList.add('visivel');

	mapa.addEventListener('click', function() {
		mapa.classList.add('selecionado');
	});

	mapa.addEventListener('mouseleave', function() {
		mapa.classList.remove('selecionado');
	});

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('sw.js', {scope: '/front7/'})
			.then(function(reg) {
				console.log('Registration succeeded. Scope is ' + reg.scope);
			}).catch(function(error) {
				console.log('Registration failed with ' + error);
			});
	}

	window.addEventListener('load', function() {
		window.addEventListener('online',  function() {
			[].foreach.call(document.querySelectorAll('.mapa', '.inscricao'), function(el) {
				el.classList.remove('hide');
			});
			document.querySelector('.offline-message').classList.add('hide');
		});
		window.addEventListener('offline', function() {
			[].foreach.call(document.querySelectorAll('.mapa', '.inscricao'), function(el) {
				el.classList.add('hide');
			});
			document.querySelector('.offline-message').classList.remove('hide');
		});
	});
})();
