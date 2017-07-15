$(document).ready(function(){

	var searchContainer= $('.searchContainer');

	var searchBody = $('.panelBlock');

	var futureContainer=  $('.futureBody');

	var currentContainer=  $('.currentBody');

	var finishedContainer=  $('.finishedBody');

	var notCaughtUpContainer = $(".notCaughtUpBody"); 

	var caughtUpContainer = $(".caughtUpBody"); 

	var chosenContainer= $(".chosenContainer");

	var chosenTitle= $(".chosenTitle"); 

	var chosenCategory= $(".chosenCategory");

	var chosenNotes= $(".chosenNotes");

	var currentPosition;

	var addArray= [];

	//store value when user updates category
	var changedCategory;
	//store value when user updates Notes
	var changedNotes;
	var updateObj;
	var id;

	//if the poster of a show changes update database poster url
	var changedPoster; 

	$('#addMovie').on("click", function() {
	   $('#modelWindow').modal('show');
	});

	//christians help--- callback for ajax search on a specified movie
	$("#searchTop").on("click", handleMovieFormSearch); 

	//dynamically adding event listeners to dynamically created buttons
	$(document.body).on('click', 'button#add', handleAdd);

	//event listener for when user adds movie to the database
	$("#modalSubmit").on("click", handleSubmit);

	//event listen when the user clicks on a movie displayed on front end
	$(document.body).on("click", '.block', handleMyMovie);

	//show the form when the user clicks the edit button
	$(".buttonEdit").on("click", function(){
		event.preventDefault();
		$("#personalMovie-form").toggle();
		console.log("edit button");

		$(".movieAjax").toggle();
	});

	$("#updateAll").on("click", handleUpdate);

	$("#deleteMovieBtn").on("click", handleDelete);

	//run as soon as the page loads. this populates sections with movie form Database
	moviePopulator(); 


	//ajax request to pull data from the database/server
	//Then calls function to populate it on the page
	function moviePopulator(){
	  $.ajax({
	      method: 'GET',
	      url: '/api/movies'
	  }).done(function(data){
	  		console.log("\nData from the server using moviePopulator() [pulling from our API]");
	      console.log(data);

	      $(".futureBody").empty();
	      //populate movies onto front end
	      for(var i = 0; i< data.length; i++){
	 
	      		var futureDiv = $("<div>");
	      		futureDiv.addClass("futureDiv" +i);
	      		futureDiv.addClass("block");
	      		var titleDiv = $("<h4>" + data[i].title + "</h4>");
	      		var imgDiv = $("<img src= " + data[i].poster + "alt= 'poster' height= '300px' width= '200px'>");
	      		futureDiv.append(titleDiv);
	      		futureDiv.append(imgDiv);

	      		futureDiv.data("clickedData", data[i]);

	      		// console.log(data[i].imdb_id)	
	      		// console.log($('.futureDiv'+i).data('clickedData').imdb_id);

	      	// }//end first if
	      	if(data[i].category =="futureSeries"){
	      		//populate into future section using .html
	      		futureContainer.append(futureDiv);

	      	}
	      	else if(data[i].category=="currentSeries"){
	      		//populate into current section .html
	      		currentContainer.append(futureDiv);

	      	}
	      	else if(data[i].category=="finishedSeries"){
	      		//populate onto the watched section .html
	      		finishedContainer.append(futureDiv);
	      	}
	      	else if(data[i].category=="notCaughtUpSeries") {
	      		notCaughtUpContainer.append(futureDiv);
	      	}
	      	else if(data[i].category=="caughtUpSeries") {
	      		caughtUpContainer.append(futureDiv);
	      	}
	      }
	  })
	}

  function handleMyMovie(){
  		var clickedData = $(this).data("clickedData")
  		id = $(this).data("clickedData").imdb_id;

  		console.log(id);
  		console.log(typeof id);

  		//show the modal
  		$("#modelPersonalMovie").modal("show");
  		//show the movie title
  		$("#myMovieTitle").html(clickedData.title);

  		//display current notes on the movis
  		$(".notesBody").html(clickedData.notes);

  		//hiddien once user clicks edit
  		$("#editNotes").html(clickedData.notes);

      $.ajax({
          method: 'GET',
          url: "/movie/" + id
      }).done(function(data){
         console.log(data);

				$(".actors").html("Actors: " + data.actors); 
				$(".awards").html("Awards: " + data.awards);
				$(".director").html("Director: " + data.director);
				$(".genres").html("Genres: " + data.genres);
				$(".language").html("Languages: " + data.languages);
				$(".rated").html("Rated: " + data.rated);
				$(".rating").html("IMDb Rating: " + data.rating);
				$(".runtime").html("Runtime: " + data.runtime);
				$(".writer").html("Writers: " + data.writer);
				$(".yearMade").html("Start Year: " + data.start_year);
				$(".seasons").html("Seasons: " + data.totalseasons); 
				$(".plot").html("Plot: <br><br>" + data.plot);

				changedPoster = data.poster; 

      }).fail(function(err){
      	console.log(err);
      })
  }

  function handleUpdate(){

  	changedCategory = $("#changeCategory").val();
  	changedNotes = $("#editNotes").val();

  	updateObj ={
  		category: changedCategory,
  		notes: changedNotes,
  		poster: changedPoster, 
  		imdb_id: id
  	}

  	console.log("RIGHT BEFORE THE ROUTE")

    $.ajax({
      method: "PUT",
      url: "/api/movies",
      data: updateObj
    })
    .done(function() {
      console.log("put worked")
     window.location.href = "/series";
    });
  }

  function handleDelete(){

  	updateObj ={
  		imdb_id: id
  	}

  	
  	$.ajax({
      method: "DELETE",
      url: "/api/movies",
      data: updateObj
    })
    .done(function() {
      console.log("delete worked")
      window.location.href = "/series";
    });


  }
  

	function movieSearch(searchMovie){
		$.ajax({
			method: 'GET',
			url: '/imdb-search/' + searchMovie
		}).done(function(data){

			console.log("\nAJAX RESPONSE");
			console.log(data.results);

			var results = data.results; 
			searchContainer.empty(); 

			for (var i = 0; i < results.length; i++) {
				// topSearch.push(createSearchContainer(results[i])); 

				var newSearchbody = $("<div>");
				newSearchbody.addClass("searchBlock"); 

				var newClass = newSearchbody.addClass("newclass" + i);

				var newImg = $("<img src = " + results[i].poster + " alt= 'poster' height= '300px' width= '200px'>");
				newSearchbody.append(newImg); 

				var newTitle = $("<div class= titleText><h4>"); 
				newTitle.text(results[i].title); 
				newSearchbody.append(newTitle); 

				var newYear = $("<p>"); 
				newYear.text(results[i].year); 
				newSearchbody.append(newYear);  

				var addBtn = $("<button>").addClass("btn btn-success"); 
				addBtn.text("Add"); 
				addBtn.attr("id", "add"); 
				newSearchbody.append(addBtn); 

				newSearchbody.data('results', results[i]);

				// console.log($('.newClass1').data('results'));

				searchBody.append(newSearchbody);

				searchContainer.append(searchBody);

				$("#searchTest").append(searchContainer);
			}

			
		}); 
	} //end movieSearch 


	function handleAdd() {
		// event.preventDefault(); 
		//reset the array for hold the movie object
		addArray=[];

		//button
		// console.log($(this));
		//shows that the button is type of object
		// console.log(typeof $(this))

		//target the selected div where the movie is stored. 'this' refers to the add button (which is an object!)
		//** 'this' always refers to the value of an object	(invoking object) **
	 	currentPosition = $(this)
			.parent()
			.data("results")		

		console.log("\nCURRENT MOVIE/ MOVIE THAT USER ADDED");
		console.log(currentPosition);

		// //select data-result 
		// var getBackMyJSON = $('.newclass1').data('results').title;
		// console.log(getBackMyJSON);

		$(".searchContainer").hide(); 
		$(".chosenTitle").append("<b>Title: </b>");
		$(".chosenTitle").append("<br><b>" + currentPosition.title + "</b>");

		//DOM for category
		var newForm = $("<form>"); 
		var newFormClass = $("<div>").addClass("form-group");
		var label = $("<label for= 'category' >Select Catagory:</label>"); 
		var dropDown = $("<select class='form-control' id='category'>"); 
		var option = $("<option value='futureSeries'>What to Watch</option><option value='currentSeries'>Currently Watching</option><option value='notCaughtUpSeries'>Not Caught Up</option><option value='caughtUpSeries'>Caught Up</option><option value='finishedSeries'>Finished Watching</option></select>"); 

		dropDown.append(option); 
		label.append(dropDown); 
		newFormClass.append(label); 
		newForm.append(newFormClass); 
		chosenCategory.append(newForm); 

		//DOM for notes
		var newFormClass2 = $("<div>").addClass("form-group");
		var label2 = $("<label for= 'notes' >Notes:</label>"); 
		var textarea = $("<textarea rows='4' id='notes'></textarea>").addClass("form-control"); 

		label2.append(textarea); 
		newFormClass2.append(label2); 
		chosenNotes.append(newFormClass2); 

		$("#firstModalFooter").css("display", "block"); 

	} // handleAdd


	function handleSubmit(event) {
		event.preventDefault(); 

		//the 'this' points to the submit button since it is an object---we turned the submit button into a jquery object
		// console.log($(this));

		//getting info for columns 
		var thePoster = currentPosition.poster;
		var theTitle = currentPosition.title;
		var theIMDBID = currentPosition.imdbid;
		var theCategory = $("#category option:selected").val(); 
		var theNotes = $("#notes").val(); 

		console.log("The category is : " + theCategory);

		addArray.push(thePoster, theTitle, theIMDBID, theCategory, theNotes);
		
		//we don't need this array? We can pass in values from above into newMovie
		console.log("\nADDED COLUMN INFO TO ARRAY: AFTER USER CLICKS SUBMIT BUTTON")
		console.log(addArray);

		var newMovie = {
			title: addArray[1], 
			category: addArray[3],
			notes: addArray[4],
			imdb_id: addArray[2],
			poster: addArray[0]
		}; 

		console.log("\nNEW MOVIE OBJECT CREATED:")
		console.log(newMovie);

		if (!addArray[3]) {
			return; 
		} else {
			submitMovie(newMovie); 
		} 

	} // handleSubmit 


	function submitMovie(Movie) {
		console.log("before ajax post");
		$.ajax({
			type: 'POST',
			url:'/api/movies',
			data: Movie
		}).done(function(){
			console.log("posted data");	

			//redirects us back to the movies html
			window.location.href = "/series";

		})
	}//handle submitMovie

	//christians help
	function handleMovieFormSearch(event) {
		event.preventDefault();	

		searchContainer.show()
		//show the panel body once user clicks search;
		var searchMovie = $("#searchMovie").val().trim();
		movieSearch(searchMovie);
	}; //handleMovieFormSubmit

});

