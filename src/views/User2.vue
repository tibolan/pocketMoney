<template>
  <v-container :class="loading ? 'loading' : ''">
    <!--    <h1><span>{{ name }}</span> <input type="month" v-model="date" max="2022-01" min="2021-12"></h1>-->
    <div style="text-align: center; margin: 10px 0">
      <input type="month" v-model="month" min="2021-12" :max="month">
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



      <div class="d-flex justify-center py-10">
        <span>Montant gagné ce mois:</span>
        <strong class="pl-2">{{toCurrency(monthTotal)}}</strong>
      </div>
    </v-sheet>


    <drawer v-model="showCurrentDayDetails" class="pa-5">
      <v-list
          two-line
          class="mx-auto"
          max-width="400px">

        <template v-if="currentDayAmends.length">
          <v-list-item
              v-for="amend in currentDayAmends"
              :key="amend._id"
              class="px-5"
          >
            <v-list-item-content>
              <v-list-item-title>{{ getReasonLabelByType(amend.type) }} : {{ toCurrency(amend.fee / 100) }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="amend.comment">{{ amend.comment }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action v-if="parentMode">
              <v-flex>
                <v-btn icon @click="openAmendForm(amend)">
                  <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deleteAmend(amend)">
                  <v-icon color="grey lighten-1">mdi-delete</v-icon>
                </v-btn>
              </v-flex>
            </v-list-item-action>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-center">Pas de sanction ce jour, bravo ! 👍👍👍</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-list-item v-if="parentMode" class="px-5" :dense="true" tile two-line>
          <v-list-item-content>
            <v-list-item-action>
              <v-spacer></v-spacer>
              <v-btn icon dark color="black" @click="openAmendForm()" v-if="parentMode">
                <v-icon color="grey lighten-1">mdi-plus</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item-content>
        </v-list-item>

      </v-list>

      <div class="d-flex">
        <template >

        </template>
      </div>
    </drawer>
    <drawer v-model="showAmendDialog" @input="onAmendDialogToggle">
      <v-card>
        <v-card-title v-if="!editMode">Ajouter une amende</v-card-title>
        <v-card-title v-else>Modifier une amende</v-card-title>
        <v-card-text>
          <v-select
              :items="amendsType"
              label="Catégorie"
              outlined
              v-model="amendType"
          ></v-select>
          <v-text-field outlined v-model="amendComment" label="Motif de l'amende"></v-text-field>
          <v-text-field outlined type="number" min="10" label="Montant en centimes" step="10"
                        v-model="amendValue"></v-text-field>
        </v-card-text>
        <v-card-actions class="align-center">
          <v-spacer></v-spacer>
          <template v-if="editMode">
            <template v-if="amendType && amendValue">
              <v-btn color="black" dark @click="editAmend">Modifier</v-btn>
            </template>
            <template v-else>
              <v-btn disabled>Modifier</v-btn>
            </template>
          </template>
          <template v-else>
            <template v-if="amendType && amendValue">
              <v-btn color="black" dark @click="addAmend">Ajouter</v-btn>
            </template>
            <template v-else>
              <v-btn disabled>Ajouter</v-btn>
            </template>
          </template>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </drawer>
  </v-container>
</template>

<script>

import {mapState} from "vuex";
import dayjs from '../components/DateFR'
import Drawer from "../components/Drawer";
import HSL2RGB from "../components/HSL2RGB";
import toCurrency from "../components/toCurrency";

const today = dayjs()

export default {
  name: "User",
  components: {Drawer},
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
      amendValue: null,
      amendId: null,
      editMode: false
    }
  },
  computed: {
    ...mapState(['referentials', 'currentUser', 'parentMode']),
    amends () {
      return this.referentials.amends
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
        let evt = this.createEvent({
          date: `${this.month}-${d}`
        })
        if (evt) {
          events.push(evt)
        }
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
      if (!this.referentials) return []
      return this.referentials.amends.map((item) => {
        return {
          text: item.label,
          value: item.type,
          fee: item.fee
        }
      })
    },
    monthTotal () {
      return this.currentEvents.reduce((previousValue, item) => previousValue + item.total, 0)
    }
  },
  methods: {
    toCurrency,
    getReasonLabelByType (type) {
      let R = this.referentials.amends.find(reason => reason.type === type)
      return R.label
    },
    showDayDetails (e) {
      let day = e.event ? e.day : e
      console.log(day)
      if (day.future) {
        return false
      }
      this.currentDay = day.date
      this.showCurrentDayDetails = true
    },
    getEventColor (event) {
      let total = event.total * 100
      if (total === this.referentials.parameters.rewardByDay) return HSL2RGB(123, 100, 80)
      let color = HSL2RGB((63  + total), 100, 80)
      return color
    },
    getEvents (oDate) {
      this.date = oDate.start.date
    },
    getAmendsTotalByDate (date) {
      let amends = this.getAmendsByDate(date)
      let total = amends.reduce((acc, amend) => {
        return acc - Number(amend.fee)
      }, 0)

      if (total < 0) {
        return total / 100
      } else {
        return this.referentials.parameters.rewardByDay / 100
      }
    },
    getAmendsByDate (date) {
      return this.currentUser.amends.filter(amend => amend.date === date)
    },
    createEvent (amend) {
      let d = dayjs(amend.date)
      if (d.isAfter(today)) {
        return false
      }
      let total = this.getAmendsTotalByDate(amend.date)
      console.log(total)
      return Object.assign({}, amend, {
        name: toCurrency(this.getAmendsTotalByDate(amend.date)),
        total,
        start: d.hour(0).minute(0).second(0).valueOf(),
        end: d.hour(23).minute(59).second(59).valueOf(),
        timed: false,
        mydate: today.format("YYYY-MM-DD")
      })
    },
    async openAmendForm (amend) {
      if (amend) {
        this.amendType = amend.type
        this.amendComment = amend.comment
        this.amendValue = amend.fee
        this.amendId = amend._id
        this.editMode = true
      }
      this.showAmendDialog = true
    },
    closeAmendForm () {
      this.amendType = null
      this.amendComment = null
      this.amendValue = null
      this.amendId = null
      this.editMode = false
      this.showAmendDialog = false
    },
    async addAmend () {
      await this.$store.dispatch('CREATE_AMEND', {
        type: this.amendType,
        date: this.currentDay,
        comment: this.amendComment,
        fee: this.amendValue
      })
      this.closeAmendForm()
      await this.$store.dispatch('REFRESH_USER')

    },
    async deleteAmend (amend) {
      await this.$store.dispatch('DELETE_AMEND', amend._id)
      await this.$store.dispatch('REFRESH_USER')
    },
    async editAmend () {
      await this.$store.dispatch('UPDATE_AMEND', {
        comment: this.amendComment,
        fee: this.amendValue,
        _id: this.amendId
      })
      this.closeAmendForm()
      await this.$store.dispatch('REFRESH_USER')
    },
    onAmendDialogToggle () {
      console.log('onAmendDialogToggle', this.showAmendDialog)
      if (!this.showAmendDialog) {
        this.closeAmendForm()
      }
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
      if (this.editMode) return
      if (this.amendType) {
        let amendType = this.referentials.amends.find(amend => amend.type === this.amendType)
        this.amendValue = amendType.fee
      } else {
        this.amendValue = null
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
