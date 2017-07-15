var imdb = require("imdb-api");

module.exports= function(app){

	app.get('/imdb-search/:movie', function(req, res){

		imdb.search({
		  	title: req.params.movie
		}, {
		  apiKey: '40e9cece'
		}).then(function(data) {
			res.json(data);
		}).catch(function(err) {
			console.log(err);
		});
	});

	 app.get('/movie/:id', function(req, res){
	 	// console.log(String(req.params.id));

	 	// console.log(typeof req.params.id);
	 	// var string= "slfns";
	 	// console.log(typeof string)

	    imdb.getById(
	       req.params.id,
	       {
	       	apiKey: '40e9cece'
	       	// timeout: 30
	       }).then(function(data) {
	        res.send(data);
	    })
	})
}


