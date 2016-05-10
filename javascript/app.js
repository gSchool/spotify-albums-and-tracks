// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things
// like attach event listeners and any dom manipulation.
(function() {
  $(document).ready(function() {
    bootstrapSpotifySearch();
  });
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch() {

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function() {
    var spotifyQueryRequest;
    spotifyQueryString = $('#spotify-q').val();
    searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" +
      spotifyQueryString;

    // Generate the request object
    spotifyQueryRequest = $.ajax({
      type: "GET",
      dataType: 'json',
      url: searchUrl
    });

    // Attach the callback for success
    // (We could have used the success callback directly)
    spotifyQueryRequest.done(function(data) {
      var artists = data.artists;

      // Clear the output area
      outputArea.html('');

      // The spotify API sends back an arrat 'items'
      // Which contains the first 20 matching elements.
      // In our case they are artists.
      artists.items.forEach(function(artist) {
        var artistLi = $("<li>" + artist.name + " - " + artist.id +
          "</li>");
        artistLi.attr('data-spotify-id', artist.id);
        outputArea.append(artistLi);

        artistLi.click(displayAlbumsAndTracks);
      });
    });

    // Attach the callback for failure
    // (Again, we could have used the error callback direcetly)
    spotifyQueryRequest.fail(function(error) {
      console.log("Something Failed During Spotify Q Request:");
      console.log(error);
    });
  });
}

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
  var appendToMe = $('#albums-and-tracks');
  // These two lines can be deleted. They're mostly for show.
  console.log("you clicked on:");
  artistId = ($(event.target).attr('data-spotify-id')); //.attr('data-spotify-id'));
  console.log(artistId);
  var getAlbums = $.ajax({
    type: "GET",
    dataType: 'json',
    url: "https://api.spotify.com/v1/artists/" + artistId + "/albums",
  }); // end of getAlbums ajax request
  // Attach the callback for success
  // (We could have used the success callback directly)
  getAlbums.done(function(data) {
    var dateOfAlbum;
    var albums = data.items;
    // Clear the output area
    appendToMe.html('');
    // The spotify API sends back an arrat 'items'
    // Which contains the first 20 matching elements.
    // In our case they are artists.
    albums.forEach(function(album) {
      var albumId = album.id;
      var getReleaseDate = $.ajax({
        type: "GET",
        dataType: 'json',
        url: "https://api.spotify.com/v1/albums/" + albumId,
      }); // end of getReleaseDate ajax request

      getReleaseDate.done(function(data3) {
        dateOfAlbum = data3.release_date;

        var albumsLi = $("<li><img alt='artist image' src='" +

          album.images[2].url + "'> " + album.name + " (" +
          dateOfAlbum + ")</li>");

        var getTracks = $.ajax({

          type: "GET",
          dataType: 'json',
          url: "https://api.spotify.com/v1/albums/" + albumId +
            "/tracks",
        }); // end of getAlbums ajax request

        getTracks.done(function(data2) {

          var tracks = data2.items;

          albumsLi.attr('data-spotify-albums', album.id);
          appendToMe.append(albumsLi);
          tracks.forEach(function(track) {

            var trackName = track.name;
            // var trackId = track.id;

            var tracksLi = $("<ul>" + trackName + "</ul>");
            tracksLi.attr('data-spotify-tracks', track.id);
            appendToMe.append(tracksLi);
          }); // end of albums.forEach
        }); // end of getTracks function
      }); // end of getReleaseDate
    }); // end of
  });
  // Attach the callback for failure
  // (Again, we could have used the error callback direcetly)
  getAlbums.fail(function(error) {
    console.log("Something Failed During Spotify Q Request:");
    console.log(error);
  });
}
/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
