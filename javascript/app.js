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
  var simplifiedData = {};

  // Get all the albums
  getAllAlbums($(event.target).attr('data-spotify-id'))
  
  // Then fetch the data for the individual albums
  .then(function(allAlbumData) {
    var albumAndTrackPromises = [];

    // For each album, we need to fetch the release date
    // as well as the tracks
    for(var i = 0; i < allAlbumData.items.length; i++) {
      
      // Two bits of critical information
      var albumId = allAlbumData.items[i].id;
      var albumName = allAlbumData.items[i].name;

      // Setup the inner storage object for this album
      simplifiedData[allAlbumData.items[i].name] = {};

      // Handle the album info
      var albumPromise = getAlbumInfo(albumId);
      albumPromise.then(function(albumData) {
        simplifiedData[albumData.name]['releaseDate'] = albumData.release_date;
      });

      // Handle the tracks
      var trackPromise = getAllTracks(albumId);

      //WIZARDRY
      // JK, this trick allows us to not use the closed
      // over value of albumName. It's trippy though eh?
      var trackCallback = function(albumName) {
        return function(tracksData) {
          // Map the tracks to be just the track names
          trackNames = tracksData.items.map(function(track) {
            return track.name;
          });

          // store the list of tracks
          simplifiedData[albumName]['tracks'] = trackNames;
          return trackNames;
        };
      };

      // trackCallback gets the function RETURNED from 
      // the function above.
      trackPromise.then(trackCallback(albumName));
      albumAndTrackPromises.push(albumPromise);
      albumAndTrackPromises.push(trackPromise);
    }

    return $.when.apply($, albumAndTrackPromises);
  })
  // when all the albums have data
  // We'll already have the tracks
  .done(function() {
    var appendToMe = $('#albums-and-tracks');
    
    for(albumName in simplifiedData) {
      var albumDiv = appendToMe.append('<div>');
      
      albumDiv.append('<h2>' + albumName + '</h2>')
        .append('<p>' + simplifiedData[albumName].releaseDate + '</p>')
        .append('<ul>');

        for(var i = 0; i < simplifiedData[albumName].tracks.length; i++) {
          var trackName = simplifiedData[albumName].tracks[i];
          albumDiv.append('<li>' + trackName + '</li>');
        }
    }
  });
}

/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
function getAllAlbums(artistId) {
  var searchUrl = 'https://api.spotify.com/v1/artists/' + artistId + '/albums';
  var allAlbumsPromise = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
    });

  return allAlbumsPromise;
}

function getAlbumInfo(albumId) {
  var searchUrl = 'https://api.spotify.com/v1/albums/' + albumId;
  var albumPromise = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
    });

  return albumPromise;
}

function getAllTracks(albumId) {
  var searchUrl = 'https://api.spotify.com/v1/albums/' + albumId + '/tracks';
  var allTrackssPromise = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
    });

  return allTrackssPromise;
}

