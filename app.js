var express = require( 'express');
var bodyParser = require('body-parser');
var http = require('http');
var request = require('request');
var mongoose = require('mongoose');

const app = express();

var User = require('./models/user.js');
mongoose.connect('mongodb://heroku_cpg3p7f2:2p2ueq3mvs8deqme1v3lqkg43j@ds163677.mlab.com:63677/heroku_cpg3p7f2');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router(); 

require('./routes.js')(router);
// middleware to use for all requests
router.use(function(req, res, next) {
	next(); //go to next thing
});

//define routes
app.use('/', router);

// Boot up server
app.listen(3000);