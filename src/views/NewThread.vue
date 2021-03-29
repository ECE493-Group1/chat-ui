<template>
  <v-container>
    <v-row>
      <v-spacer cols="3"></v-spacer>
      <v-col cols="6">
        <v-text-field
          v-model="title"
          :rules="titleRules"
          label="Thread Title"
          required
        ></v-text-field>
        <v-checkbox v-model="isPrivate" label="Private Thread"></v-checkbox>
        <search-users></search-users>
        <add-user v-bind:members="this.members"></add-user>
        <v-btn
          block
          x-large
          color="primary"
          v-bind:disabled="isDisabled"
          @click="submit"
          >Submit</v-btn
        >
      </v-col>
      <v-spacer cols="3"></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import AddMember from "../components/AddMembers";
import { CHAT_BACKEND_URL, CHAT_BACKEND_ROOMS} from "../constants";
import axios from "axios"
import SearchUsers from '../components/SearchUsers';

export default {
  name: "NewThread",
  components: {
    "add-user": AddMember,
    "search-users" : SearchUsers
  },
  data: () => ({
    title: "",
    isPrivate: false,
    titleRules: [(v) => v.length < 15 || "Title Too Long"],
    members: [],
  }),
  computed: {
    isDisabled: function () {
      return this.title === "" || this.members.length <= 1;
    },
  },
  methods: {
    submit() {
      axios.post(CHAT_BACKEND_URL + CHAT_BACKEND_ROOMS, {
        title: this.title,
        isPrivate: this.isPrivate,
        members: this.members,
      }).then((response) => {
        this.$router.push("/chat/" + response.data.id)
      });

    },
  },
  mounted() {
    this.members.push(this.$store.state.username);
  },
};
</script>
