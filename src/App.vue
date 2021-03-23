<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list
        dense
        nav
        temporary
      >
        <v-list-item
          v-for="(route, i) in routes"
          :key="i"
          link
          :to="route.path"
        >
          <v-list-item-content>
            <v-list-item-title >
              {{route.name}}
            </v-list-item-title>
            
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="primary"
      dark
    >
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
import {routes} from './router/index.js';

export default {
  name: 'App',

  components: {},

  data: () => ({
    "routes": routes,
  }),
};
</script>
