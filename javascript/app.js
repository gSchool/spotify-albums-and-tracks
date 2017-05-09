// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things
// like attach event listeners and any dom manipulation.
(function() {
    $(document).ready(function() {
        bootstrapSpotifySearch();
    })
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

            // Clear the output area
            outputArea.html('');

            // The spotify API sends back an arrat 'items'
            // Which contains the first 20 matching elements.
            // In our case they are artists.
            artists.items.forEach(function(artist) {
                var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
                artistLi.attr('data-spotify-id', artist.id);
                outputArea.append(artistLi);

                artistLi.click(displayAlbumsAndTracks)
            })
        });

        // Attach the callback for failure
        // (Again, we could have used the error callback direcetly)
        spotifyQueryRequest.fail(function(error) {
            console.log("Something Failed During Spotify Q Request:")
            console.log(error);
        });
    });
    $('body').keypress(function(e) {
        if (e.which == 13) {
            $('#spotify-q-button').click()
        }
    })
}

/* COMPLETE THIS FUNCTION! */
function displayAlbumsAndTracks(event) {
    let albumsReq = 'https://api.spotify.com/v1/artists/' + $(event.target).attr('data-spotify-id') + '/albums'
    let artistObj
    let albumIds = []
    let tracklist = []
    
    $.get(albumsReq).then(function(data) {
        $('#albumInfo').empty()
        artistObj = data
        $('#artist').text(artistObj.items[0].artists[0].name)
        numberAlbums = artistObj.items.length
        $.each(artistObj.items, function(i, album) {
            albumIds.push(album.id)
            console.log(album)
            getTrax(albumIds[i]).then(function(albumsss) {
                tracklist = albumsss.items
                let albumList = $('<ul class="indAlbumTrackList">' + album.name + '</ul>')
                $('#albumInfo').append(albumList)
                console.log(' ')
                console.log('ALBUM: ', album.name)
                console.log(tracklist)
                if(tracklist.length >= 1){
                    $.each(tracklist, function(track){
                        let trackTitle = tracklist[track].name
                        console.log(track, trackTitle)
                        albumList.append($('<li>"'+trackTitle+'"</li>'))
                    })
                }
            })
        })
    })
    function getTrax(album) {
        return $.get('https://api.spotify.com/v1/albums/' + album + '/tracks')
    }
}
