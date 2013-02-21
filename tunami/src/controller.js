var tunami = tunami || {};

tunami.controller = function($scope) {
  var audio = _.first(document.getElementsByTagName('audio'));
  $scope.songs = [];
  $scope.playing = {};
  $scope.addSong = function() {
    var ChooseEntryOptions = {
      type: 'openFile',
      accepts: [{
        extensions: tunami.utility.extensions
      }]
    };
    chrome.fileSystem.chooseEntry(ChooseEntryOptions, function(file) {
      tunami.utility.getFileAsDataURL(file, function(url) {
        var extension = tunami.utility.getExtensionFromFileName(file.name);
        var song = new tunami.Song(file.name, url, extension);
        $scope.songs.push(song);
        $scope.$apply();
      });
    });
  }
  $scope.addZip = function() {
    var ChooseEntryOptions = {
      type: 'openFile',
      accepts: [{
        extensions: ['zip']
      }]
    };
    chrome.fileSystem.chooseEntry(ChooseEntryOptions, function(file) {
      tunami.utility.unpackSongsFromZip(file, function(songs) {
        $scope.songs = _.union($scope.songs, songs);
        $scope.$apply();
      });
    });
  }
  $scope.removeSong = function(song) {
    $scope.songs = _.reject($scope.songs, function(value) {
      return value === song;
    });

    // If the song we removed is currently playing, reset the active song.
    if ($scope.playing === song) $scope.setActiveSong();
  }
  $scope.setActiveSong = function(song) {
    var element = document.createElement('source');

    // Stop any audio from playing, and remove all sources.
    audio.pause();
    audio.innerHTML = '';

    if (!song) return;
    element.type = song.source.type;
    element.src = song.source.src;

    // Add our source, start playing, and create a reference in $scope.
    audio.appendChild(element);
    audio.play();
    $scope.playing = song;
  }
}

