<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn :disabled="!enabled" color="primary" dark v-bind="attrs" v-on="on"
          >Search For Users
        </v-btn>
      </template>
      <v-card class="secondary">
        <v-text-field class="px-4" v-model="searchQuery" label="username">
        </v-text-field>
        <v-divider></v-divider>
        <v-btn class="secondary black--text" text @click="search">Search</v-btn>
        <v-divider></v-divider>
        <v-card-text style="height: 300px">
          <v-list class="secondary">
            <v-list-item v-for="(user, i) in users" :key="i">
              <v-list-item-title>{{ user }}</v-list-item-title>
              <v-list-item-action>
                <v-btn @click="add(i)" class="primary">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";
import { USER_SERVICE_URL, USER_SERVICE_USER_SEARCH } from "../constants";

export default {
  name: "SearchUsers",
  data: () => ({
    searchQuery: "",
    users: [],
    dialog: false,
  }),
  props: {
    members: Array,
    enabled: {
      type: Boolean,
      default: true
    },
  },
  watch: {
    dialog(val) {
      if (!val) {
        this.searchQuery = "";
        this.users = [];
      }
    },
  },
  methods: {
    search() {
      axios
        .post(
          USER_SERVICE_URL + USER_SERVICE_USER_SEARCH,
          {
            search_query: this.searchQuery,
          },
          {
            headers: { Authorization: `Bearer ${this.$store.state.authToken}` },
          }
        )
        .then((response) => {
          this.users = response.data.results;
        })
        .catch((error) => {
          // TODO: Display error message to the user
          console.log(error);
        });
    },
    add: function (index) {
      this.members.push(this.users[index]);
    },
  },
};
</script>