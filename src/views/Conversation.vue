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
              <v-list-item-subtitle>{{message.from}}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
      
    <v-row>
      <v-col cols="10">
        <v-text-field
          label="Main input"
          v-model="newMessage"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn
        @click="send">
          Send
        </v-btn>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script>
  export default {
    name: 'Conversation',

    data: () => ({
      messages: [],
      room: "MY ROOM",
      roomId: "",
      newMessage: "",
    }),
    sockets: {
      RECEIVE: function(data) {
        console.log("message received", data)
        this.messages.push({"content": data, "from": "kenbob"})
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
      
      join: function() {
        //TODO: GET room info
        this.roomId = this.$route.params.id
        this.messages = []
        this.$socket.emit("JOIN", this.roomId)
      }
    },
    mounted() {
      this.join()
    },
    beforeRouteUpdate(to, from, next) {
      console.log(to, from, next)
      this.join()
    },
    beforeRouteLeave(to, from, next) {
      console.log(to, from, next)
      this.$socket.emit("LEAVE", this.$store.state.room) 
      next()
    }
    
  }
</script>
