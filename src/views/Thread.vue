<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-subheader>Welcome to {{room}}</v-subheader>
          <v-list-item
              v-for="(message, i) in messages"
              :key="i"
            >
              <v-list-item-title>{{message.content}}</v-list-item-title>
              <v-list-item-subtitle>{{message.username}}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
      
    <v-row>
      <v-spacer cols="2"></v-spacer>
      <v-col cols="8">
        <v-text-field
          label="Main input"
          v-model="newMessage"
          hide-details="auto"
        >
          <v-btn
          depressed
          color="primary"
          @click="send"
          slot="append">
            <v-icon>
              mdi-send
            </v-icon>
          </v-btn>

        </v-text-field>
      </v-col>
      <v-spacer cols="2"></v-spacer>
    </v-row>
    
  </v-container>
</template>

<script>
  export default {
    name: 'Thread',

    data: () => ({
      messages: [],
      room: "MY ROOM",
      roomId: "",
      newMessage: "",
    }),
    sockets: {
      RECEIVE: function(message) {
        console.log("message received", message)
        this.messages.push(message)
      },
      RECEIVE_PREV: function(data) {
        console.log("previous messages received", data)
        var newMessages = data.messages 
        this.messages.push(...newMessages)
      }
    },
    methods: {
      send: function() {
        var message = {
          "content" : this.newMessage,
          "username": this.$store.state.username,
          "roomId" : this.roomId 
        }
        this.$socket.emit("SEND", JSON.stringify(message))
        this.newMessage = ""
      },
      
      enter: function() {
        //TODO: GET room info
        this.roomId = this.$route.params.id
        this.messages = []
        this.$socket.emit("ENTER", this.roomId)
      }
    },
    mounted() {
      this.enter()
    },
    beforeRouteUpdate(to, from, next) {
      console.log(to, from, next)
      this.enter()
    },
    beforeRouteLeave(to, from, next) {
      console.log(to, from, next)
      this.$socket.emit("LEAVE", this.$store.state.room) 
      next()
    }
    
  }
</script>
