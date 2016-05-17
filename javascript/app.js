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
        artistLi.attr('data-spotify-name', artist.name);
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
  //console.log("you clicked on:");
  var artist = $(event.target).attr('data-spotify-name');//.attr('data-spotify-id'));
  var searchTerm = 'https://api.spotify.com/v1/search?q=album%3A*+artist%3A' + artist +'&type=album';

  var queryTermRequest = $.ajax({
    type: 'GET',
    dataType: 'json',
    url: searchTerm
  });

  queryTermRequest.done(function(information) {

    //console.log(information.albums.items);

    var album = information.albums.items;
    album.forEach(function (info) {

      var albumName = document.createElement('li');
      albumName.innerHTML = info.name;
      albumName.id = info.name;
      appendToMe.append(albumName);

      var moreQuert = $.ajax({
        type: 'GET',
        dataType: 'json',
        url: info.href
      });

      moreQuert.done(function(aInfo) {

        //console.log(aInfo.tracks.items);

        var parentList = document.getElementById(info.name);

        var subList = document.createElement('ul');

        var custom = aInfo.tracks.items;
        parentList.innerHTML += ' Released On:  ' + aInfo.release_date + ', Popularity of ' + aInfo.popularity;

        custom.forEach(function(func) {

          var trackItem = document.createElement('li');
          trackItem.innerHTML = func.name;

          subList.appendChild(trackItem);
        });

        parentList.appendChild(subList);
      });
    });
  });
}

/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
