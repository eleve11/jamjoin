module.exports = function(router,passport){
	router.get('/', function (req, res) {
  res.send('Hello World!')
});

router.route('/:room/users')
    //get all users
    .get(isLoggedIn, function(req, res) {
        User.find({'room' : req.params.room},function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });

//find user by id
router.route('/:room/users/:user_id')

    // get the user with that id
    .get(isLoggedIn,function(req, res) {
        User.findOne({ 'username' :  username, 'room': req.params.room }, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })

    //update user
    .put(isLoggedIn,function(req, res) {
        User.findOne({ 'username' :  username, 'room': req.params.room }, function(err, user) {
            if (err)
                res.send(err);
    
    		//update
    		if(req.body.name)
	        	user.name = req.body.name;
	        if(req.body.lastname)
	        	user.lastname = req.body.lastname;
	        if(req.body.tags)
	        	user.tags = req.body.tags;
	        if(req.body.age)
	        	user.age = req.body.age;

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
            username: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'User left '+req.params.room });
        });
        req.logout();
    });

router.route('/:room/tags')
	//get users by tags
	.get(isLoggedIn,function(req, res) {
        User.find({'room': req.params.room, 
        	'tags': {$all:req.query.t}},function(err, user){
        	if (err)
                res.send(err);
            res.json(user);
        });
    });

router.post('/:room/signup', 
	passport.authenticate('local-signup', {}));

router.post('/:room/login', 
	passport.authenticate('local-login', function(req, res) {
    // If this function gets called, authentication was successful.
    res.redirect('/'+req.params.room+'/users/');
  }));
}
	
var User = require('./models/user.js');

function isLoggedIn(req,res, next){
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}