<template>

  <v-container class="fill-height" tag="section">
    <v-row>
      <v-col style="text-align: center;">
        <v-btn
            fab
            color="pink"
            class="lighten-5"
            elevation="24"
            x-large
            @click="goToUserPage('zadig')"
        >Z
        </v-btn>
      </v-col>
      <v-col style="text-align: center;">
        <v-btn
            fab
            color="pink"
            class="lighten-5"
            elevation="24"
            x-large
            @click="goToUserPage('swann')"
        >S
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'Home',
  methods: {
    goToUserPage (name) {
      this.$router.push({
        name: "user",
        params: {
          user: name
        }
      })
    }
  }
}
</script>
