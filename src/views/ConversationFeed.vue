<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-list-item v-for="(room, i) in rooms" :key="i" @click="pickroom(room.id)">
            <v-list-item-title>Name: {{ room.name }}</v-list-item-title>
            <v-list-item-subtitle>Id: {{ room.id }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "ConversationFeed",

  data: () => ({
    rooms: [],
  }),
  methods: {
    pickroom: function(roomId) {
      this.$router.push("/chat/" + roomId)
    }
  },
  mounted() {
    axios.get("http://localhost:8000/rooms").then((response) => {
      var names = response.data.rooms;
      var ids = response.data.ids;
      this.rooms = names.map(function (e, i) {
        return { "name": e, "id": ids[i] };
      });
    });
  },
};
</script>
