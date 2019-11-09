const pool = require('./database')
const objSchemas = require('../utils/objScehmas')
const Errors = require('../utils/errors')

module.exports = {
  // check if the database is populated
  checkPopulated: async () => {
    try {
      const albums = await pool.query('SELECT * FROM Albums;')
      const songs = await pool.query('SELECT * FROM Songs;')

      // if both have something in it then the db is populated
      return (albums.length > 0 && songs.length > 0)
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // get all albums
  getAlbums: async () => {
    try {
      const albums = await pool.query('SELECT * FROM Albums;')
      return albums
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // match against a keyword
  lyricSearch: async (keyword) => {
    try {
      // if the keyword is long enough for the full text index to be useful
      if (keyword.length > 3) {
        const songs = await pool.query(`SELECT s.title, s.normalizedLyrics, a.title AS album, a.year FROM Songs s JOIN Albums a ON s.aid = a.aid WHERE MATCH (normalizedLyrics) AGAINST (? IN NATURAL LANGUAGE MODE);`, [keyword])
        return songs
      }
      else {
        const songs = await pool.query('SELECT s.title, s.normalizedLyrics, a.title AS album, a.year FROM Songs s JOIN Albums a ON s.aid = a.aid;')
        return songs
      }
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // find a song
  songSearch: async (keyword) => {
    try {
      const song = await pool.query('SELECT title, lyrics FROM Songs WHERE title = ?;', [keyword])

      if (song.length > 0) {
        return song[0]
      }

      const similarSongs = await pool.query('SELECT s.title, s.lyrics, a.title AS album, a.year FROM Songs s JOIN Albums a ON s.aid = a.aid WHERE MATCH (s.title) AGAINST (? IN NATURAL LANGUAGE MODE);', [keyword])
      return similarSongs

    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  }
}
