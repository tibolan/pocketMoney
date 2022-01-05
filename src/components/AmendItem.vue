<template>
  <div class="amend">
    <div class="amend-region">
      <span class="amend-type">{{ amendTypeLabel }}</span>
      <span class="amend-comment">{{ amend.comment }}</span>
    </div>
    <div class="amend-region">
      <button class="amend-type" v-if="parentMode" @click="deleteAmend">X</button>
      <span class="amend-value">{{ amendValue }}</span>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import toCurrency from "./toCurrency";

export default {
  name: "AmendItem",
  props: {
    amend: {
      required: true
    }
  },
  computed: {
    ...mapState({
      reasons: "referentials",
      parentMode: 'parentMode'
    }),
    amendTypeLabel () {
      return this.reasons.find(reason => reason.type === this.amend.type).label
    },
    amendValue () {
      return toCurrency(this.amend.fee / 100)
    }
  },
  methods: {
    async deleteAmend () {
      await this.$store.dispatch('DELETE_AMEND', this.amend._id)
      await this.$store.dispatch('REFRESH_USER')
    }
  }
}
</script>

<style>
.amend {
  display: flex;
  justify-content: space-between;
}

.amend-region {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.amend-region:last-of-type {
  align-items: flex-end;
}

.amend-type {
  font-weight: bold;
}

.amend-comment {
  font-style: italic;
  margin: 5px 0 0;
  text-align: left;
}

.amend-value {
  margin: 5px 0 0;
}

</style>
