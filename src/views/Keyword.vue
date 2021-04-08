<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-h2 text-center">#{{ keyword }}</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <div class="text-h4 text-center"> Number of threads: {{ threads.length }} </div>
        </v-col>
        <v-col cols="6">
          <div class="text-h4 text-center">
            <!--TODO actually add mentions-->
            Mentions: {{ 12 }}
          </div>
        </v-col>
        <v-spacer cols="2"></v-spacer>
      </v-row>
      <v-row>
        <v-spacer cols="4"></v-spacer>
        <v-col cols="4">
          <v-btn @click="subscribe" block v-bind:color="isSubbed ? 'error' : 'primary'"
            >
            {{ isSubbed ? "Unsubscribe" : "Subscribe"}}
            <v-icon right dark>{{isSubbed ? "mdi-trash-can":"mdi-add"}}</v-icon>
          </v-btn>
        </v-col>
        <v-spacer cols="4"></v-spacer>
      </v-row>
      <v-row>
        <v-spacer cols="2"></v-spacer>
        <v-col cols="8">
        <v-list>
          <v-divider></v-divider>
          <v-subheader class="text-h5"> Threads with this Keyword</v-subheader>
          <thread-list v-bind:threads="threads" v-on:enter-room="enterRoom"></thread-list>
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
} from "../constants";

import ThreadList from "../components/ThreadList.vue";

export default {
  name: "Keyword",
  components: {
    "thread-list": ThreadList,
  },
  data: () => ({
    threads: [],
    isSubbed: false
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
        axios.post(KW_SERVICE_URL + KW_SERVICE_USER, {
          authtoken: this.$store.state.authToken,
          keyword: this.keyword,
        }).then((response) => {this.isSubbed = true, console.log(response)})
      } else {
        axios.delete(KW_SERVICE_URL + KW_SERVICE_USER, {
          data: {
            authtoken: this.$store.state.authToken,
            keyword: this.keyword,
          }
       }).then((response) => {this.isSubbed = false, console.log(response)})
      } 

    },
    getAssociated: async function () {
        var response = await axios.get(KW_SERVICE_URL + KW_SERVICE_ROOMS_KW, {
          params: { keyword: this.keyword },
        });
        var ids = { ids: response.data.chatrooms };
        
        response = await axios.post(CHAT_BACKEND_URL + CHAT_BACKEND_BY_LIST, ids);
        this.threads = response.data.rooms; 
    },
    getSubbed: function() {
      axios.get(KW_SERVICE_URL + KW_SERVICE_USER, {
        params: {authtoken: this.$store.state.authToken}
      }).then((response) => this.isSubbed = response.data.keywords.includes(this.keyword))
    }
  },
  mounted() {
    this.getAssociated();
    this.getSubbed();
  },
};
</script>
