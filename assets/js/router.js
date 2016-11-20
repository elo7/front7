define('router', ['doc', 'template'], function($, template) {
	let registers = [];

	let Router = {
		register: function(options) {
			registers.push(Route(options));
			return this;
		},

		bind: function(namespace) {
			let $namespace = namespace || $(document);
			let $anchors = $namespace.find('a[href^="/"]');
			$anchors.each(function(el) {
				let $anchor = $(el),
					uri = $anchor.attr('href');

				if(uri.indexOf('/#') == -1) {
					for(let i = 0; i < registers.length; i++) {
						let register = registers[i];
						if(register.match(uri)) {
							$anchor.on('click', register.event(uri));
							break;
						}
					}
				}
			});
		}
	};

	let Route = function({uriRegex, apiRegex, templateName}) {
		let match = function(uri) {
			return uri.match(uriRegex);
		};

		let apiUrl = function(uri) {
			let params = uri.match(uriRegex);
			params.shift(); // Remove first match

			let apiUrl = apiRegex;
			if(params) {
				for(let i = 0; i < params.length; i++) {
					apiUrl = apiUrl.replace('{' + i + '}', params[i]);
				}
			}
			return apiUrl;
		};

		let event = function(uri, apiUrl, templateName) {
			return function(e) {
				e.preventDefault();

				let state = {
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
			let state = {
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
