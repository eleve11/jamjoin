import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import request from 'request';
import mongoose from 'mongoose';

const app = express();

var User = require('./models/user.js');
//mongoose.connect(DB URI here);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router(); 

// middleware to use for all requests
router.use(function(req, res, next) {
	next(); //go to next thing
});

router.get('/', function (req, res) {
  res.send('Hello World!')
})

//define routes
app.use('/api', router);

// Boot up server
app.listen(3000);