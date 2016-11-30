(function() {
	'use strict'

	var mapa = document.getElementsByClassName('mapa')[0];
	if(mapa) {
		mapa.classList.add('visivel');
		mapa.addEventListener('click', () => mapa.classList.add('selecionado'));
		mapa.addEventListener('mouseleave', () => mapa.classList.remove('selecionado'));
	}
})();
