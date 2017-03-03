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
  appendToMe.empty();
  var currentId = $(event.target).attr('data-spotify-id');
  var albumByArtistUrl = `https://api.spotify.com/v1/artists/${currentId}/albums`;

  var albumByArtist = $.ajax({
        type: "GET",
        dataType: 'json',
        url: albumByArtistUrl
    });

  albumByArtist.done(function(data) {
    var albums = data.items;
    albums.forEach(function(album){
      var currentAlbum = album.name;
      var currentId = album.id;
      var getAlbumUrl = `https://api.spotify.com/v1/albums/${currentId}`;
      var songRequest = $.ajax({
        type: "GET",
        dataType: 'json',
        url: getAlbumUrl
      });

      songRequest.done(function(data) {
        var releaseDate = data.release_date;
        var tracks = data.tracks.items;
        var albumElement = `<ul album-id=${currentId}>${currentAlbum}: ${releaseDate}</ul>`;

        appendToMe.append(albumElement);
        tracks.forEach(function(track) {
          var currentTrack = track.name;
          var trackElement = $(`<li>${currentTrack}</li>`);
          $(`ul[album-id=${currentId}]`).append(trackElement);
        });
      })
    })
  });
};

/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
