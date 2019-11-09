module.exports = {
  graph: (title, label) => {
    return {
      type: 'graph',
      title: title,
      labels: [],
      datasets: [{
        label: label,
        data: []
      }]
    }
  },

  song: () => {
    return {
      type: 'songs',
      title: 'Top Uses in Songs',
      headers: [
        {text: 'Song Title', align: 'left', sortable: false, value: 'title'},
        {text: 'Album',  align: 'left', sortable: false, value: 'album'},
        {text: 'Year', align: 'center', sortable: false, value: 'year'},
        {text: 'Number of Uses', align: 'center', sortable: true, value: 'num'}
      ],
      songs: []
    }
  },

  total: () => {
    return {
      type: 'total',
      title: 'Total Uses',
      num: 0
    }
  },

  indecies: () => {
    return {
      albums: {},
      years: {}
    }
  }
}
