<template>
  <v-bottom-sheet v-model="model" content-class="$class">
    <v-sheet>
      <slot></slot>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
export default {
  name: "Drawer",
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  props: {
    value: {
      type: Boolean
    }
  }
}
</script>

<style scoped>

</style>
