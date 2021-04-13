<template>
  <div>
    <v-container>
      <v-row>
        <v-spacer cols="3"></v-spacer>
        <v-col cols="6">
          <v-card class="mx-auto pa-3 secondary" elevation="4">
            <v-card-title class="d-block">
              <div class="text-h3 mb-3 d-block text-center">#{{ keyword }}</div>
            </v-card-title>
            <v-card-text>
              <div class="text-h6 text-center">
                Number of Threads: {{ this.threads.length }}
              </div>
            </v-card-text>
            <v-card-text>
              <!-- TODO fix mentions -->
              <div class="text-h6 text-center">
                Mentions: 10 
              </div>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                @click="subscribe"
                v-bind:color="isSubbed ? 'error' : 'primary'"
              >
                {{ isSubbed ? "Unsubscribe" : "Subscribe" }}
                <v-icon right dark>{{
                  isSubbed ? "mdi-trash-can" : "mdi-plus"
                }}</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-spacer cols="3"></v-spacer>
      </v-row>
      <v-row>
        <v-spacer cols="4"></v-spacer>
        <v-col cols="4"> </v-col>
        <v-spacer cols="4"></v-spacer>
      </v-row>
      <v-row>
        <v-spacer cols="2"></v-spacer>
        <v-col cols="8">
          <v-list>
            <v-divider></v-divider>
            <v-subheader class="text-h5">
              Threads with this Keyword</v-subheader
            >
            <thread-list
              v-bind:threads="threads"
              v-on:enter-room="enterRoom"
            ></thread-list>
          </v-list>
        </v-col>
        <v-spacer cols="2"></v-spacer>
      </v-row>
    </v-container>
  </div>
</template>
<style scoped>
.text-h2 {
  margin: 20px;
}
</style>
<script>
import axios from "axios";
import {
  CHAT_BACKEND_BY_LIST,
  CHAT_BACKEND_URL,
  KW_SERVICE_ROOMS_KW,
  KW_SERVICE_URL,
  KW_SERVICE_USER,
  REFRESH_TIMEOUT,
} from "../constants";

import ThreadList from "../components/ThreadList.vue";

export default {
  name: "Keyword",
  components: {
    "thread-list": ThreadList,
  },
  data: () => ({
    threads: [],
    isSubbed: false,
    threadsUpdateJob: null,
  }),
  computed: {
    keyword() {
      return this.$route.params.keyword;
    },
  },
  methods: {
    enterRoom: function (roomId) {
      this.$router.push("/chat/" + roomId);
    },
    subscribe: function () {
      if (!this.isSubbed) {
        axios
          .post(KW_SERVICE_URL + KW_SERVICE_USER, {
            authtoken: this.$store.state.authToken,
            keyword: this.keyword,
          })
          .then((response) => {
            (this.isSubbed = true), console.log(response);
          });
      } else {
        axios
          .delete(KW_SERVICE_URL + KW_SERVICE_USER, {
            data: {
              authtoken: this.$store.state.authToken,
              keyword: this.keyword,
            },
          })
          .then((response) => {
            (this.isSubbed = false), console.log(response);
          });
      }
    },
    getAssociated: async function () {
      var response = await axios.get(KW_SERVICE_URL + KW_SERVICE_ROOMS_KW, {
        params: { keyword: this.keyword },
      });
      var ids = { ids: response.data.chatrooms };

      response = await axios.post(CHAT_BACKEND_URL + CHAT_BACKEND_BY_LIST, ids);
      this.threads = response.data.rooms;
      this.threads.sort((a,b) => b.lastMessageTime - a.lastMessageTime)
    },
    getSubbed: function () {
      axios
        .get(KW_SERVICE_URL + KW_SERVICE_USER, {
          params: { authtoken: this.$store.state.authToken },
        })
        .then(
          (response) => {

            this.isSubbed = response.data.keywords.includes(this.keyword)
          }
        );
    },
    updateThreads: function () {
      this.getAssociated();
      this.getSubbed();
      this.threadsUpdateJob = setTimeout(this.threadsUpdateJob, REFRESH_TIMEOUT);
    }

  },
  mounted() {
    this.updateThreads()
  },
  beforeDestroy() {
    if(this.threadsUpdateJob!= null){
      clearTimeout(this.threadsUpdateJob)
    }
  }
};
</script>
