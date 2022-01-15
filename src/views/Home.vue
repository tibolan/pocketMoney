<template>

  <v-container>
    <v-flex >
      <v-simple-table dense class="planning">
        <template v-slot:default>
          <caption>Planning des repas</caption>
          <thead>
          <tr>
            <th></th>
            <th scope="col">Midi</th>
            <th scope="col">Soir</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">Lundi</th>
            <td></td>
            <td class="sousou">Swann</td>
          </tr>
          <tr>
            <th scope="row">Mardi</th>
            <td></td>
            <td class="zad">Zadig</td>
          </tr>
          <tr>
            <th scope="row">Mercredi</th>
            <td class="sousou">Swann</td>
            <td class="zad">Zadig</td>
          </tr>
          <tr>
            <th scope="row">Jeudi</th>
            <td></td>
            <td class="sousou">Swann</td>
          </tr>
          <tr>
            <th scope="row">Vendredi</th>
            <td></td>
            <td class="zad">Zadig</td>
          </tr>
          <tr>
            <th scope="row">Samedi</th>
            <td class="sousou">Swann</td>
            <td class="zad">Zadig</td>
          </tr>
          <tr>
            <th scope="row">Dimanche</th>
            <td class="zad">Zadig</td>
            <td class="sousou">Swann</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-flex>
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
  border-collapse: collapse;
  caption-side: top;

  caption {
    font-size: 1.3rem;
    padding-bottom: 0.75em;
  };

  th {
    font-weight: bold !important;
    font-size: .9em !important;
  }

  th, td {
    padding: 2px !important;
    text-align: center !important;
    // border: 1px solid rgba(0,0,0,.3);
    // border-left: none;
    text-transform: lowercase;
  }

  th:first-of-type {
    // border-left: 1px solid rgba(0,0,0,.3);
  }
}

.zad {
  background-color: rgba(0,0,0,.05);
}
.sousou {
  background-color: rgba(0,0,0,.1);
}
</style>
