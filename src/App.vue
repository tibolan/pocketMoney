<template>
  <v-app>

    <v-app-bar
        color="white"
        elevate-on-scroll
        scroll-target="#scrolling-techniques-7"
    >
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              plain
              icon
              v-bind="attrs"
              v-on="on"
              outlined
              :color="`${parentMode ? 'red' : 'green'}`"
          >
            <v-app-bar-nav-icon  @xxx-click="menuOpen = !menuOpen"></v-app-bar-nav-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>
              <v-btn
                  plain
                  :to="{name: 'user', params: {user: 'zadig'}}"
              >ZADIG</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn
                  plain
                  :to="{name: 'user', params: {user: 'swann'}}"
              >SWANN</v-btn>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <v-btn
                  plain
                  :color="parentMode ? 'red' : ''"
                  @click="toggleParentMode"
              >Mode Parent</v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-toolbar-title class="pl-5">{{$route.params.user ? $route.params.user : "PocketMoney"}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn :to="{name: 'home'}" link plain>
        <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="/logo.png"
            transition="scale-transition"
            width="40"
        />
      </v-btn>
    </v-app-bar>

    <v-main>
     <router-view/>
    </v-main>

    <v-snackbar
        v-model="showSnack"
        color="red lighten-2"
        :timeout="100000000"
        style="z-index:1;"
    >Mode parent actif
      <template v-slot:action="{ attrs }">
        <v-btn
            color="black"
            text
            v-bind="attrs"
            @click="removeParentMode"
        >Désactiver</v-btn>
      </template>
    </v-snackbar>

    <drawer v-model="askParentModeActivated">
      <v-card @keydown.enter="checkParentCode">
        <v-card-title>
          Mode parent
        </v-card-title>
        <v-card-text>
          <v-text-field
              length="4"
              type="password"
              inputmode="numeric"
              label="Code secret de la CIA"
              id="CIA"
              required
              autofocus
              v-model="code"
              :error="codeError"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
              outlined
              @click="askParentModeActivated = false"
          >Fermer</v-btn>
          <v-spacer></v-spacer>
          <v-btn
              dark
              color="black"
              @click="checkParentCode">Activer</v-btn>
        </v-card-actions>
      </v-card>
    </drawer>
  </v-app>
</template>

<script>

import {mapState} from "vuex";
import Drawer from "./components/Drawer";

export default {
  name: 'App',
  components: {Drawer},
  data: () => ({
    askParentModeActivated: false,
    code: null,
    codeError: false,
    menuOpen: true
  }),
  computed: {
    ...mapState(['parentMode']),
    showSnack: {
      get () {
        return this.parentMode
      },
      set (value) {
        console.log(value)
      }

    }
  },
  methods: {
    toggleParentMode () {
      if (this.parentMode) {
        this.removeParentMode()
      } else {
        this.askParentModeActivated = true
      }
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
.v-sheet.panel {
  position: absolute;
  left: 0;
  top: 0;
  // background-color: red !important;
  z-index: 0;
  transition: transform 300ms ease-in;

  &.close {
    transform: translateX(-100%);
  }
  &.open {
    transform: translateX(0%);
  }
}
</style>
