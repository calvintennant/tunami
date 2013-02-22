var tunami = tunami || {};

tunami.Song = Class.extend({
  init: function(name, entry, extension) {
    if (tunami.utility.extensions.indexOf(extension) == -1) {
      throw new Error('Unacceptable extension');
    }
    this.name = name;
    this.entry = entry;
    this.type = tunami.utility.getMimeTypeFromExtension(extension);
  },
  getUrl: function(callback, progress) {
    var song = this;
    if (!this.url) {
      tunami.utility.getZipEntryAsDataURL(this.entry, function(url) {
        song.url = url;
        callback();
      }, progress);
    } else callback();
  },
  play: function(audio, source, progress, validator) {
    var song = this;
    this.getUrl(function() {
      // Make sure the user hasn't clicked another title while we were away.
      if (!validator()) return;

      source.type = song.type;
      source.src = song.url;
      audio.appendChild(source);
      audio.play();
    }, progress);
  }
});

