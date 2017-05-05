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
  	$.get('https://api.spotify.com/v1/artists/' + $(event.target).attr('data-spotify-id') + '/albums').then(function(data) {
		for(let x in data.items) {
			createAlbumInfoById(data.items[x].id);
		}
	});
}

function createAlbumInfoById(albumId) {
	$.get('https://api.spotify.com/v1/albums/' + albumId).then(function(albumData) {
		let albumInfoContainer = document.createElement("div");
		albumInfoContainer.className = "albumContainer";
		let albumTitle = document.createElement("h3");
		albumTitle.textContent = albumData.name;
		let albumImage = createImageFrame(albumData);
		let leftDiv = document.createElement("div");
		leftDiv.className = "albumContainerLeft";
		leftDiv.append(albumTitle);
		leftDiv.append(albumImage);
		albumInfoContainer.append(leftDiv);
		let albumYear = document.createElement('p');
		albumYear.textContent = albumData.release_date.split("-").reverse().join("-");
		let tracksList = createTracksList(albumData);
		let rightDiv = document.createElement("div");
		rightDiv.className = "albumContainerRight";
		rightDiv.appendChild(albumYear);
		rightDiv.appendChild(tracksList);
		albumInfoContainer.appendChild(rightDiv);
		if(isDuplicate(albumData) === false) {
			$('#albums-and-tracks').append(albumInfoContainer);
		}
	});
}

function createTracksList(album) {
	let tracksList = document.createElement("ol");
	for (var i = 0; i < album.tracks.items.length; i++) {
		let track = document.createElement("li");
		track.textContent = album.tracks.items[i].name;
		tracksList.appendChild(track);
	}
	return tracksList;
}
function createImageFrame(album) {
	let albumImage = document.createElement("iframe");
	albumImage.setAttribute('src', album.images[0].url);
	albumImage.setAttribute('width', album.images[0].width);
	albumImage.setAttribute('height', album.images[0].height);
	return albumImage;
}
function isDuplicate(album) {
	let albumDetailContainer = $("#albums-and-tracks").find('h3');
	for (var i = 0; i < albumDetailContainer.length; i++) {
		if(albumDetailContainer[i].innerHTML === album.name) {
			return true;
		}
	}
	return false;
}


/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
