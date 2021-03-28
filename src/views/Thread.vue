<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="message-container">
        <v-list>
          <v-subheader>Welcome to {{ room }}</v-subheader>
          <v-list-item v-for="(message, i) in messages" :key="i">
            <v-list-item-title>{{ message.content }}</v-list-item-title>
            <v-list-item-subtitle>{{ message.username }}</v-list-item-subtitle>
          </v-list-item>
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
          <v-btn depressed color="primary" @click="send" slot="append">
            <v-icon> mdi-send </v-icon>
          </v-btn>
        </v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>
<style>
.message-container {
  box-sizing: border-box;
  top: 0;
  height: calc(100vh - 5rem);
  overflow-y: auto;
  background-color: #f2f2f2;
}
.typing-container {
  position: fixed;
  bottom: 0;
  max-height: 5rem;
  margin: auto;
  max-width: 90%;
  background-color: #f2f2f2;
}
</style>
<script>
export default {
  name: "Thread",

  data: () => ({
    messages: [],
    room: "MY ROOM",
    roomId: "",
    newMessage: "",
  }),
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
