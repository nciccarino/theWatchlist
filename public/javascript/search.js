$(document).ready(function(){

	var searchContainer= $('.searchContainer');

	var searchBody = $('.panelBlock');

	var chosenContainer= $(".chosenContainer");

	var chosenTitle= $(".chosenTitle"); 

	var chosenCategory= $(".chosenCategory");

	var chosenNotes= $(".chosenNotes");

	var addArray= [];

	var currentPosition;

	var userSelect; 

	var searchMovie; 

	$.get("/api/user_data").then(function(data){
		userSelect = data.email; 
		$("#loginID2").html("<b>" + data.email + "</b>");
	})

	$('#addTitle').on("click", function() {
	   $('#modelWindow').modal('show');
	});

	//christians help--- callback for ajax search on a specified movie
	$("#searchTop").on("click", handleMovieFormSearch)

	//dynamically adding event listeners to dynamically created buttons
	$(document.body).on('click', 'button#add', handleAdd);

	//event listener for when user adds movie to the database
	$("#modalSubmit").on("click", handleSubmit);

	function movieSearch(){
		$.ajax({
			method: 'GET',
			url: '/imdb-search/' + searchMovie
		}).done(function(data){
			console.log("\nAJAX RESPONSE");
			console.log(data.results);

			var results = data.results; 
			searchContainer.empty();
			searchBody.empty(); 

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

				// $("#searchTest").append(searchContainer);
			}

			
		}); 
	} //end movieSearch 

	function handleAdd() {

		addArray=[];

	 	currentPosition = $(this)
			.parent()
			.data("results")		

		$(".searchContainer").hide(); 
		$(".chosenTitle").append("<b>Title: </b>");
		$(".chosenTitle").append("<br><b>" + currentPosition.title + "</b>");

		//DOM for category
		var newForm = $("<form>"); 
		var newFormClass = $("<div>").addClass("form-group");
		var label = $("<label for= 'category' >Select Catagory:</label>"); 
		var dropDown = $("<select class='form-control' id='category'>"); 
		var option = $("<option value=''></option></select>"); 

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
		var theType = currentPosition.type; 

		console.log("The category is : " + theCategory);

		addArray.push(thePoster, theTitle, theIMDBID, theCategory, theNotes, theType);
		
		//we don't need this array? We can pass in values from above into newMovie
		console.log("\nADDED COLUMN INFO TO ARRAY: AFTER USER CLICKS SUBMIT BUTTON")
		console.log(addArray);

		var newMovie = {
			title: addArray[1], 
			category: addArray[3],
			notes: addArray[4],
			imdb_id: addArray[2],
			poster: addArray[0],
			userID: userSelect,
			type: addArray[5]
		}; 

		console.log("\nNEW MOVIE OBJECT CREATED:")
		console.log(newMovie);

		// if (!addArray[3]) {
		// 	return; 
		// } else {
		// 	submitMovie(newMovie); 
		// } 
		submitMovie(newMovie)

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
			window.location.href = "/";

		})
	}//handle submitMovie

	//christians help
	function handleMovieFormSearch(event) {
		event.preventDefault();	

		// $("#searchTop").css('display', 'none')

		searchContainer.show()
		//show the panel body once user clicks search;
		searchMovie = $("#searchMovie").val().trim();
		movieSearch();

	}; //handleMovieFormSubmit

});