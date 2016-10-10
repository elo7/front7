let express = require('express'),
  handlebars = require('express-handlebars'),
  handlebarsHelpers = require('./assets/js/helpers.js'),
  compression = require('compression'),
  bodyParser = require('body-parser'),
  app = express();
  fs = require('fs'),
  ampTemplates = new Map(),
  templatesDir = 'views/templates';

app.use(compression());
app.use(bodyParser());

const ASSETS_PATH = 'assets';
app.use('/' + ASSETS_PATH, express.static(ASSETS_PATH));
app.use('/manifest.json', express.static(ASSETS_PATH + '/manifest.json'));
app.use('/sw.js', express.static(ASSETS_PATH + '/js/sw.js'));
app.use('/views', express.static('views'));
app.use('/data', express.static('data'));

app.engine('html', handlebars.create({defaultLayout: 'main', helpers: handlebarsHelpers, extname: 'html'}).engine);
app.set('views', templatesDir);
app.set('view engine', 'html');

app.use(function(req, res, next) {
		let _render = res.render;
		let ampUrl = (url) => {
			const ampParam = '?amp=true';
			return url.indexOf(ampParam) >= 0 ? url : url + ampParam;
		}

		res.render = function() {
			if (typeof arguments[1] === 'object') {
				arguments[1].canonical = req.url;

				if (ampTemplates.has(arguments[0]) && ampTemplates.get(arguments[0])) {
					arguments[1].ampurl = ampUrl(req.url);
				} else {
					const ampFile = fs.existsSync(`${__dirname}/${templatesDir}/${arguments[0]}-amp.html`);
					if (ampFile) {
						ampTemplates.set(arguments[0], true);
						arguments[1].ampurl = ampUrl(req.url);

						if (req.query.amp) {
							arguments[0] += '-amp';
							arguments[1].amp = true;
						}
					}
				}

			}
			_render.apply(this, arguments);
		};
	next();
});

let homeController = require('./controllers/home'),
	apiController = require('./controllers/api');

app.use('/', homeController);
app.use('/api', apiController);

let listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Up at port', listener.address().port);
});
