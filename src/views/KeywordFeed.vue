<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-subheader class="text-h5"> Subscribed Keywords</v-subheader>
          <v-list-item v-for="(keyword, i) in subbedKeywords" :key="i">
            <v-list-item-content>
              <v-list-item-title class="text-h4">
                {{ addHashtag(keyword) }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn plain @click="checkKeyword(keyword)">
                <v-icon x-large> mdi-arrow-right-thick </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>

          <v-subheader class="text-h5"> Recommended Keywords</v-subheader>
          <v-list-item
            v-for="(keyword, i) in recommendedKeywords"
            :key="subbedKeywords.length + i"
          >
            <v-list-item-content>
              <v-list-item-title class="text-h4">
                {{ addHashtag(keyword) }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn plain @click="checkKeyword(keyword)">
                <v-icon x-large> mdi-arrow-right-thick </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>

          <v-subheader class="text-h5"> All Keywords</v-subheader>
          <v-list-item
            v-for="(keyword, i) in allKeywords"
            :key="subbedKeywords.length + recommendedKeywords.length + i"
          >
            <v-list-item-content>
              <v-list-item-title class="text-h4">
                {{ addHashtag(keyword) }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn plain @click="checkKeyword(keyword)">
                <v-icon x-large> mdi-arrow-right-thick </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>
      </v-col>
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
} from "../constants";

export default {
  name: "KeywordFeed",
  data: () => ({
    allKeywords: [],
    recommendedKeywords: [],
    subbedKeywords: [],
  }),
  methods: {
    checkKeyword: function (keyword) {
      this.$router.push("/keyword/" + keyword);
    },
    addHashtag: function (x) {
      return "#" + x;
    },
  },
  mounted() {
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
  },
};
</script>
