<template>
  <main :class="loading ? 'loading' : ''">
    <h1><span>{{ name }}</span> <input type="month" v-model="date" max="2022-01" min="2021-12"></h1>
    <amend-grid :amends="currentAmends" :date="date"></amend-grid>
  </main>
</template>

<script>

import dayjs from 'dayjs'
import {mapState} from "vuex";
import AmendGrid from "../components/AmendGrid";

const today = dayjs()
export default {
  name: "User",
  components: {AmendGrid},
  data () {
    return {
      user: null,
      date: today.format("YYYY-MM"),
      feeType: null,
      loading: false,
      code: null
    }
  },
  computed: {
    ...mapState(['referentials', 'currentUser', 'parentMode']),
    reasons () {
      return this.referentials.reasons
    },
    name () {
      if (!this.currentUser) return ""
      return this.currentUser.name
    },
    currentYear () {
      return this.date.split('-')[0]
    },
    currentMonth () {
      return this.date.split('-')[1] * 1
    },
    currentData () {
      if (!this.currentUser || !this.currentUser[this.date]) return {}
      return this.currentUser[this.date]
    },
    currentAmends () {
      if (this.loading) return []
      return this.currentUser.amends.filter((amend) => {
        let re = new RegExp(`^${this.date}`)
        return re.test(amend.date)
      })
    }
  },
  methods: {
    addFee () {
      this.$store.dispatch('SET_FEE', this.feeType)
    }
  },
  watch: {
    '$route.params.user': {
      immediate: true,
      async handler (name) {
        this.loading = true
        await this.$store.dispatch('GET_USER', name)
        this.loading = false
      }
    }
  }
}
</script>

<style>

.loading {
  opacity: 0.2;
}

h1 {
  text-transform: capitalize;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}

h1 input {
  width: auto;
}
</style>
