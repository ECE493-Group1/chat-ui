<template>
  <div class="home" v-if="loggedIn">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-h2 text-center">Your CATChat Account</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
            <div class="text-h4 text-center">
              Username: {{this.username}}
            </div>
        </v-col>
        <v-col cols="6">
          <div class="text-h4 text-center">
            Email: {{this.email}}
          </div>
        </v-col>
        <v-spacer cols="2"></v-spacer>
      </v-row>
      <v-row>
        <v-spacer cols="4"></v-spacer>
        <v-col cols="4">
          <v-btn center block color="primary">Logout
            <v-icon right dark>mdi-logout</v-icon>
          </v-btn>
        </v-col>
        <v-spacer cols="4"></v-spacer>
      </v-row>
    </v-container>
    

  </div>
  <div v-else>
    <div class="text-h2 text-center">Please Login To CATChat</div>
  </div>
</template>
<style scoped>
.text-h2{
  margin: 20px;
}
</style>
<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {},
  computed: {
    loggedIn: function() {
      return this.$store.state.isLoggedIn
    },
    email: function() {
      return this.$store.state.email
    },
    username: function() {
      return this.$store.state.username
    }
  }
}
</script>
