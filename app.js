let express = require('express'),
  handlebars = require('express-handlebars'),
  handlebarsHelpers = require('handlebars-helpers'),
  compression = require('compression'),
  app = express();

app.use(compression());

const ASSETS_PATH = 'assets';
app.use('/' + ASSETS_PATH, express.static(ASSETS_PATH));
app.use("/manifest.json", express.static(ASSETS_PATH + '/manifest.json'));
app.use("/sw.js", express.static(ASSETS_PATH + '/js/sw.js'));
app.use('/views', express.static('views'));
app.use('/data', express.static('data'));

app.engine('html', handlebars.create({defaultLayout: 'main', helpers: handlebarsHelpers(), extname: 'html'}).engine);
app.set('views', 'views/templates');
app.set('view engine', 'html');

let homeController = require('./controllers/home'),
	apiController = require('./controllers/api');

app.use('/', homeController);
app.use('/api', apiController);

let listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Up at port', listener.address().port);
});
