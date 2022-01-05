<template>
  <div id="app">
    <header id="nav">
      <ul>
        <li>
          <router-link to="/user/zadig">Zadig</router-link>
        </li>
        <li>
          <router-link to="/user/swann">Swann</router-link>
        </li>
      </ul>
    </header>
    <router-view/>
    <footer>
      <p>Mode parent</p>
      <form @submit.prevent.stop="onParentModeActivated" v-if="!parentMode" class="formInline">
        <div>
          <input type="password" v-model="code" id="code" placeholder="code" :class="codeError ? 'invalid' : ''" @focus="codeError = false">
        </div>
        <div>
          <button class="btn cta" type="submit" :disabled="!code">Activer</button>
        </div>
      </form>
      <form @submit.prevent.stop="onParentModeDeactivated" v-else>
        <div>
          <button class="btn cta" type="submit">Désactiver</button>
        </div>
      </form>
    </footer>
  </div>
</template>
<script>
import {mapState} from "vuex";

export default {
  name: 'app',
  data () {
    return {
      code: null,
      codeError: false
    }
  },
  computed: {
    ...mapState(['parentMode'])
  },
  methods: {
    async onParentModeActivated () {
      let ok = await this.$store.dispatch('SET_PARENT_MODE', this.code)

      if (!ok) {
        this.codeError = true
      } else {
        this.codeError = false
      }
      this.code = null
    },
    onParentModeDeactivated () {
      this.$store.commit('SET_PARENT_MODE', false)
    }
  }
}
</script>
<style>

html, body {
  --red-salsa: #f94144;
  --orange-red: #f3722c;
  --yellow-orange-color-wheel: #f8961e;
  --maize-crayola: #f9c74f;
  --pistachio: #90be6d;
  --zomp: #43aa8b;
  --queen-blue: #577590;
  --black: #333333;
  --grey: #fff;
  --white: #ffffff;

  padding: 0;
  margin: 0;
  box-sizing: border-box;
  background-color: #ffffff;
  color: var(--queen-blue);
  min-height: 100vh;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #577590;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

header, footer {
  padding: 10px;
}

#app main {
  flex: 1;

}

ul, ol, li {
  padding: 0;
  margin: 0;
  list-style: none;
}

#nav {
  padding: 10px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#nav ul {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 0;
  margin: 0;
}



#nav li {
  padding: 0;
  margin: 0;
  list-style: none;
  margin: 0 5px 0;
  color: var(--zomp)
}


#nav a {
  font-weight: bold;
  color: var(--queen-blue);
}

#nav a.router-link-exact-active {
  color: var(--zomp)
}
</style>
