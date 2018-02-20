$(document).ready(function(){ 
	//store value when user updates category
	var changedCategory;
	//store value when user updates Notes
	var changedNotes;
	var updateObj;
	var id;
	var userSelect;
	//if the poster of a show changes update database poster url
	var changedPoster; 

  $("#logoutBtn2").on("click", handleLogout); 

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

	$("#allOption").on("click", handleAll)

	$('.collectionOption').on("click", categoryPopulator)

  function getEmail () {
    $.get("/api/user_data").then(function(data){
      console.log(data)
      var emailData = data.email; 
      userSelect = data.id; 
      $("#loginID2").html("<b>" + emailData + "</b>");
      allMoviePopulator()
    })
  }

  function handleLogout() {
    $.get("/logout").then(function() {
      window.location.href = "/";
      console.log("logging out")
    })
  }

  function handleAll() {
    $('.allView').css('display', 'block')
    $('#addTitle').css('display', 'none')
    $('.categoryView').css('display', 'none')
  }

	function categoryPopulator() {
    $(".view").empty();
    $('.allView').css('display', 'none')
    $('.categoryView').css('display', 'block')
		$('#addTitle').css('display', 'block')
	}

	function allMoviePopulator(){

    $('#addTitle').css('display', 'none')

    console.log(userSelect)

    var idUser = userSelect

	  $.ajax({
	      method: 'GET',
	      url: '/api/movies/' + idUser
	  }).done(function(data){
        console.log(data);

	      var allContainer = $('<div class="row"><div class= "col-xs-12"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title panelTitle">All Titles</h3></div><div class="panel-body content-wrapper allTitles"></div></div></div><div>')

	      //populate movies onto front end
	      for(var i = 0; i< data.length; i++){
	      		var futureDiv = $("<div>");
	      		futureDiv.addClass("futureDiv" +i);
	      		futureDiv.addClass("block");
	      		var imgDiv = $("<img src= " + data[i].poster + "alt= 'poster'>").addClass("blockImage");
	      		futureDiv.append(imgDiv);
	      		futureDiv.data("clickedData", data[i]);
	      		$('.allTitles').append(futureDiv)
	      		$('.viewAll').append(allContainer)
	      }
	  })
	}

  function handleMyMovie(){

  		$(".ajaxStyle").empty();

  		var clickedData = $(this).data("clickedData")
  		id = $(this).data("clickedData").imdb_id;

  		console.log(id);
  		console.log(typeof id);

  		console.log(clickedData)

  		//show the modal
  		$("#modelPersonalMovie").modal("show");
  		//show the movie title
  		$("#myMovieTitle").html(clickedData.title);

  		//display current notes on the movis
  		$(".notesBody").html(clickedData.notes);

  		//hiddien once user clicks edit
  		$("#editNotes").html(clickedData.notes);

  		if(clickedData.type == 'game') { 
        $(".movieAjax").css('display', 'none')
      } else {
      	$(".movieAjax").css('display', 'block')
      }

      if (clickedData.type == 'game') {
      	changedPoster = clickedData.poster 
  			return; 
  		}

  		console.log("didn't return")

      $.ajax({
          method: 'GET',
          url: "/movie/" + id
      }).done(function(data){
         console.log(data)

         if(data.actors) {
         	$(".actors").html("Actors: " + data.actors); 
         }
         if(data.awards) {
         	$(".awards").html("Awards: " + data.awards);
         }
         if(data.director) {
         	$(".director").html("Director: " + data.director);
         }
         if(data.genres) {
         	$(".genres").html("Genres: " + data.genres);
         }
         if(data.languages) {
         	$(".language").html("Languages: " + data.languages);
         }
         if(data.rated) {
         	$(".rated").html("Rated: " + data.rated);
         }
         if(data.rating) {
         	$(".rating").html("IMDb Rating: " + data.rating);
         }
         if(data.runtime) {
         	$(".runtime").html("Runtime: " + data.runtime);
         }
         if(data.writer) {
         	$(".writer").html("Writers: " + data.writer);
         }
         if(data.start_year) {
         	$(".yearMade").html("Start Year: " + data.start_year);
         }
         if(data.totalseasons) {
         	$(".seasons").html("Seasons: " + data.totalseasons);
         }
         if(data.plot) {
         	$(".plot").html("Plot: <br><br>" + data.plot);
         }

				changedPoster = data.poster; 

      }).fail(function(err){
      	console.log(err);
      })
  }

  function handleUpdate(){

    // if($("#changeCategory").val() == '') {
    //   changedCategory = currentCategory
    // } else {
    //   changedCategory = $("#changeCategory").val();
    // }

    changedCategory = $("#changeCategory").val();
  	changedNotes = $("#editNotes").val();

  	updateObj ={
  		category: changedCategory,
  		notes: changedNotes,
  		poster: changedPoster, 
  		imdb_id: id,
  		userID: userSelect
  	}

    $.ajax({
      method: "PUT",
      url: "/api/movies",
      data: updateObj
    })
    .done(function() {
      console.log("put worked")
     window.location.href = "/";
    });
  }

  function handleDelete(){

  	updateObj ={
  		imdb_id: id,
  		userID: userSelect
  	}

  	$.ajax({
      method: "DELETE",
      url: "/api/movies",
      data: updateObj
    })
    .done(function() {
      console.log("delete worked")
      window.location.href = "/";
    });
  }

  getEmail()

  // -------------------------------------------

});

