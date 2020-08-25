<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-text-field
          ref="keyword"
          v-model="keyword"
          :rules="keywordRules"
          label="Key word or phrase"
          @keyup.enter="search()"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="numWindows > 0">
      <v-card flat tile style="width: 100%">
        <v-window v-model="window">
          <v-window-item v-for="(w, i) in numWindows" :key="`window-${w}`">
            <Bar
              v-if="windowData[i].type === 'graph'"
              :chart-data="windowData[i]"
              :options="options"
              :styles="style"
            />
            <h1
              v-else-if="windowData[i].type === 'total'"
              style="text-align: center; padding: 20px;"
            >
              {{ windowData[i].num }}
            </h1>
            <v-data-table
              v-else-if="windowData[i].type === 'songs'"
              :headers="windowData[i].headers"
              :items="windowData[i].songs"
              @click:row="songClick($event)"
            >
            </v-data-table>
          </v-window-item>
        </v-window>

        <v-card-actions class="justify-space-between">
          <v-btn text @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <h3>{{ windowData[window].title }}</h3>
          <v-btn text @click="next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-row align="center">
      <v-col sm="8" cols="12">
        <span class="title font-regular"
          >The Bruce Analyzer is a database of every song on every Bruce
          Springsteen major label release from
          <i>Greetings From Asbury Park</i> (1973) to
          <i>Chapter and Verse</i> (2016) -- 20 albums.
          <br />
          <br />
          All total, Bruce Analyzer contains 306 rocking songs. Testament to
          Bruce's famous vocabulary, there are ___ different words in these
          amazing songs.
          <br />
          <br />
        </span>
        <span class="headline">To use:</span>
        <ul>
          <li>
            Type a word or phrase (e.g "love") into the input space provided and
            hit enter.
          </li>
          <li>
            Immediately, you will see the number of appearances of that word or
            phrase in each of Bruce's albums ("love" rarely shows up in Bruce's
            first four albums but appears frequently in <i>The River</i>)
          </li>
          <li>
            Click the right arrow, located in the bottom right of the graph, to
            see a similar graph by year instead of by album.
          </li>
          <li>
            Click again to see the total number of uses of the word or phrase in
            all of Bruce's songs.
          </li>
          <li>
            Click it one more time to see each song, its album and year, and the
            number of uses of the word or phrase ("love" appears in
            <i>The Rising</i>'s "Into the Fire" 25 times, 10 more times than in
            any other song).
          </li>
          <li>
            Click on any song in the table to see its complete lyrics with the
            search word or phrase highlighted.
          </li>
          <li>
            Experiment and enjoy!
          </li>
        </ul>
      </v-col>
      <v-col sm="4" cols="12">
        <v-img :src="require('~/assets/born to run.jpg')"></v-img>
      </v-col>
    </v-row>

    <v-dialog v-model="showSong" width="500px">
      <v-card>
        <Song :title="songTitle" :keyword="keyword" />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Song from '@/components/Song.vue'
export default {
  components: {
    Song
  },
  data() {
    return {
      keyword: '',
      loaded: false,
      window: 0,
      windowData: {},
      numWindows: 0,
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              ticks: {
                callback(value) {
                  if (value.length > 12) {
                    return value.substr(0, 12) + '...' // truncate
                  } else {
                    return value
                  }
                }
              }
            }
          ]
        },
        onClick: this.graphClick
      },
      style: {
        width: '100%',
        height: '500px'
      },
      showSong: false,
      songTitle: '',
      keywordRules: [(v) => !!v || 'Keyword Required']
    }
  },
  methods: {
    async search() {
      try {
        if (this.$refs.keyword.validate()) {
          const data = await this.$axios.$get(`/search?keyword=${this.keyword}`)
          this.windowData = data
          this.numWindows = data.length
          this.loaded = true
        }
      } catch (err) {
        this.$nuxt.error({
          message: err.response.data.message,
          statusCode: err.response.status
        })
      }
    },
    graphClick(point, event) {
      if (event.length > 0) {
        // eslint-disable-next-line no-console
        console.log(event[0]._model.label)
      }
    },
    songClick(item) {
      this.songTitle = item.title
      this.showSong = true
    },
    next() {
      this.window = this.window + 1 === this.numWindows ? 0 : this.window + 1
    },
    prev() {
      this.window = this.window - 1 < 0 ? this.numWindows - 1 : this.window - 1
    }
  }
}
</script>
