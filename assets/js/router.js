define('router', ['doc', 'handlebars', 'ajax'], function($, handlebars, ajax) {
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
	// router.register('/palestrante/(.*)', /api/palestrante/(.*), 'palestrantes');

	var registers = [];

	var loadTemplate = function(config) {
		ajax.get(config.apiUrl, {}, {
			success: function(json) {
				getTemplate(config.templateName, function(template) {
					$('#main').html(template(json));
				});
			}
		});
	};

	var event = function(uri, apiUrl, templateName, title) {

		return function(e) {
			e.preventDefault();

			history.pushState({
				uri: uri,
				apiUrl: apiUrl,
				title: title
			}, 'Palestrante', uri);

			loadTemplate({
				apiUrl: apiUrl,
				templateName: templateName
			});

		};
	};

	var LoadEvent = function(uriRegex, apiRegex, templateName) {


		return {
			'match': function(uri) {
				return uri.match(uriRegex);
			},

			'event': function(uri) {
				var params = uri.match(uriRegex);
				params.shift(); // Remove first match

				var apiUrl = apiRegex;
				if(params) {
					for(var i = 0; i < params.length; i++) {
						apiUrl = apiUrl.replace('{' + i + '}', params[i]);
					}
				}
				return event(uri, apiUrl, templateName);
			}
		}

	};

	window.onpopstate = function(param) {
		console.log(param);
	};

	var Router = {
		register: function(uriRegex, apiRegex, templateName) {
			registers.push(LoadEvent(uriRegex, apiRegex, templateName));
			return this;
		},

		bind: function(namespace) {
			var $namespace = namespace || $(document); 
			var $anchors = $namespace.find('a');
			$anchors.each(function(el) {
				var $anchor = $(el);
				for(var i = 0; i < registers.length; i++) {
					var register = registers[i];
					var uri = $anchor.attr('href');
					if(register.match(uri)) {
						$anchor.on('click', register.event(uri));
						break;
					}
				}
			});
		}
	};

	return Router;
});