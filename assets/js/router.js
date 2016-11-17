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

	var registers = [];

	var Router = {
		register: function(uriRegex, apiRegex, templateName) {
			registers.push(Route(uriRegex, apiRegex, templateName));
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

	var loadTemplate = function(config) {
		console.log('Loading', config);
		ajax.get(config.apiUrl, {}, {
			success: function(json) {
				getTemplate(config.templateName, function(template) {
					$('#main').html(template(json));
				});
			}
		});
		Router.bind($('#main'));
	};

	var event = function(uri, apiUrl, templateName, title) {

		return function(e) {
			e.preventDefault();

			var state = {
				uri: uri,
				apiUrl: apiUrl,
				templateName: templateName
			};

			history.pushState(state, title, uri);

			loadTemplate(state);

		};
	};

	var Route = function(uriRegex, apiRegex, templateName, title) {
		var match = function(uri) {
			console.log(uri, 'matches', uriRegex, '?', uri.match(uriRegex));
			return uri.match(uriRegex);
		};

		var apiUrl = function(uri) {
			var params = uri.match(uriRegex);
			params.shift(); // Remove first match

			var apiUrl = apiRegex;
			if(params) {
				for(var i = 0; i < params.length; i++) {
					apiUrl = apiUrl.replace('{' + i + '}', params[i]);
				}
			}
			return apiUrl;
		};

		if(match(location.pathname)) {
			var state = {
				uri: location.pathname,
				apiUrl: apiUrl(location.pathname),
				templateName: templateName
			};

			history.replaceState(state, title, location.pathname);
		}

		return {
			'match': match,

			'event': function(uri) {
				return event(uri, apiUrl(uri), templateName);
			}
		}

	};

	window.onpopstate = function(event) {
		loadTemplate(event.state);
	};

	return Router;
});