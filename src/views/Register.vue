<template>
  <v-container>
    <v-row>
      <v-spacer cols="3"></v-spacer>
      <v-col cols="6">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required
        ></v-text-field>
        <v-text-field
          v-model="username"
          :rules="usernameRules"
          label="Username"
          required
        ></v-text-field>
        <v-text-field
            v-model="password"
            :append-icon="show1? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="show1 ? 'text' : 'password'"
            label="Password"
            counter
            @click:append="show1 = !show1"
        ></v-text-field>
        <v-text-field
            v-model="passwordConfirm"
            :rules="passwordConfirmRules"
            :append-icon="show2? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            label="Confirm Password"
            counter
            @click:append="show2 = !show2"
        ></v-text-field>
        <v-btn
          block
          x-large
          color="primary"
          v-bind:disabled="isDisabled"
          @click="submit"
          >Register</v-btn
        >
      </v-col>
      <v-spacer cols="3"></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { USER_SERVICE_REGISTER, USER_SERVICE_URL } from "../constants";

export default {
  name: "Register",
  components: {},
  data: () => ({
    email: "",
    emailRules: [(v) => v.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) != null],
    username: "",
    usernameRules:  [(v) => v.length > 4, (v) => v.length < 12],
    password: "",
    passwordRules: [(v) => v.length > 8],
    passwordConfirm: "",
    show1: false,
    show2: false
  }),
  computed: {
    isDisabled: function () {
      return this.email == "" || this.password == "" || (this.emailRules.filter(rule => !rule(this.email)).length != 0)
    },
    passwordConfirmRules: function() {
      return [(v)=> v == this.password]
    }
  },
  methods: {
    submit() {

        axios.post(USER_SERVICE_URL + USER_SERVICE_REGISTER, {
          email: this.email,
          username: this.username,
          password: this.password,
        }).then(() => {
          this.$router.push("/");
        }).catch((error) => {
          // TODO: Display error message to the user
          console.log(error.response.data.message);
        })
        
    },
    passwordMatch(v) {
      return v == this.passwordConfirm
    }
  }
};
</script>
