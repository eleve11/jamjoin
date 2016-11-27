module.exports = function(router){
	router.get('/', function (req, res) {
        res.send('Hello World!')
    });

    router.route('/:room')
        //create a user (accessed at POST http://localhost:3000/api/users)
        .post(function(req, res) {
            var user = new User();
            // set the users details 
            user.username = req.body.username;
            user.name = req.body.name;
            user.lastname = req.body.lastname;
            user.tags = req.body.tags;
            user.room = req.params.room;
            user.bio = req.params.bio
            user.status = req.params.status;

            // save the user and check for errors
            user.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User '+user.name+' joined '+req.params.room });
            });
        })
        //get all users
        .get(function(req, res) {
            User.find({'room' : req.params.room}, function(err, users) {
                if (err)
                    res.send(err);

                res.json(users);
            });
        });

    //find user by id
    router.route('/:room/:user_id')

        // get the user with that id
        .get(function(req, res) {
            User.findOne({ 'username' :  req.params.user_id, 'room': req.params.room }, function(err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        })

        //update user
        .put(function(req, res) {
            User.findOne({ 'username' :  req.params.user_id, 'room': req.params.room }, function(err, user) {
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
                if(req.body.status)
                    user.status = req.body.status;

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

                res.json({ message: 'User left '+req.params.room });
            });
        });

    router.route('/:room/query')
    .post(function(req, res){
        var query = req.body.query;
        var room = req.params.room;
        resolveQuery(query, room, function(err, user){
                if (err)
                    res.send(err);
                res.json(user);    
            });
    })

    resolveQuery = function(query, room, func){
        //Separare Hastag da Nomi Ex: ("Banana Di Vizio #CAzzi #Gesù")
        var t = findTags(query);
        var names = findNames(query);
        if(t.length===0 || names.length===0){
            User.find({$and: [{'room': room}, 
                {$or: [ { 'tags': { $all: t } }, { 'name': {$in:names} }]}]}
                ,function(err, user){
                    func(err, user)
                });
        }else{
           User.find({$and: [{'room': room}, 
                {$and: [ { 'tags': { $all: t } }, { 'name': {$in:names} }]}]}
                ,function(err, user){
                    func(err, user)
                }); 
        }
    }

    findTags = function(query){
        var a = query.split(' ');
        var tags = [];
        for (var i = 0; i<a.length; i++) {
            if(a[i].startsWith('#')){
                tags.push(a[i]);
            }
        }
        return tags;
    }

    findNames = function(query){
        var a = query.split(' ');
        var names = [];
        for (var i = 0; i<a.length; i++) {
            if(a[i].startsWith('#')){
                continue;
            }
            names.push(a[i]);
        }
        return names;
    }


    router.route('/:room/tags')
    	//get users by tags
    	.get(function(req, res) {
            User.find({'room': req.params.room, 
            	'tags': {$all:req.query.t}},function(err, user){
            	if (err)
                    res.send(err);
                res.json(user);
            });
        });

    router.route('/:room/users')
        .get(function(req, res) {
            User.find({'room': req.params.room, 
                'tags': {$all:req.query.t}},function(err, user){
                if (err)
                    res.send(err);
                res.json(user);
            });
        });
}

var User = require('./models/user.js');
