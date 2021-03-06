//Requiring models directory, our passport configuration, and imdb-api package
var db = require('../models');
var passport = require("../config/passport");
var imdb = require('imdb-api');

module.exports= function(app){

//PASSPORT ROUTES

 // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/members");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {

      console.log("ERROR: " + err)
      // res.status(422).json(err.errors[0].message);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

	//route to handle imdb get movie request
	app.get('/api/movies/:id', function(req, res){
		console.log(db.Movie)
		db.Movie.findAll({
        where: {
          userID: req.params.id
        }
      }).then(function(data){
			console.log(data);
			res.json(data);
		})
	});

	app.post("/api/movies", function(req, res) {
		console.log(req.body);

		db.Movie.create({
			title: req.body.title,
			category: req.body.category,
			notes: req.body.notes,
			imdb_id: req.body.imdb_id,
			poster: req.body.poster,
      userID: req.body.userID,
      type: req.body.type
			
		}).then(function(data) {
			res.json(data);
		}).catch(function(err){
			console.log(err);
		});
	}); 

	app.put("/api/movies", function(req, res){

    db.Movie.update({
    	category: req.body.category,
    	notes: req.body.notes,
    	poster: req.body.poster
    },

        {
            where: {
                imdb_id: req.body.imdb_id,
                userID: req.body.userID
            }

        }).then(function(data){
            res.json(data);
       	})
	});

	app.delete("/api/movies", function(req, res) {
		db.Movie.destroy({
			where: {
				imdb_id: req.body.imdb_id,
        userID: req.body.userID
			}
		}).then(function(data) {
			res.json(data); 
		});
	});
}//end module.exports