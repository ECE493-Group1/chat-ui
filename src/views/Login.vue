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
            v-model="password"
            :append-icon="show? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            label="Password"
            counter
            @click:append="show = !show"
        ></v-text-field>
        <v-btn
          block
          x-large
          color="primary"
          v-bind:disabled="isDisabled"
          @click="submit"
          >Login</v-btn
        >
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
    emailRules: [(v) => v.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) != null],
    password: "",
    show: false
  }),
  computed: {
    isDisabled: function () {
      return this.email == "" || this.password == "" || (this.emailRules.filter(rule => !rule(this.email)).length != 0)
    },
  },
  methods: {
    submit() {
      axios.post(USER_SERVICE_URL + USER_SERVICE_LOGIN, {
        email: this.email,
        password: this.password,
      }).then((response) => {
        this.$router.push("/")
        this.$store.state.email = this.email
        this.$store.state.username = this.email.split('@')[0]
        this.$store.state.isLoggedIn = true
        this.$store.state.authToken = response.data.token
      }).catch((error) => {
        // TODO: Display error message to the user
        console.log(error.response.data.message)
      })

    },
  }
};
</script>
