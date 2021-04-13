<template>
  <v-container fluid>
    <v-row>
      <v-dialog
        v-model="dialog"
        scrollable
        max-width="40%"
        @click:outside="updateOptions"
      >
        <v-card class="option-container">
          <v-card-title> Thread Options </v-card-title>
          <v-list subheader>
            <v-subheader>Members</v-subheader>

            <v-list-item-group multiple>
              <v-list-item v-for="(user, i) in members" :key="i">
                <v-list-item-content>
                  <v-list-item-title>{{ user }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>

            <search-users
              v-bind:enabled="this.joined"
              v-bind:members="this.members"
            ></search-users>
            <v-subheader> </v-subheader>
            <v-subheader>Join or Leave</v-subheader>
            <v-list-item>
              <v-list-item-title>
                {{
                  joined
                    ? "You have joined this thread"
                    : "Please join this thread to send messages"
                }}
              </v-list-item-title>
              <v-list-item-action>
                <v-btn
                  x-large
                  v-bind:color="joined ? 'error' : 'primary'"
                  @click="toggleJoin"
                >
                  {{ joined ? "Leave" : "Join" }}
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>

      <v-col cols="12" class="messages">
        <v-list>
          <v-list-item>
            <v-btn fab @click="openOptions" class="secondary">
              <v-icon> mdi-cogs</v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item class="center" :style="{ 'align-items': 'center' }">
            <v-list-item-content>
              <p class="text-h2 text-center">{{ title }}</p>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content v-if="keywords.length > 0">
              <div class="d-flex justify-center">
                <v-btn
                  class="pa-4 text--secondary ma-1 secondary rounded-pill"
                  v-for="(kw, i) in keywords"
                  :key="i"
                  @click="viewKeyword(kw)"
                >
                  #{{ kw }}
                </v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <div
            :class="{ 'self-message': message.username == username }"
            v-for="(message, i) in messages"
            :key="i"
          >
            <div>
              <div class="message">
                <div>
                  <div>
                    <h3 class="font-weight-regular">
                      {{ message.content }}
                    </h3>
                  </div>
                  <div>
                    <h5 class="font-weight-thin">
                      {{ message.username }}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="typing-container">
        <v-text-field
          block
          label="Main input"
          v-model="newMessage"
          background-color="white"
        >
          <v-btn
            depressed
            :disabled="!joined"
            color="primary"
            @click="send"
            slot="append"
          >
            Send
            <v-icon> mdi-send </v-icon>
          </v-btn>
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>
<style>
.message {
  background-color: lightblue;
  border-radius: 15px;
  margin: 0.5rem;
  display: inline-flex;
  padding: 1rem;
}
.self-message {
  text-align: right;
}
.self-message .message {
  background-color: #90ee90;
}
.messages {
  box-sizing: border-box;
  top: 0;
  height: calc(100vh - 5rem);
  overflow-y: auto;
}
.typing-container {
  position: fixed;
  bottom: 0;
  max-height: 5rem;
  margin: auto;
  max-width: 90%;
}
.option-container {
  padding: 1rem;
}
</style>
<script>
import axios from "axios";
import SearchUsersVue from "../components/SearchUsers.vue";
import {
  CHAT_BACKEND_ROOM,
  CHAT_BACKEND_LEAVE,
  CHAT_BACKEND_URL,
  KW_SERVICE_URL,
  KW_SERVICE_ROOM_KW,
  REFRESH_TIMEOUT,
} from "../constants";

const MAX_KEYWORDS = 10;

export default {
  name: "Thread",
  components: {
    "search-users": SearchUsersVue,
  },
  data: () => ({
    messages: [],
    members: [],
    title: "hi",
    roomId: "",
    isPrivate: "",
    newMessage: "",
    joined: false,
    dialog: false,
    keywords: [],
    maxKeywords: MAX_KEYWORDS,
    keywordJob: null,
  }),
  computed: {
    username() {
      return this.$store.state.username;
    },
  },
  sockets: {
    RECEIVE: function (message) {
      console.log("message received", message);
      this.messages.push(message);
    },
    RECEIVE_PREV: function (data) {
      console.log("previous messages received", data);
      var newMessages = data.messages;
      this.messages.push(...newMessages);
    },
  },
  methods: {
    send: function () {
      var message = {
        content: this.newMessage,
        username: this.$store.state.username,
        roomId: this.roomId,
      };
      this.$socket.emit("SEND", JSON.stringify(message));
      this.newMessage = "";
    },

    enter: function () {
      //TODO: GET room info
      this.roomId = this.$route.params.id;
      this.getRoomInfo(this.roomId);
      this.messages = [];
      this.$socket.emit("ENTER", this.roomId);
    },
    getRoomInfo: function (roomId) {
      axios
        .get(CHAT_BACKEND_URL + CHAT_BACKEND_ROOM, {
          params: {
            id: roomId,
          },
        })
        .then((response) => {
          var data = response.data;
          this.title = data.title;
          this.isPrivate = data.isPrivate;
          this.members = data.members;
          this.joined = data.members.includes(this.username);
        });
    },
    openOptions: function () {
      this.getRoomInfo(this.roomId);
      this.dialog = true;
    },
    updateOptions: function () {
      //Adds the new members
      axios.post(CHAT_BACKEND_URL + CHAT_BACKEND_ROOM, {
        id: this.roomId,
        members: this.members,
      });
    },
    toggleJoin: async function () {
      if (this.joined) {
        //if a user is already joined, it means they want to leave
        await axios.post(CHAT_BACKEND_URL + CHAT_BACKEND_LEAVE, {
          id: this.roomId,
          member: this.$store.state.username,
        });
      } else {
        await axios.post(CHAT_BACKEND_URL + CHAT_BACKEND_ROOM, {
          id: this.roomId,
          members: [this.$store.state.username],
        });
      }
      this.getRoomInfo(this.roomId);
    },
    getKeywords: function () {
      axios
        .get(KW_SERVICE_URL + KW_SERVICE_ROOM_KW, {
          params: {
            chatroom_id: this.roomId,
          },
        })
        .then((response) => {
          this.keywords = response.data.keywords;
          this.keywordJob = setTimeout(this.getKeywords, REFRESH_TIMEOUT);
        });
    },
    viewKeyword: function (keyword) {
      this.$router.push("/keyword/" + keyword);
    },
  },
  mounted() {
    this.enter();
    this.getKeywords();
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to, from, next);
    this.enter();
  },
  beforeRouteLeave(to, from, next) {
    console.log(to, from, next);
    this.$socket.emit("LEAVE", this.$store.state.room);
    next();
  },
  beforeDestroy() {
    if (this.keywordJob != null) {
      clearTimeout(this.keywordJob);
    }
  },
};
</script>
