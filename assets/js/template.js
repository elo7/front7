define('template', ['doc', 'handlebars', 'ajax'], function($, handlebars, ajax) {
	function registerPartials(template) {
		let regex = /{{>.*}}/g,
			res = [];
			match = null;

		if (regex.global) {
				while (match = regex.exec(template)) {
						res.push(match);
				}
		} else {
				if (match = regex.exec(template)) {
						res.push(match);
				}
		}

		res.forEach(function (item) {
			registerPartial(item[0].replace('{{>', '').replace('}}', ''));
		});
	}

	function registerPartial(partialName) {
		ajax.get('/views/partials/' + partialName + '.html', {}, {
			success: function(template) {
				registerPartials(template);
				handlebars.registerPartial(partialName, template);
			}
		});
	};

	function getTemplate(templateName, cb) {
		ajax.get('/views/templates/' + templateName + '.html', {}, {
			success: function(template) {
				registerPartials(template);
				cb(handlebars.compile(template));
			}
		});
	};

	let loadTemplate = function(config, cb) {
		if(config) {
			$.broadcast('templateLoad');
			if(config.apiUrl) {
				ajax.get(config.apiUrl, {}, {
					success: function(json) {
						getTemplate(config.templateName, function(template) {
							$('#main').html(template(json));
							$.broadcast('templateLoaded');
							cb();
						});
					}
				}, {
					async: true
				});
			} else {
				getTemplate(config.templateName, function(template) {
					$('#main').html(template());
					$.broadcast('templateLoaded');
					cb();
				});
			}
		}
	};

	return {
		loadTemplate: loadTemplate
	};
});
