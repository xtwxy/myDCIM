'use strict'
require('dcim-logger');
var express = require('express');

var app = express();

var hbs = require('hbs');
app.set('views', 'templates');
app.set('view engine', 'html');
app.engine('.html', hbs.__express);

var config = require('dcim-config');

app.use(require('serve-favicon')(require('path').join(__dirname, 'public', 'favicon.ico')));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));
app.use(require('cookie-parser')());

app.use(express.static(__dirname + '/public', {
	maxAge : config.fileMaxAge * 3600 * 24 * 1000
}));

app.get('/static.js', require('./static'));

function getClientIp(req) {
	return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress
			|| req.connection.socket.remoteAddress;
};


app.use(function(req, res, next) {
	logger.accessLog(" "+getClientIp(req) + " " + req.url);
	next();
});

require('dcim-permissions').initLogin(app, "");

app.get('/', function(req, res) {
	res.redirect("index.html");
});

app.use('', require("./apps"));

require('dcim-permissions').initCheckLogin(app);

require('./wbsocket-server').initWs(app);

app.use('', require('./uitest'));

for ( var module in config.modules) {
	var path = require('path').join(__dirname, "modules", module);
	var url = config.modules[module];
	app.use(url, require(path));
}

app.use(function(req, res, next) {
	var err = new Error('Not Found:'+ req.url);
	err.status = 404;
	logger.warn("not found: " + req.url);
	next(err);
});

app.use(function(err, req, res) {
	var resBody = {
		status : err.status || 500,
		message : err.message
	};
	err.status = err.status || 500;
	res.status(err.status || 500);
	err.stack = err.stack || "";
	err.url= req.url;
	logger.error(err);
	res.send(resBody);
});

if (config.secure) {
	var https = require('https');
	var fs = require('fs');
	var privateKey = fs.readFileSync('ca/private.pem', 'utf8');
	var certificate = fs.readFileSync('ca/file.crt', 'utf8');
	var credentials = {
		key : privateKey,
		cert : certificate
	};
	var httpsServer = https.createServer(credentials, app);

	httpsServer.listen(config.httpPort, function() {
		logger.log('HTTPS Server is running onport:'+ config.httpPort);
	});
} else {
	app.listen(config.httpPort);
	logger.log('HTTP server listening on port: ' + config.httpPort);
}
