<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list color="secondary">
          <v-subheader>Add Members</v-subheader>
          <v-list-item v-for="(member, i) in members" :key="i">
            <v-list-item-title>{{ member }}</v-list-item-title>
            
            <v-list-item-action>
              <v-btn icon @click="remove(i)">
                <v-icon color="grey lighten-1">mdi-close-circle</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AddMembers",
  props: {
    members: Array,
  },
  data: () => ({
    newUserName: ""
  }),
  methods: {
    add: function () {
      this.members.push(this.newUserName);
      this.newUserName = "";
    },
    remove: function (index) {
      this.members.splice(index, 1)
    }
  },
};
</script>