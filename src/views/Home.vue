<template>

  <v-container class="fill-height justify-start align-start" tag="section">
    <v-simple-table dense class="planning">
      <template v-slot:default>
        <caption>Planning des repas</caption>
        <thead>
        <tr>
          <th></th>
          <th scope="col">Lu</th>
          <th scope="col">Ma</th>
          <th scope="col">Me</th>
          <th scope="col">Je</th>
          <th scope="col">Ve</th>
          <th scope="col">Sa</th>
          <th scope="col">Di</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">Z</th>
          <td></td>
          <td class="diner sm1"></td>
          <td class="diner"></td>
          <td></td>
          <td class="diner"></td>
          <td class="diner"></td>
          <td class="meal"></td>
        </tr>
        <tr>
          <th scope="row">S</th>
          <td class="diner"></td>
          <td></td>
          <td class="meal"></td>
          <td class="diner"></td>
          <td></td>
          <td class="meal"></td>
          <td class="diner"></td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
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
<style lang="scss">
.planning {
  width: 100%;
  th, td {
    padding: 2px !important;
    text-align: center !important;
  }
}

.diner {
  background-color: rgba(0,0,0,.2);

  &:after {
    content: 'S'
  }
}
.meal {
  background-color: rgba(0,0,0,.1);

  &:after {
    content: 'M'
  }
}
</style>
