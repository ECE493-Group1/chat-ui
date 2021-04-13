<template>
  <div class="home" v-if="loggedIn">
    <v-container>
      <v-row>
        <v-spacer cols="3"></v-spacer>
        <v-col cols="6">
          <v-card class="mx-auto pa-3 secondary" elevation="4">
            <v-card-title class="d-block">
              <div class="text-h3 mb-3 d-block text-center">Home</div>
            </v-card-title>
            <v-card-text>
              <div class="text-h6 text-center">
                Username: {{ this.username }}
              </div>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn @click="logout" color="primary"
                >Logout
                <v-icon right dark>mdi-logout</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-spacer cols="3"></v-spacer>
      </v-row>
      <v-row class="mt-14">
        <v-spacer cols="2"></v-spacer>
        <v-cols cols="8">
        <v-list>
          <v-subheader class="text-h4 mt-4"> Your Latest Threads</v-subheader>
          <v-subheader class="text-subtitle-1">
            The latest from your subscribed threads and keywords</v-subheader
          >
          <thread-list
            v-bind:threads="threads"
            v-on:enter-room="enterRoom"
          ></thread-list>
          <v-divider></v-divider>
        </v-list>
        </v-cols>
        <v-spacer cols="2"></v-spacer>
      </v-row>
    </v-container>
  </div>
  <div v-else>
    <v-container fluid>
      <v-row>
        <v-spacer cols="4"></v-spacer>
        <v-col cols="4">
          <v-card class="secondary mx-auto pa-3">
            <v-card-text>
              <div class="text-h2 text-center">Login to Use CATChat</div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" block x-large to="/login"> Login </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-spacer cols="4"></v-spacer>
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
import ThreadListVue from "../components/ThreadList.vue";
import {
  KW_SERVICE_URL,
  KW_SERVICE_ROOMS_KW,
  KW_SERVICE_USER,
  CHAT_BACKEND_URL,
  CHAT_BACKEND_SUBBED,
  CHAT_BACKEND_BY_LIST,
} from "../constants";
// @ is an alias to /src

export default {
  name: "Home",
  components: {
    "thread-list": ThreadListVue,
  },
  data: () => ({
    threads: [],
  }),
  computed: {
    loggedIn: function () {
      return this.$store.state.isLoggedIn;
    },
    email: function () {
      return this.$store.state.email;
    },
    username: function () {
      return this.$store.state.username;
    },
  },
  methods: {
    addThreads: function (newThreads) {
      //filter out duplicate threads
      this.threads = [...this.threads, ...newThreads];
      var ids = new Set()
      this.threads = this.threads.filter((x) => {
        if (ids.has(x.roomId)) {
          return false
        }
        ids.add(x.roomId);
        return true

      });
      
      this.threads.sort(function (a, b) {
        return b.lastMessageTime - a.lastMessageTime;
      });
    },
    loadThreads: async function () {
      console.log("Loading threads")
      if (!this.loggedIn) {
        return;
      }
      axios
        .get(CHAT_BACKEND_URL + CHAT_BACKEND_SUBBED, {
          params: { username: this.$store.state.username },
        })
        .then((response) => this.addThreads(response.data.rooms));

      // Get subbed keywords
      var response = await axios.get(KW_SERVICE_URL + KW_SERVICE_USER, {
        params: { authtoken: this.$store.state.authToken },
      });
      var subbed = response.data.keywords;
      for (var i = 0; i < subbed.length; i++) {
        response = await axios.get(KW_SERVICE_URL + KW_SERVICE_ROOMS_KW, {
          params: { keyword: subbed[i] },
        });
        var ids = { ids: response.data.chatrooms };

        response = await axios.post(
          CHAT_BACKEND_URL + CHAT_BACKEND_BY_LIST,
          ids
        );
        this.addThreads(response.data.rooms);
      }
    },
    enterRoom: function (roomId) {
      this.$router.push("/chat/" + roomId);
    },
    logout: function () {
      this.$store.state.username = "";
      this.$store.state.email = "";
      this.$store.state.isLoggedIn = false;
      this.$router.push("/");
    },
  },
  
  beforeRouteUpdate(to, from, next) {
    console.log(to, from, next);
    this.loadThreads();
  },
  mounted() {
    this.loadThreads();
  },
};
</script>
