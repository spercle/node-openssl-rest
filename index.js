//var openssl = require('./lib/openssl.js')
var express_ssl = require('./lib/express_ssl.js')
var config = require('./config.js')
var express = require('express')
//var multer  = require('multer');
var bodyParser = require('body-parser')
//var https = require('https');
var mustacheExpress = require('mustache-express');
var app = express();
var certtemplates = require('./templates.js');

//console.log(config);

express_ssl.getSSL(function(sslOptions) {
	var server = require('https').createServer(sslOptions, app).listen(8443);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies.

// Register '.mustache' extension with The Mustache Express
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use('/bower_components',  express.static(__dirname + '/bower_components'));

//app.use(express.static('files'))app.use('/api/auth', require('./api/auth'));

var template = {
	title: "CertificateTools.com CSR/Certificate Generator",
	certtemplates: certtemplates,
	javascripttemplates: JSON.stringify(certtemplates, null, 4)
	
}
	
app.get('/', function(req, res) {
	console.log(req.headers);
	res.render('index.html', template);
});

app.use(function(req, res, next) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	//res.header('Content-Type', 'application/json');
	//res.header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
	next();
});

app.use('/api/openssl', require('./api/openssl'));
