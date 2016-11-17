define('router', ['doc', 'template'], function($, template) {
	var registers = [];

	var Router = {
		register: function(uriRegex, apiRegex, templateName) {
			registers.push(Route(uriRegex, apiRegex, templateName));
			return this;
		},

		bind: function(namespace) {
			var $namespace = namespace || $(document); 
			var $anchors = $namespace.find('a[href^="/"]');
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

	var Route = function(uriRegex, apiRegex, templateName) {
		var match = function(uri) {
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

		var event = function(uri, apiUrl, templateName) {
			return function(e) {
				e.preventDefault();

				var state = {
					uri: uri,
					apiUrl: apiUrl,
					templateName: templateName
				};

				history.pushState(state, "Front7", uri);

				template.loadTemplate(state, function() {
					Router.bind($('#main'));
				});
			};
		};

		if(!history.state && match(location.pathname)) {
			var state = {
				uri: location.pathname,
				apiUrl: apiUrl(location.pathname),
				templateName: templateName
			};

			history.replaceState(state, "Front7", location.pathname);
		}

		return {
			'match': match,
			'event': function(uri) {
				return event(uri, apiUrl(uri), templateName);
			}
		}

	};

	window.onpopstate = function(event) {
		template.loadTemplate(event.state, function() {
			Router.bind($('#main'));
		});
	};

	return Router;
});