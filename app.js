import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import request from 'request';
import mongoose from 'mongoose';
import configDB from './config/database.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();

var User = require('./models/user.js');
mongoose.connect(configDB.url, function(err) {
    console.log(err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({ secret: 'weareathackkings' }));
app.use(passport.initialize());
app.use(passport.session());

//start passport
require('./config/passport.js')(passport);

//routes
var router = express.Router(); 
require('./routes.js')(app, passport);

//define routes
app.use('/', router);

// Boot up server
app.listen(3000);