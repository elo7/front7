let __helpers = {
	'pluralize': function(array, singular, plural) {
		if(typeof array === 'object') {
		 	return Object.keys(array).filter(function(k) { return !isNaN(k) }).length > 1? plural : singular;
		}
		return array.length > 0? plural : singular;
	},

	'each': function(list, options) {
		var ret = '';
		for(var item in list) {
			if(isNaN(item)) continue;
			ret = ret + options.fn(list[item]);
		}
		return ret;
	},
	'ampParam': function() {
		if (this.amp) {
			return '?amp=true';
		}
		return '';
	}
};

if(typeof document !== 'undefined') {
	define('helpers', ['handlebars'], function(handlebars) {
		for(helperName in __helpers) {
			handlebars.registerHelper(helperName, __helpers[helperName]);
		}
	});
} else {
	let fs = require('fs'),
		keysFile = JSON.parse(fs.readFileSync('./keys.json', 'utf8'));
	__helpers.key = (key) => {
		function getKey(keys) {
			let nextKey = keysFile[keys.shift()];
			return typeof nextKey === 'string' ? nextKey : getKey(keys);
		}
		return getKey(key.split('.'));
	};
	__helpers.read = (filepath) => {
		return fs.readFileSync(filepath, 'utf8');
	}
	module.exports = __helpers;
}
