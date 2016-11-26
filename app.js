import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import request from 'request';
import mongoose from 'mongoose';

const app = express();

var User = require('./models/user.js');
mongoose.connect('mongodb://heroku_cpg3p7f2:2p2ueq3mvs8deqme1v3lqkg43j@ds163677.mlab.com:63677/heroku_cpg3p7f2');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router(); 

// middleware to use for all requests
router.use(function(req, res, next) {
	next(); //go to next thing
});

router.get('/', function (req, res) {
  res.send('Hello World!')
});

router.route('/users')
	//create a user (accessed at POST http://localhost:3000/api/users)
    .post(function(req, res) {
        
        var user = new User();      // create a new instance of the User model
   		// set the users details 
        user.name = req.body.name;
        user.lastname = req.body.lastname;
        user.tags = req.body.tags;

        // save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User '+user.name+' created!' });
    	});
    })

    //get all users
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });

//find user by id
router.route('/users/:user_id')

    // get the user with that id
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })

    //update user
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
    
    		if(req.body.name)
	        	user.name = req.body.name;
	        if(req.body.lastname)
	        	user.lastname = req.body.lastname;
	        if(req.body.tags)
	        	user.tags = req.body.tags;

            // save the user
            user.save(function(err) {
                if (err)
                    res.send(err);

            res.json(user);
        	});
    	})
    })


    //user exits room
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'User left the room.' });
        });
    });


router.route('/tags')
	//get users by tags
	.get(function(req, res) {

        User.find({'tags' : req.query.t},function(err, user){
        	if (err)
                res.send(err);
            res.json(user);
        });
    });





//define routes
app.use('/', router);

// Boot up server
app.listen(3000);