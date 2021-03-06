<template>
  <v-container fluid>
    <v-row>
      <v-spacer cols="4"></v-spacer>
      <v-col cols="4">
        <v-list>
          <v-subheader class="text-h4 mt-4"> Subscribed Keywords</v-subheader>
          <v-list-item
            v-for="(keyword, i) in subbedKeywords"
            :key="i"
            class="rounded-lg secondary ma-2"
            @click="viewKeyword(keyword)"
          >
            <v-list-item-content>
              <v-list-item-title class="text-h5">
                #{{ keyword }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn plain>
                <v-icon x-large> mdi-chevron-right </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>

          <v-subheader class="text-h4 mt-4"> Recommended Keywords</v-subheader>
          <v-list-item
            v-for="(keyword, i) in recommendedKeywords"
            :key="subbedKeywords.length + i"
            class="rounded-lg secondary ma-2"
            @click="viewKeyword(keyword)"
          >
            <v-list-item-content>
              <v-list-item-title class="text-h5">
                #{{ keyword }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn plain>
                <v-icon x-large> mdi-chevron-right </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>

          <v-subheader class="text-h4 mt-4"> All Keywords</v-subheader>
          <v-list-item
            v-for="(keyword, i) in allKeywords"
            :key="subbedKeywords.length + recommendedKeywords.length + i"
            class="rounded-lg secondary ma-2"
            @click="viewKeyword(keyword)"
          >
            <v-list-item-content>
              <v-list-item-title class="text-h5">
                #{{ keyword }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn plain>
                <v-icon x-large> mdi-chevron-right </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>
      </v-col>
      <v-spacer cols="4"></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import {
  KW_SERVICE_ALL_KW,
  KW_SERVICE_RECOMMEND,
  KW_SERVICE_URL,
  KW_SERVICE_USER,
  REFRESH_TIMEOUT,
} from "../constants";

export default {
  name: "KeywordFeed",
  data: () => ({
    allKeywords: [],
    recommendedKeywords: [],
    subbedKeywords: [],
    keywordUpdateJob: null,
  }),
  methods: {
    viewKeyword: function (keyword) {
      this.$router.push("/keyword/" + keyword);
    },
    updateKeywords: function () {
      axios.get(KW_SERVICE_URL + KW_SERVICE_ALL_KW).then((response) => {
        this.allKeywords = response.data.keywords;
      });
      axios
        .get(KW_SERVICE_URL + KW_SERVICE_RECOMMEND, {
          params: { authtoken: this.$store.state.authToken },
        })
        .then((response) => {
          this.recommendedKeywords = response.data.keywords;
        });
      axios
        .get(KW_SERVICE_URL + KW_SERVICE_USER, {
          params: { authtoken: this.$store.state.authToken },
        })
        .then((response) => {
          this.subbedKeywords = response.data.keywords;
        });
      this.keywordUpdateJob = setTimeout(this.updateKeywords, REFRESH_TIMEOUT);
    },
  },
  mounted() {
    this.updateKeywords();
  },
  beforeDestroy() {
    if(this.keywordUpdateJob != null) {
      clearTimeout(this.keywordUpdateJob)
    }
  }
};
</script>
