<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-subheader class="text-h4 mt-4"> Subscribed Threads</v-subheader>
          <thread-list
            v-bind:threads="subbedThreads"
            v-on:enter-room="enterRoom"
          ></thread-list>
          <v-divider></v-divider>

          <v-subheader class="text-h4 mt-4"> All Public Threads</v-subheader>
          <thread-list
            v-bind:threads="allThreads"
            v-on:enter-room="enterRoom"
          ></thread-list>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import {
  CHAT_BACKEND_ROOMS,
  CHAT_BACKEND_SUBBED,
  CHAT_BACKEND_URL,
  REFRESH_TIMEOUT,
} from "../constants";

import ThreadList from "../components/ThreadList.vue";

export default {
  name: "ThreadFeed",
  components: {
    "thread-list": ThreadList,
  },
  data: () => ({
    allThreads: [],
    subbedThreads: [],
    threadUpdateJob: null,
  }),
  methods: {
    enterRoom: function (roomId) {
      this.$router.push("/chat/" + roomId);
    },
    getChatrooms: function () {
      axios.get(CHAT_BACKEND_URL + CHAT_BACKEND_ROOMS).then((response) => {
        this.allThreads = response.data.rooms;
      });
      axios
        .get(CHAT_BACKEND_URL + CHAT_BACKEND_SUBBED, {
          params: { username: this.$store.state.username },
        })
        .then((response) => {
          this.subbedThreads = response.data.rooms;
        });
      this.threadUpdateJob = setTimeout(this.getChatrooms, REFRESH_TIMEOUT);
    },
  },
  mounted() {
    this.getChatrooms();
  },
  beforeDestroy() {
    if (this.threadUpdateJob != null) {
      clearTimeout(this.threadUpdateJob);
    }
  },
};
</script>
