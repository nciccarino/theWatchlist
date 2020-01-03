var imdb = require("imdb-api");

module.exports= function(app){

	app.get('/imdb-search/:movie', function(req, res){

		imdb.search({
		  	title: req.params.movie
		}, {
		  // apiKey: '40e9cece'
		  apiKey: '5116873b'
		}).then(function(data) {
			res.json(data);
		}).catch(function(err) {
			console.log(err);
		});
	});

	 app.get('/movie/:id', function(req, res){

	    imdb.getById(
	       req.params.id,
	       {
	       	//apiKey: '40e9cece'
	       	apiKey: '5116873b'
	       	// timeout: 30
	       }).then(function(data) {
	        res.send(data);
	    })
	})
}


