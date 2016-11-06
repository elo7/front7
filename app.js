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

handlebars.create({helpers: handlebarsHelpers()});
app.engine('html', handlebars());
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

let homeController = require('./controllers/home');

app.get(['/', '/index.html'], homeController);
app.get('/speaker/:name', homeController);

let listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Up at port', listener.address().port);
});
