var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

module.exports = function(passport) {

	//serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //SIGNUP
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

	        // find a user whose username is the same as the forms username
	        // we are checking to see if the user trying to login already exists
	        User.findOne({ 'username' :  username, 'room': req.params.room }, function(err, user) {
	            // if there are any errors, return the error
	            if (err)
	                return done(err);

	            // check to see if theres already a user with that email
	            if (user) {
	            	return done(null, false, console.log('user already exists in room '+req.params.room));
	            }else{
	            	var newUser = new User();
	            	// set the user's local credentials
	            	newUser.name 	 = req.body.name;
	            	newUser.lastname = req.body.lastname;
        			newUser.tags 	 = req.body.tags;
        			newUser.room 	 = req.params.room;
        			newUser.age		 = req.params.age;
	                newUser.username = username;
	                newUser.password = newUser.generateHash(password);

	                newUser.save(function(err) {
	                    if (err)
	                        throw err;
	                    return done(null, newUser);
	                });
	            }
	        });
    	});
    }));


    //LOGIN
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with username and password from our form

        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  username, 'room' : req.params.room }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, console.log(username+' no user found')); 

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, console.log("incorrect password")); 

            // all is well, return successful user
            return done(null, user);
        });

    }));
}