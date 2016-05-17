(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  })
})();

function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
    var spotifyQueryRequest;
    spotifyQueryString = $('#spotify-q').val();
    searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

    spotifyQueryRequest = $.ajax({
      type: "GET",
      dataType: 'json',
      url: searchUrl
    });

    spotifyQueryRequest.done(function (data) {
      var artists = data.artists;

      outputArea.html('');

      artists.items.forEach(function(artist){
        var artistLi = $("<li>" + artist.name + " - " + artist.id + "</li>")
        artistLi.attr('data-spotify-name', artist.name);
        outputArea.append(artistLi);

        artistLi.click(displayAlbumsAndTracks);
      })
    });

    spotifyQueryRequest.fail(function (error) {
      console.log("Something Failed During Spotify Q Request:")
      console.log(error);
    });
  });
}

function displayAlbumsAndTracks(event) {
  var appendToMe = $('#albums-and-tracks');
  appendToMe.empty();

  var artist = $(event.target).attr('data-spotify-name');
  var searchTerm = 'https://api.spotify.com/v1/search?q=album%3A*+artist%3A' + artist +'&type=album';

  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: searchTerm
  }).done(function(information) {

    var album = information.albums.items;
    album.forEach(function (info) {

      var albumName = document.createElement('p');
      albumName.innerHTML = info.name;
      albumName.id = info.name;
      appendToMe.append(albumName);

      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: info.href
      }).done(function(aInfo) {

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
