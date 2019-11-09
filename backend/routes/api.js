const express = require('express')

const schemas = require('../validation_schemas/api')
const { validate } = require('../middleware/validator')
const objSchemas = require('../utils/objScehmas')

const getters = require('../database/getters')
const pool = require('../database/database')

const router = express.Router()

router.get('/search', validate('query', schemas.keyword), async (req, res, next) => {
  try {
    const keyword = req.query.keyword.toLowerCase().replace(/[^\w\s?']|_/g, " ").replace(/\s+/g, " ").trim()

    const albumsObj = objSchemas.graph(`Use of "${keyword}" in Albums`, `Number of times "${keyword}" was used`)
    const yearsObj = objSchemas.graph(`Use of "${keyword}" Throughout the Years`, `Number of times "${keyword}" was used`)
    const songObj = objSchemas.song()
    const totalObj = objSchemas.total()
    const indecies = objSchemas.indecies()

    // initialize the return object
    const albums = await getters.getAlbums()
    albums.forEach(album => {
      albumsObj.labels.push(album.title)
      albumsObj.datasets[0].data.push(0)
      indecies.albums[album.title] = albumsObj.labels.length - 1

      // hedges the problem that two albums might be released in the same year
      if (yearsObj.labels.indexOf(album.year) === -1) {
        yearsObj.labels.push(album.year)
        yearsObj.datasets[0].data.push(0)
        indecies.years[album.year] = yearsObj.labels.length - 1
      }
    })

    const songs = await getters.lyricSearch(keyword)
    // loop through every song
    songs.forEach(song => {
      //split on every instance of the keyword with a space before and after it
      let numLyrics = song.normalizedLyrics.split(" " + keyword + " ").length -1
      if(numLyrics > 0) {
        albumsObj.datasets[0].data[indecies.albums[song.album]] += numLyrics
        yearsObj.datasets[0].data[indecies.years[song.year]] += numLyrics
        totalObj.num += numLyrics
        songObj.songs.push({title: song.title, album: song.album, year: song.year, num: numLyrics})
      }
    })

    // find the top 10 songs
    songObj.songs = songObj.songs.sort((a, b) => (a.num > b.num) ? 1 : -1).reverse()

    res.send([albumsObj, yearsObj, totalObj, songObj])
  } catch (err) {
    next(err)
  }
})

router.get('/song', validate('query', schemas.keyword), async(req, res, next) => {
  try {
    const keyword = req.query.keyword.toLowerCase().trim()
    const song = await getters.songSearch(keyword)
    res.send(song)
  } catch (err) {
    next(err)
  }
})

module.exports = router
