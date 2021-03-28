<template>
  <v-app>
    <v-navigation-drawer app permanent expand-on-hover>
      <v-list dense nav>
        <v-list-item
          v-for="(route, i) in routes"
          :key="i"
          link
          :to="route.path"
        >
          <v-list-item-icon>
            <v-icon>{{ route.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{ route.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>CATChat</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},
  computed: {
    routes() {
      // Change Nav Bar results depending on login status
      if (this.$store.state.email == "") {
        return [
          { path: "/", name: "Home", icon: "mdi-home" },
          { path: "/login", name: "Login", icon: "mdi-login" },
          { path: "/register", name: "Register", icon: "mdi-account-plus"},
          { path: "/about", name: "About", icon: "mdi-information" },
        ];
      } else {
        return [
          { path: "/", name: "Home", icon: "mdi-home" },
          { path: "/about", name: "About", icon: "mdi-information" },
          { path: "/convos", name: "Threads", icon: "mdi-view-list" },
          { path: "/new", name: "New Thread", icon: "mdi-comment-plus" },
        ];

      }
    },
  },
  // Put Link Here for Nav Bar
};
</script>
