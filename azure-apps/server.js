var express = require('express'),
    serveStatic = require('serve-static'),
    azureMobileApps = require('azure-mobile-apps');

var app = express();

var mobile = azureMobileApps({
    homePage: false,
    swagger: true
});

// Configure the Azure Mobile Apps middleware
mobile.tables.import('./tables');

// Configure the static area
app.use(serveStatic('public'));

// Configure a router for /node_modules - this will allow
// you to include files directly from /node_modules
var npmRouter = express.Router();
npmRouter.use(serveStatic('node_modules', {
    dotfile: 'ignore',
    etag: true,
    index: false,
    lastModified: true
}));
app.use('/node_modules', npmRouter);

function rtrim(stringToTrim) {
	return stringToTrim.replace(/\s+$/,"");
}

// The recorder client script sends console output here
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/xws', function (req, res, next) {
  console.log(rtrim(req.body.data))
  res.end();
});

// Initialize the app and start listening on the port
mobile.tables.initialize().then(function () {
    app.use(mobile);
    app.listen(process.env.PORT || 3000);
    console.log('Browse to port 3000')
});



