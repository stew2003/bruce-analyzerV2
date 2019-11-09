const pool = require('./database')
const Errors = require('../utils/errors')

module.exports = {
  // add a list of lists of albums to the database
  addAlbums: async (albums) => {
    try {
      await pool.query('INSERT INTO Albums (title, year) VALUES ?;', [albums])
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // add a list of songs to the database
  addSongs: async (songs) => {
    try {
      await pool.query('INSERT INTO Songs (aid, title, normalizedLyrics, lyrics) VALUES ?;', [songs])
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  }
}
