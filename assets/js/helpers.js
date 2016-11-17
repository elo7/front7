var __helpers = {
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
	}
};

if(typeof document !== 'undefined') {
	define('helpers', ['handlebars'], function(handlebars) {
		for(helperName in __helpers) {
			handlebars.registerHelper(helperName, __helpers[helperName]);
		}
	});
} else {
	module.exports = __helpers;
}
