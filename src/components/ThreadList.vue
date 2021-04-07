
<template>
    <div>
      <v-list-item v-for="(room, i) in threads" :key="i">
        <v-list-item-content>
          <v-list-item-title class="text-h4"
            >{{ room.title }}
            <v-icon v-if="room.isPrivate"> mdi-lock </v-icon>
          </v-list-item-title>
          <v-list-item-subtitle class="text-h6 font-italic">
            {{ room.lastMessage }}
          </v-list-item-subtitle>
          <v-list-item-subtitle
            >Members: {{ room.members.join(", ") }}</v-list-item-subtitle
          >
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text>{{
            shortTime(room.lastMessageTime)
          }}</v-list-item-action-text>
          <v-btn plain @click="$emit('enter-room', room.roomId)">
            <v-icon x-large> mdi-arrow-right-thick </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </div>
</template>

<script>
export default {
  name: "ThreadList",
  props: {
    threads: Array,
  },
  data: () => ({
    newUserName: "",
  }),
  methods: {
    add: function () {
      this.members.push(this.newUserName);
      this.newUserName = "";
    },
    remove: function (index) {
      this.members.splice(index, 1);
    },
    shortTime: function (messageTime) {
      var currentTime = Math.floor(Date.now() / 1000);
      var difference = currentTime - messageTime;
      if (difference < 60) {
        return difference.toString() + " seconds ago";
      }
      if (difference < 3600) {
        return Math.ceil(difference / 3600).toString() + " minutes ago";
      }
      if (difference < 86400) {
        return Math.ceil(difference / 86400).toString() + " days ago";
      }
    },
  },
};
</script>