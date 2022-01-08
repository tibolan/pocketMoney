<template>
  <v-app>
    <v-app-bar
        app
        dark
        class="lighten-5"
    >
      <div class="d-flex align-center">
        <v-btn
            icon
            to="/"
        >
          <v-img
              alt="Vuetify Logo"
              class="shrink mr-2"
              contain
              src="/logo.png"
              transition="scale-transition"
              width="40"
          />
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <h1 class="text-h6">{{$route.params.user ? $route.params.user : "PocketMoney"}}</h1>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

    <v-bottom-navigation>
      <v-btn
          class="lighten-5"
          active-class="dark"
          :to="{name: 'user', params: {user: 'zadig'}}"
      >ZADIG
      </v-btn>

      <v-btn
          class="lighten-5"
          active-class="dark"
          :to="{name: 'user', params: {user: 'swann'}}"
      >SWANN
      </v-btn>


      <template v-if="parentMode">
        <v-btn
            color="success"
            class="lighten-2"
            @click="removeParentMode"
        >OT
        </v-btn>
      </template>
      <template v-else>
        <v-dialog
            v-model="askParentModeActivated"
            max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                color="red"
                class="lighten-2"
            >OT
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              Mode parent
            </v-card-title>
            <v-card-text>
              <v-otp-input
                  length="4"
                  type="password"
                  label="Code secret de la CIA"
                  id="CIA"
                  required
                  v-model="code"
                  :error="codeError"
              ></v-otp-input>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  outlined
                  @click="askParentModeActivated = false"
              >Fermer</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                  dark
                  @click="checkParentCode">Activer</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>


    </v-bottom-navigation>
  </v-app>
</template>

<script>

import {mapState} from "vuex";

export default {
  name: 'App',

  data: () => ({
    askParentModeActivated: false,
    code: null,
    codeError: false
  }),
  computed: {
    ...mapState(['parentMode'])
  },
  methods: {
    askParentMode () {
      this.askParentModeActivated = true
    },
    async checkParentCode () {
      let ok = await this.$store.dispatch('SET_PARENT_MODE', this.code)
      this.code = null
      if (!ok) {
        this.codeError = true
      } else {
        this.codeError = false
        this.askParentModeActivated = false
      }
    },
    async removeParentMode () {
      await this.$store.commit('SET_PARENT_MODE', false)
    }
  }
};
</script>
<style lang="scss">
root {
  --baseColor: #FFCDD2
}
#CIA {
  font-size: 24px;
}
</style>
