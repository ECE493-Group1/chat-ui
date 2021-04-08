<template>
  <v-container fluid>
    <v-row>
      <v-spacer cols="3"></v-spacer>
      <v-col cols="6">
        <v-card class="mx-auto pa-3 secondary" elevation="4">
          <v-card-title> 
            <div class="text-h3 mb-10">
              Login 
            </div>
          </v-card-title>
          <v-card-subtitle class="pb-0 text-h5">
            Email
          </v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              placeholder="email@email.com"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-subtitle class="pb-0 text-h5">
            Password
          </v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              placeholder="password"
              @click:append="show = !show"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" v-bind:disabled="isDisabled" @click="submit"
              >Login</v-btn
            >
            <v-btn color="primary" @click="$router.push('/forgot-password')"
              >Forgot Password?</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-spacer cols="3"></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { USER_SERVICE_URL, USER_SERVICE_LOGIN } from "../constants";

export default {
  name: "Login",
  components: {},
  data: () => ({
    email: "",
    emailRules: [
      (v) =>
        v.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        ) != null,
    ],
    password: "",
    show: false,
  }),
  computed: {
    isDisabled: function () {
      return (
        this.email == "" ||
        this.password == "" ||
        this.emailRules.filter((rule) => !rule(this.email)).length != 0
      );
    },
  },
  methods: {
    submit() {
      axios
        .post(USER_SERVICE_URL + USER_SERVICE_LOGIN, {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.$router.push("/");
          this.$store.state.email = this.email;
          this.$store.state.username = response.data.username;
          this.$store.state.authToken = response.data.token;
          this.$store.state.isLoggedIn = true;
        })
        .catch((error) => {
          // TODO: Display error message to the user
          console.log(error.response.data.message);
        });
    },
  },
};
</script>
