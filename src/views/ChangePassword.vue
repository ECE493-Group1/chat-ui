<template>
  <div v-if="!isFetchingVerification">
    <div v-if="linkVerified">
      <v-container>
        <v-row>
          <v-spacer cols="3"></v-spacer>
          <v-col cols="6">
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
              >Submit</v-btn>
          </v-col>
          <v-spacer cols="3"></v-spacer>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <div class="body-1 text-center">
        This link is no longer valid.
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { USER_SERVICE_URL, USER_SERVICE_CHANGE_PASSWORD, USER_SERVICE_VERIFY_RESET_TOKEN } from "../constants";

export default {
  name: "ChangePassword",
  components: {},
  data: () => ({
    password: "",
    passwordRules: [(v) => v.length > 8],
    passwordConfirm: "",
    show1: false,
    show2: false,
    isFetchingVerification: true,
    linkVerified: false
  }),
  computed: {
    isDisabled: function () {
      return this.password == "" || this.passwordConfirm == "" || !this.passwordMatch(this.password)
    },
    passwordConfirmRules: function() {
      return [(v)=> v == this.password]
    }
  },
  methods: {
    submit() {
      axios.post(USER_SERVICE_URL + USER_SERVICE_CHANGE_PASSWORD, {
        reset_token: this.$route.params.token,
        new_password: this.password,
      }).then(() => {
        this.$router.push("/");
        // TODO: Display success message to the user
      }).catch((error) => {
        // TODO: Display error message to the user
        console.log(error.response.data.message);
      })
    },
    passwordMatch(v) {
      return v == this.passwordConfirm
    }
  },
  created() {
    axios.post(USER_SERVICE_URL + USER_SERVICE_VERIFY_RESET_TOKEN, {
        reset_token: this.$route.params.token
      }).then(() => {
        this.linkVerified = true;
      }).catch(() => {
        this.linkVerified = false;
      }).finally(() => {
        this.isFetchingVerification = false;
      });
  }
};
</script>
