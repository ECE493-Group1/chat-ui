<template>
  <v-container>
    <v-row>
      <v-spacer cols="3"></v-spacer>
      <v-col cols="6">
        <v-card class="mx-auto pa-3 secondary" elevation="4">
          <v-card-title>
            <div class="text-h3 mb-10">Register</div>
          </v-card-title>
          <v-card-subtitle class="pb-0 text-h5"> Email </v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              placeholder="email@email.com"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-subtitle class="pb-0 text-h5"> Username</v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="username"
              :rules="usernameRules"
              placeholder="username"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-subtitle class="pb-0 text-h5"> Password </v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              :type="show1 ? 'text' : 'password'"
              placeholder="Password"
              counter
              @click:append="show1 = !show1"
            ></v-text-field>
          </v-card-text>
          <v-card-subtitle class="pb-0 text-h5">
            Confirm Password
          </v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="passwordConfirm"
              :rules="passwordConfirmRules"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              placeholder="Confirm Password"
              counter
              @click:append="show2 = !show2"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn
              x-large
              color="primary"
              v-bind:disabled="isDisabled"
              @click="submit"
              >Register</v-btn
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
import { USER_SERVICE_URL, USER_SERVICE_REGISTER } from "../constants";

export default {
  name: "Register",
  components: {},
  data: () => ({
    email: "",
    emailRules: [
      (v) =>
        v.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        ) != null,
    ],
    username: "",
    usernameRules: [(v) => v.length > 4, (v) => v.length < 12],
    password: "",
    passwordRules: [(v) => v.length > 8],
    passwordConfirm: "",
    show1: false,
    show2: false,
  }),
  computed: {
    isDisabled: function () {
      return (
        this.email == "" ||
        this.password == "" ||
        this.emailRules.filter((rule) => !rule(this.email)).length != 0
      );
    },
    passwordConfirmRules: function () {
      return [(v) => v == this.password];
    },
  },
  methods: {
    submit() {
      axios
        .post(USER_SERVICE_URL + USER_SERVICE_REGISTER, {
          email: this.email,
          username: this.username,
          password: this.password,
        })
        .then(() => {
          this.$router.push("/");
        })
        .catch((error) => {
          // TODO: Display error message to the user
          console.log(error.response.data.message);
        });
    },
    passwordMatch(v) {
      return v == this.passwordConfirm;
    },
  },
};
</script>
