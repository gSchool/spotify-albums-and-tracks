// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things
// like attach event listeners and any dom manipulation.
(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  })
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
      var spotifyQueryRequest;
      spotifyQueryString = $('#spotify-q').val();
      searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

      // Generate the request object
      spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
      });

      // Attach the callback for success
      // (We could have used the success callback directly)
      spotifyQueryRequest.done(function (data) {
        var artists = data.artists;

        // Clear the output area
        outputArea.html('');

        // The spotify API sends back an arrat 'items'
        // Which contains the first 20 matching elements.
        // In our case they are artists.
        artists.items.forEach(function(artist){
          var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
          artistLi.attr('data-spotify-id', artist.id);
          outputArea.append(artistLi);

          artistLi.click(displayAlbumsAndTracks);
        })
      });

      // Attach the callback for failure
      // (Again, we could have used the error callback direcetly)
      spotifyQueryRequest.fail(function (error) {
        console.log("Something Failed During Spotify Q Request:")
        console.log(error);
      });
  });
}

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
  var appendToMe = $('#albums-and-tracks');

  // These two lines can be deleted. They're mostly for show.
  console.log("you clicked on:");
  console.log($(event.target).attr('data-spotify-id'));//.attr('data-spotify-id'));

  //artist clicked
  var clicked = $(event.target);


  $.getJSON('https://api.spotify.com/v1/artists/' + $(event.target).attr('data-spotify-id') + '/albums').then(function(response) {

    var albums = response.items;
    console.log(response);
    console.log(albums);
    var ul = document.createElement('ul');
    clicked.append(ul);

    for (var i = 0; i < albums.length; i++) {
      var listItem = document.createElement('li');
      listItem.innerText = albums[i].name;
      listItem.style.textDecoration = 'none';
      ul.append(listItem);
    }

    // //track request
    // albums.forEach(function(album) {
    //   $.getJSON('https://api.spotify.com/v1/albums/' + album.id + '/tracks').then(function(response) {
    //
    //     var tracks = response.items;
    //     //console.log(tracks);
    //     for (var i = 0; i < tracks.length; i++) {
    //       console.log(tracks[i].name);
    //     }
    //
    //
    //
    //   });
    // });

  });
}

/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
