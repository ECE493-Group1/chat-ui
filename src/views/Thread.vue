<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="messages">
        <v-list>
          <v-list-group prepend-icon="mdi-cog" dense >
            <template v-slot:activator>
              <v-list-item-title>Settings</v-list-item-title>
            </template>

            <v-list-group no-action sub-group>
              <template v-slot:activator>
                <v-list-item-title> Members </v-list-item-title>
              </template>

              <v-list-item v-for="(user, i) in members" :key="i">
                <v-list-item-content>
                  <v-list-item-title>{{ user }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>

            <v-list-item>
              <v-list-item-title>
                {{
                  joined
                    ? "You have joined this thread"
                    : "Please join this thread to message"
                }}
              </v-list-item-title>
              <v-list-item-action>
                <v-btn x-large v-bind:color="joined ? 'error' : 'primary'">
                  {{ joined ? "Leave" : "Join" }}
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-group>

          <v-subheader>Welcome to {{ room }}</v-subheader>

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
          <v-btn depressed :disabled="joined" color="primary" @click="send" slot="append">
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
  background-color: lightgreen;
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
</style>
<script>
export default {
  name: "Thread",

  data: () => ({
    messages: [],
    members: ["bob", "bill", "chuck"],
    room: "MY ROOM",
    roomId: "",
    newMessage: "",
    joined: false,
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
      this.messages = [];
      this.$socket.emit("ENTER", this.roomId);
    },
    threadInfo: function () {},
  },
  mounted() {
    this.enter();
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
};
</script>
