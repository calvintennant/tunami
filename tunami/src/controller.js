var tunami = tunami || {};

tunami.controller = function($scope) {
  var audio = _.first(document.getElementsByTagName('audio'));
  $scope.songs = [];
  $scope.playing = {};
  $scope.addZip = function() {
    event.target.addEventListener('change', function() {
      var files = this.files;
      tunami.utility.unpackSongsFromZip(files[0], function(song) {
        $scope.songs.push(song);
        $scope.$apply();
      });
      this.removeEventListener('change', arguments.callee.caller);
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

    song.play(audio, element, _.throttle(function(progress) {
      $scope.progress = progress;
      $scope.$apply();
    }, 250), function() { return song === $scope.playing });

    $scope.playing = song;
  }
}

