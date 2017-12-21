$(document).ready(function() {

  $.get("/api/user_data").then(function(data) {
    $("#loginID").html("<h4> Logged in as <b>" + data.email + "</b></h4>").addClass("loggedInID");
  });

  $("#logoutBtn").on("click", handleLogout); 

  function handleLogout() {
  	$.get("/logout").then(function() {
  		window.location.href = "/";
  		console.log("logging out")
  	})
  }

}); //end doc
