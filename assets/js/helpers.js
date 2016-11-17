var __helpers = {
	'pluralize': function(length, singular, plural) {
		return length > 0? plural : singular;
	},

	'each': function(context, options) {
		var ret = '';
		for(var i = 0, j = context.length; i < j; i++) {
			ret = ret + options.fn(context[i]);
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
