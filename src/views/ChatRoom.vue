<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-list>
         <v-list-item
            v-for="(message, i) in messages"
            :key="i"
          >
            <v-list-item-title>{{message.content}}</v-list-item-title>
            <v-list-item-subtitle>{{message.from}}</v-list-item-subtitle>
         </v-list-item>
        </v-list>
      </v-col>
    </v-row>
      
    <v-row>
      <v-col cols="10">
        <v-text-field
          label="Main input"
          :rules="rules"
          hide-details="auto"
        ></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-btn>
          Send
        </v-btn>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script>
  export default {
    name: 'ChatRoom',

    data: () => ({
      "messages":[
        {"from": "Dinula", "content": "Hi"},
        {"from": "Ryan", "content": "Poop"},
        {"from": "Bob", "content": "asdjf"},
      ],
    }),
  }
</script>
