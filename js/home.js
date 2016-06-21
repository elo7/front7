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
})();
