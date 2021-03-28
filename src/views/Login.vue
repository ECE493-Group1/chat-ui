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
        this.$store.state.email = this.email
        // TODO Make a request to actual login
        this.$store.state.username = this.email.split('@')[0]
        this.$store.state.isLoggedIn = true
        this.$router.push("/")
    },
  }
};
</script>
