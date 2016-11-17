define('template', ['doc', 'handlebars', 'ajax'], function($, handlebars, ajax) {
	ajax.get('/views/partials/speaker.html', {}, {
		success: function(template) {
			handlebars.registerPartial('speaker', template);
		}
	});

	ajax.get('/views/partials/speakers.html', {}, {
		success: function(template) {
			handlebars.registerPartial('speakers', template);
		}
	});


	function getTemplate(templateName, cb) {
		ajax.get('/views/templates/' + templateName + '.html', {}, {
			success: function(template) {
				cb(handlebars.compile(template));
			}
		});
	};

	var loadTemplate = function(config, cb) {
		$.broadcast('templateLoad');
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
	};

	return {
		loadTemplate: loadTemplate
	};
});