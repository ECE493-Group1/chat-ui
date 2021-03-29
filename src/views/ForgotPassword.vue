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
        <v-btn
          block
          x-large
          color="primary"
          v-bind:disabled="isDisabled"
          @click="submit"
          >Request</v-btn
        >
      </v-col>
      <v-spacer cols="3"></v-spacer>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { USER_SERVICE_URL, USER_SERVICE_FORGOT_PASSWORD } from "../constants";

export default {
  name: "ForgotPassword",
  components: {},
  data: () => ({
    email: "",
    emailRules: [(v) => v.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) != null],
  }),
  computed: {
    isDisabled: function () {
      return this.email == "" || (this.emailRules.filter(rule => !rule(this.email)).length != 0)
    }
  },
  methods: {
    submit() {
      axios.post(USER_SERVICE_URL + USER_SERVICE_FORGOT_PASSWORD, {
        email: this.email
      }).then(() => {
        this.$router.push("/");
        // TODO: Display success message to the user
      }).catch((error) => {
        // TODO: Display error message to the user
        console.log(error.response.data.message);
      })
        
    }
  }
};
</script>
