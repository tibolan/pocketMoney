<template>
  <main :class="loading ? 'loading' : ''">
    <!--    <h1><span>{{ name }}</span> <input type="month" v-model="date" max="2022-01" min="2021-12"></h1>-->

    <div style="text-align: center; margin: 10px 0">
      <input type="month" v-model="month">
    </div>
    <v-sheet height="auto" v-if="currentUser">
      <v-calendar
          ref="calendar"
          v-model="date"
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          type="month"
          :events="currentEvents"
          :event-height="20"
          @click:event="showDayDetails"
          @click:date="showDayDetails"
          :event-color="getEventColor"
          @change="getEvents"
      ></v-calendar>

      <v-dialog
          v-model="showCurrentDayDetails"
          max-width="500px"
      >
        <v-card>
          <v-card-title>
            Détail du {{ this.currentDayFormated }}
          </v-card-title>
          <v-card-text>
            <v-list
                two-line
            >

              <template v-if="currentDayAmends.length">
                <v-list-item
                    v-for="amend in currentDayAmends"
                    :key="amend._id"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ getReasonLabelByType(amend.type) }} : {{ toCurrency(amend.fee / 100) }}
                    </v-list-item-title>
                    <v-list-item-subtitle v-if="amend.comment">{{amend.comment}}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action v-if="parentMode">
                    <v-btn icon @click="deleteAmend(amend)">
                      <v-icon color="grey lighten-1">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
              <template v-else>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Pas de sanction ce jour, bravo !</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <template v-if="parentMode">
              <v-btn outlined @click="showCurrentDayDetails = false">
                Fermer
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn dark @click="showAmendDialog = true" v-if="parentMode">
                Ajouter
              </v-btn>
            </template>
            <template v-else>
              <v-spacer></v-spacer>
              <v-btn outlined @click="showCurrentDayDetails = false">
                Fermer
              </v-btn>
              <v-spacer></v-spacer>
            </template>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-dialog v-model="showAmendDialog">
        <v-card>
          <v-card-title>Ajouter une amende</v-card-title>
          <v-card-text>
            <pre>{{ amendType }}</pre>
            <v-select
                :items="amendsType"
                label="Catégorie"
                outlined
                v-model="amendType"
            ></v-select>
            <v-text-field outlined v-model="amendComment" label="Motif de l'amende"></v-text-field>
            <v-text-field outlined type="number" min="10" label="Montant en centimes"
                          v-model="amendValue"></v-text-field>
          </v-card-text>
          <v-card-actions class="align-center">
            <v-spacer></v-spacer>
            <v-btn color="black" dark class="lighten-5" @click="addAmend" :disabled="!(amendType && amendValue)">Ajouter</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>


    </v-sheet>


    <!--    <amend-grid :amends="currentAmends" :date="date"></amend-grid>-->
  </main>
</template>

<script>

import {mapState} from "vuex";
import dayjs from '../components/DateFR'
import toCurrency from "../components/toCurrency";

const today = dayjs()
const HSLToRGB = function (h, s, l) {
  // Must be fractions of 1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return "rgb(" + r + "," + g + "," + b + ")";
}
export default {
  name: "User",
  data () {
    return {
      user: null,
      date: today.format("YYYY-MM-DD").valueOf(),
      currentDay: null,
      showCurrentDayDetails: false,
      showAmendDialog: false,
      feeType: null,
      loading: false,
      code: null,
      month: today.format("YYYY-MM"),
      events: [],
      amendType: null,
      amendComment: "",
      amendValue: null
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
    },
    currentEvents () {
      let events = []
      const monthLength = dayjs(this.date).daysInMonth()
      for (let i = 1; i <= monthLength; i++) {
        let d = i < 10 ? `0${i}` : i
        events.push(this.createEvent({
          date: `${this.month}-${d}`
        }))
      }
      return events;
    },
    currentDayAmends () {
      if (this.currentDay) {
        return this.getAmendsByDate(this.currentDay)
      }
      return []
    },
    currentDayFormated () {
      return dayjs(this.currentDay).format('DD MMMM YYYY')
    },
    amendsType () {
      return this.referentials.map((item) => {
        return {
          text: item.label,
          value: item.type,
          fee: item.fee
        }
      })
    }
  },
  methods: {
    toCurrency,
    getReasonLabelByType (type) {
      let R = this.referentials.find(reason => reason.type === type)
      return R.label
    },
    showDayDetails (e) {
      this.currentDay = e.day.date
      this.showCurrentDayDetails = true
    },
    getEventColor (event) {
      let total = Math.max(event.total * 100, 0)
      if (total === 100) return "white"
      let color = HSLToRGB(Math.floor(total * 123 / 100), 100, 50)
      return color
    },
    getEvents (oDate) {
      this.date = oDate.start.date
    },
    getAmendsTotalByDate (date) {
      let amends = this.getAmendsByDate(date)
      let total = amends.reduce((acc, amend) => {
        return acc + Number(amend.fee)
      }, 0)
      return (100 - total) / 100
    },
    getAmendsByDate (date) {
      return this.currentUser.amends.filter(amend => amend.date === date)
    },
    createEvent (amend) {
      let d = dayjs(amend.date)
      let total = this.getAmendsTotalByDate(amend.date)
      return Object.assign({}, amend, {
        name: toCurrency(this.getAmendsTotalByDate(amend.date)),
        total,
        start: d.hour(0).minute(0).second(0).valueOf(),
        end: d.hour(23).minute(59).second(59).valueOf(),
        timed: false,
        mydate: today.format("YYYY-MM-DD")
      })
    },
    async addAmend () {
      await this.$store.dispatch('CREATE_AMEND', {
        type: this.amendType,
        date: this.currentDay,
        comment: this.amendComment,
        fee: this.amendValue
      })
      this.amendValue = null
      this.amendType = null
      this.amendComment = null
      this.showAmendDialog = false
      await this.$store.dispatch('REFRESH_USER')

    },
    async deleteAmend (amend) {
      await this.$store.dispatch('DELETE_AMEND', amend._id)
      await this.$store.dispatch('REFRESH_USER')
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
    },
    month () {
      this.date = `${this.month}-01`
    },
    amendType () {
      let amendType = this.referentials.find(amend => amend.type === this.amendType)
      this.amendValue = amendType.fee
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


.v-calendar .v-event {
  color: rgba(0, 0, 0, .7) !important;
  display: flex;
  width: 80% !important;
  margin: 0 auto 10% !important;

}

.v-calendar .v-event > div {
  margin: auto;
}

.v-list-item {
  padding: 0 !important;
}

</style>
