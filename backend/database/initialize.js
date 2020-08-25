const lyrics = require('node-lyrics');
const getters = require('./getters')
const maintenance = require('./maintenance')

const ignoreAlbums = ['Live/1975-85', 'Chimes Of Freedom', 'In Concert - MTV Plugged', 'Greatest Hits', 'Blood Brothers', '18 Tracks', 'Live In New York City', 'The Essential Bruce Springsteen', "Hammersmith Odeon London '75", 'Live In Dublin', 'Magic Tour Highlights', 'American Beauty', 'The Ties That Bind: The River Collection', 'Other Songs', 'Other Releases']

const initialize = async() => {
  try {
    if (! await getters.checkPopulated()) {
      // get all information from the artist
      const artist = await lyrics.getArtist('Bruce Springsteen')


      // filter out the live and extra albums
      const albums = artist.albums.filter(album => !ignoreAlbums.includes(album.album))

      const queryAlbums = []
      const querySongs = []

      // format the query data
      let aid = 1
      for (album of albums) {
        queryAlbums.push([album.album, parseInt(album.year)])
        for (song of album.songs) {
          let songInfo = await lyrics.parseLyrics('Bruce Springsteen', song)
          // replace all new lines with a special character
          let prettyLyrics = songInfo.lyrics.replace(/\r?\n|\r/g, "&&")
          // format Album Id, Song Title, Normalized Lyrics, Pretty Lyrics
          querySongs.push([aid, songInfo.song, " " + prettyLyrics.toLowerCase().replace(/[^\w\s?']|_/g, " ").replace(/\s+/g, " ").trim() + " ", prettyLyrics.replace(/&&,/g, '\n').trim()])
        }
        aid++
      }

      await maintenance.addAlbums(queryAlbums)
      await maintenance.addSongs(querySongs)
    }
    return
  } catch (err) {
    console.error(err)
  }
}

module.exports = initialize
