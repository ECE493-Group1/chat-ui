<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-list-item v-for="(room, i) in rooms" :key="i">
            <v-list-item-content>
              <v-list-item-title class="text-h4">{{
                room.title
              }}</v-list-item-title>
              <v-list-item-subtitle class="text-h6 font-italic">
                {{room.lastMessage}}
              </v-list-item-subtitle>
              <v-list-item-subtitle
                >Members: {{ room.members.join(", ") }}</v-list-item-subtitle
              >
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>{{
                shortTime(room.lastMessageTime)
              }}</v-list-item-action-text>
              <v-btn plain @click="pickroom(room.roomId)">
                <v-icon x-large> mdi-arrow-right-thick </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { CHAT_BACKEND_ROOMS, CHAT_BACKEND_URL } from "../constants";

export default {
  name: "ThreadFeed",

  data: () => ({
    rooms: [],
  }),
  methods: {
    pickroom: function (roomId) {
      this.$router.push("/chat/" + roomId);
    },
    shortTime: function (messageTime) {
      var currentTime = Math.floor(Date.now()/1000);
      var difference = currentTime - messageTime;
      if (difference < 60) {
        return difference.toString() + " seconds ago";
      }
      if (difference < 3600) {
        return Math.ceil(difference / 3600).toString() + " minutes ago";
      }
      if (difference < 86400) {
        return Math.ceil(difference / 86400).toString + " days ago";
      }
    },
  },
  mounted() {
    axios.get(CHAT_BACKEND_URL + CHAT_BACKEND_ROOMS).then((response) => {
      this.rooms = response.data.rooms;
    });
  },
};
</script>
