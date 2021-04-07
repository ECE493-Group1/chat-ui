<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-subheader class="text-h5"> Subscribed Threads</v-subheader>
          <thread-list v-bind:threads=allThreads v-on:enter-room="enterRoom"></thread-list> 
          <v-divider></v-divider>

          <v-subheader class="text-h5"> All Public Threads</v-subheader>
          <thread-list v-bind:threads=subbedThreads v-on:enter-room="enterRoom"></thread-list>
          
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
} from "../constants";

import ThreadList from "../components/ThreadList.vue"

export default {
  name: "ThreadFeed",
  components: {
    "thread-list": ThreadList
  },
  data: () => ({
    allThreads: [],
    subbedThreads: [],
  }),
  methods: {
    enterRoom: function (roomId) {
      this.$router.push("/chat/" + roomId);
    },
    
  },
  mounted() {
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
  },
};
</script>
