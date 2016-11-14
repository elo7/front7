define(['doc', 'handlebars', 'ajax'], function($, handlebars, ajax) {
	function getTemplate(templateName, cb) {
		ajax.get('/views/templates/' + templateName + '.html', {}, {
			success: function(template) {
				cb(handlebars.compile(template));
			}
		});
	}

	$('.palestrante .nome a').on('click', function(e) {
		e.preventDefault();

		ajax.get('/api' + $(this).attr('href'), {}, {
			success: function(json) {
				getTemplate('speaker', function(template) {
					console.log(template(json));
				});
			}
		});
	});
});
