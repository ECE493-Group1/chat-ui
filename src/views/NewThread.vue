<template>
  <v-container>
    <v-row>
      <v-spacer cols="3"></v-spacer>
      <v-col cols="6">
        <v-card class="mx-auto pa-3 secondary" elevation="4">
          <v-card-title>
            <div class="text-h3 mb-10">New Thread</div>
          </v-card-title>
          <v-card-subtitle class="pb-0 text-h5"> Thread Title </v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="title"
              :rules="titleRules"
              placeholder="Title"
              required
            ></v-text-field>
          </v-card-text>
          <div class="d-flex justify-center mb-5">
            <v-checkbox v-model="isPrivate" label="Private Thread"></v-checkbox>
          </div>
          <search-users v-bind:members="this.members"></search-users>
          <add-user v-bind:members="this.members"></add-user>
          <v-btn
            block
            x-large
            color="primary"
            v-bind:disabled="isDisabled"
            @click="submit"
            >Submit</v-btn
          >
        </v-card>
      </v-col>
      <v-spacer cols="3"></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import AddMember from "../components/AddMembers";
import { CHAT_BACKEND_URL, CHAT_BACKEND_ROOMS } from "../constants";
import axios from "axios";
import SearchUsers from "../components/SearchUsers";

export default {
  name: "NewThread",
  components: {
    "add-user": AddMember,
    "search-users": SearchUsers,
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
      axios
        .post(CHAT_BACKEND_URL + CHAT_BACKEND_ROOMS, {
          title: this.title,
          isPrivate: this.isPrivate,
          members: this.members,
        })
        .then((response) => {
          this.$router.push("/chat/" + response.data.id);
        });
    },
  },
  mounted() {
    this.members.push(this.$store.state.username);
  },
};
</script>
