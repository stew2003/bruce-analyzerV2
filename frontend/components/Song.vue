<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" :md="song != null ? 7 : 12">
        <v-text-field
          ref="title"
          v-model="titleData"
          :rules="titleRules"
          label="Song Title"
          @keyup.enter="search()"
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <template v-if="song != null">
        <v-col cols="12" md="4">
          <v-text-field
            ref="keyword"
            v-model="keywordData"
            :rules="keywordRules"
            label="Keyword"
          ></v-text-field>
        </v-col>
      </template>
    </v-row>
    <v-row>
      <v-card flat tile style="width: 100%">
        <div v-if="song != null" style="white-space: pre-line;" class="pa-10">
          <Highlighter
            :text-to-highlight="song.lyrics"
            :search-words="[keywordData]"
          />
        </div>
        <v-data-table
          v-else-if="songList.length > 0"
          :headers="[
            {
              text: 'Song Title',
              align: 'left',
              sortable: false,
              value: 'title'
            },
            { text: 'Album', align: 'left', sortable: false, value: 'album' },
            { text: 'Year', align: 'center', sortable: false, value: 'year' }
          ]"
          :items="songList"
          hide-default-footer
          @click:row="searchTitle($event)"
        >
        </v-data-table>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    keyword: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      titleData: this.title,
      keywordData: this.keyword,
      titleRules: [(v) => !!v || 'Title Required'],
      keywordRules: [(v) => !!v || 'Keyword Required'],
      song: null,
      songList: []
    }
  },
  watch: {
    keyword: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue) {
          this.keywordData = newValue
        }
      }
    },
    title: {
      immediate: true,
      async handler(newValue, oldValue) {
        if (newValue) {
          this.titleData = newValue
          const data = await this.$axios.$get(`/song?keyword=${this.titleData}`)
          this.song = data
        }
      }
    }
  },
  methods: {
    async search() {
      try {
        if (this.$refs.title.validate()) {
          const data = await this.$axios.$get(`/song?keyword=${this.titleData}`)
          if (Array.isArray(data)) {
            this.songList = data
            this.song = null
          } else {
            this.song = data
            this.songList = []
          }
        }
      } catch (err) {
        this.$nuxt.error({
          message: err.response.data.message,
          statusCode: err.response.status
        })
      }
    },
    async searchTitle(item) {
      this.titleData = item.title
      await this.search()
    }
  }
}
</script>
