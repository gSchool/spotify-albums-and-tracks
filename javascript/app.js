// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things
// like attach event listeners and any dom manipulation.
(function() {
    $(document)
        .ready(function() {
            bootstrapSpotifySearch();
        });
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch() {

    var userInput, searchUrl, results;
    var outputArea = $("#q-results");

    $('#spotify-q-button')
        .on("click", function() {
            var spotifyQueryRequest;
            spotifyQueryString = $('#spotify-q')
                .val();
            searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

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
                // console.log(data);

                // Clear the output area
                outputArea.html('');

                // The spotify API sends back an arrat 'items'
                // Which contains the first 20 matching elements.
                // In our case they are artists.
                artists.items.forEach(function(artist) {
                    var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
                    artistLi.attr('data-spotify-id', artist.id);
                    outputArea.append(artistLi);

                    artistLi.click(displayAlbumsAndTracks);

                })
            });

            // Attach the callback for failure
            // (Again, we could have used the error callback direcetly)
            spotifyQueryRequest.fail(function(error) {
                console.log("Something Failed During Spotify Q Request:")
                console.log(error);
            });
        });
}

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
    var appendToMe = $('#albums-and-tracks');
    var artistId = $(event.target)
        .attr('data-spotify-id');

    //     GETS ARTIST'S ALBUMS
    $.ajax(`https:api.spotify.com/v1/artists/${artistId}/albums`)
        .done((data) => {
            let albums = data.items
            let newList = $('<ul>');
            $('#albums-and-tracks')
                .append(newList);
            let albumList = $('ul');
            albums.forEach((element) => {
                let album = element.name;
                let albumId = element.id;
                let newAlbum = $(`<ul>${album}</ul>`);
                albumList.append(newAlbum);

                //  GETS ALBUM'S TRACKS
                $.ajax(`https://api.spotify.com/v1/albums/${albumId}/tracks`)
                    .done((data) => {
                        let tracks = data.items;
                        tracks.forEach((track) => {
                            let trackName = track.name;
                            let newTrack = $(`<li>${trackName}</li>`);
                            newAlbum.append(newTrack);
                        });
                    });
            });

        });

}

/* YOU MAY WANT TO CREATE HELPER FUNCTIONS OF YOUR OWN */
/* THEN CALL THEM OR REFERENCE THEM FROM displayAlbumsAndTracks */
/* THATS PERFECTLY FINE, CREATE AS MANY AS YOU'D LIKE */
