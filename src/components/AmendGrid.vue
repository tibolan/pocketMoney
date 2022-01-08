<template>
  <div>
    <div class="amendGrid">

      <div class="day th">Di</div>
      <div class="day th">Lu</div>
      <div class="day th">Ma</div>
      <div class="day th">Me</div>
      <div class="day th">Je</div>
      <div class="day th">Ve</div>
      <div class="day th">Sa</div>

      <template v-for="(day, index) of days">
        <div class="day" :key="index" :class="index === 0 ? `span-${firstDayOffset}`: ''"
             @click="openDay(`${day.date}`)">
          <div class="day-body">
            <span class="day-body-date">{{ index + 1 }}</span>
            <span class="day-body-total" :class="day.type">{{ toCurrency(day.earn) }}</span>
          </div>
        </div>
      </template>

      <div class="line">Total du mois: {{ toCurrency(monthTotal) }}</div>
    </div>
    <dialog class="amendGrid-detail" ref="dialog">
      <h1>Détail du {{ currentDay }}</h1>
      <h2>Gain du jour: {{ getAmendsTotalByDate(currentDay) }}</h2>
      <ul class="amends">
        <template v-for="(amend, index) of getAmendsByDate(currentDay)">
          <li :key="index">
            <amend-item :amend="amend"></amend-item>
          </li>
        </template>
      </ul>

      <ul class="actions">
        <li v-if="parentMode">
          <button @click="setFee" class="btn cta">Ajouter une amende</button>
        </li>
        <li>
          <button class="btn" @click="$refs.dialog.close()">Fermer</button>
        </li>
      </ul>


    </dialog>
    <dialog ref="fee" class="amendGrid-detail">
      <form method="dialog" @submit.stop.prevent="onSubmit" ref="form" autocomplete="off">
        <div>
          <label for="feeType">Type d'amende</label>
          <select v-model="feeType" id="feeType">
            <template v-for="reason of referentials">
              <option :value="reason.type" :key="reason.type">{{ reason.label }}</option>
            </template>
          </select>
        </div>
        <div v-if="feeType === 'FOR'">
          <label for="feeValue">Montant de l'amende</label>
          <input type="number" v-model="feeValue" id="feeValue" step="10" min="10">
        </div>
        <div>
          <label for="feeComment">Commentaires de l'amende</label>
          <textarea id="feeComment" maxlength="250" v-model="feeComment"></textarea>
        </div>
        <ul class="actions">
          <li>
            <button id="confirmBtn" type="submit" class="btn cta">Confirmer</button>
          </li>
          <li>
            <button class="btn" value="cancel" @click.stop.prevent="onClose">Fermer</button>
          </li>
        </ul>
      </form>
    </dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import {mapState} from "vuex";
import AmendItem from "./AmendItem";
import toCurrency from "./toCurrency";

const reducer = (previousValue, currentValue) => {
  return previousValue - currentValue.fee;
}
export default {
  name: "AmendGrid",
  components: {AmendItem},
  data () {
    return {
      currentDay: [],
      forfait: 0,
      feeType: "RAN",
      feeValue: null,
      feeComment: "",
      feeCode: null,
      error: false
    }
  },
  props: {
    amends: {
      type: Array,
      default () {
        return []
      }
    },
    date: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(['currentUser', 'referentials', 'parentMode']),
    dayjsDate () {
      return dayjs(this.date)
    },
    monthLength () {
      return this.dayjsDate.daysInMonth()
    },
    days () {
      let output = []
      for (let i = 1, total, date, day, jauge; i <= this.monthLength; i++) {
        day = i < 10 ? `0${i}` : i
        date = `${this.date}-${day}`
        total = this.getAmendsByDate(date).reduce(reducer, 100)
        jauge = Math.max(0, Math.round(total / 10) * 10)
        output.push({
          date,
          earn: total / 100,
          type: `p${jauge}`
        })
      }
      return output
    },
    firstDayOffset () {
      return dayjs(`${this.date}-01`).day()
    },
    monthTotal () {
      let win = this.monthLength * 100
      let lose = this.amends.reduce((old, amend) => old + Number(amend.fee), 0)
      return (win - lose) / 100
    }
  },
  methods: {
    getAmendsByDate (date) {
      return this.amends.filter(amend => amend.date === date)
    },
      getAmendsTotalByDate (date) {
        let amends = this.getAmendsByDate(date)
        let total = amends.reduce((acc, amend) => {
          return acc + Number(amend.fee)
        }, 0)
        return this.toCurrency((100 - total) / 100)
      },
    openDay (date) {
      this.currentDay = date
      this.$refs.dialog.showModal()
    },
    toCurrency,
    setFee () {
      this.$refs.fee.showModal()
    },
    getReasonLabelByType (type) {
      let R = this.referentials.find(reason => reason.type === type)
      return R.label
    },
    getReasonAmountByType (type) {
      if (type === 'FOR') return this.feeValue
      let R = this.referentials.find(reason => reason.type === type)
      return R.value
    },
    async onSubmit () {
      let isValid = this.parentMode
      if (isValid) {
        await this.$store.dispatch('CREATE_AMEND', {
          type: this.feeType,
          date: this.currentDay,
          comment: this.feeComment,
          fee: this.getReasonAmountByType(this.feeType)
        })
        await this.$store.dispatch('REFRESH_USER')
        this.onClose()
      }
    },
    onClose () {
      this.$refs.fee.close()
      this.$refs.form.reset()
      this.feeCode = null
    }
  }
}
</script>

<style>

.amendGrid {
  display: grid;
  grid-template-columns: repeat(7, calc(98% / 7));
  grid-template-rows: 40px repeat(6, calc(98vw / 7));
  max-width: 100%;
}

.amendGrid .line {
  grid-column: span 7;
}

.day {
  padding: 5px;
}

.day-body {
  border: 1px solid rgba(0, 0, 0, .2);
  padding: 5px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.day-body-date {
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 0.25rem;

}

.day-body-total {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  align-self: center;
  padding: 3px;
  min-width: 100%;
  text-align: center;
  color: white;
  font-weight: bold;
}

.day.th {
  border: none;
  font-weight: bold;
}

.amendGrid-detail {
  border: 4px solid var(--queen-blue);
  border-radius: 4px;
}

.amendGrid-detail li {
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

}

.amendGrid-detail .amends li {
  border: 1px solid rgba(0, 0, 0, .5);
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, .25);
}

.amendGrid-detail::backdrop {
  background-color: rgba(0, 0, 0, .8);
}

.amendGrid-detail .top {
  display: flex;
  justify-content: space-between;
}

.amendGrid-detail li span {
  font-size: 12px;
}

.amendGrid-detail .actions {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.amendGrid-detail .actions li {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.amendGrid-detail .actions li button:only-child {
  min-width: 100%;
}

.amendGrid-detail .actions li input {
  margin-left: 5px;
}

form {
  min-width: 300px;
}

form.formInline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

form > div {
  margin-bottom: 20px;
}

form label {
  display: block;
  text-align: left;
}

input, select, textarea {
  width: 100%;
  font-size: 14px;
  padding: 10px;
  box-sizing: border-box;
  resize: vertical;
  appearance: none;
  border: 2px solid rgba(0,0,0,.1);
}

form .invalid {
  border-color: var(--red-salsa)
}

.span-1 {
  grid-column: 1;
}

.span-2 {
  grid-column: 2;
}

.span-3 {
  grid-column: 3;
}

.span-4 {
  grid-column: 4;
}

.span-5 {
  grid-column: 5;
}

.span-6 {
  grid-column: 6;
}

.day-body-total.p100 {
  background-color: #66ff6e;
  color: #666
}

.day-body-total.p90 {
  background-color: #91FF66;
  color: #666
}

.day-body-total.p80 {
  background-color: #ABFF66;
  color: #666
}

.day-body-total.p70 {
  background-color: #C4FF66;
  color: #666
}

.day-body-total.p60 {
  background-color: #DEFF66;
  color: #666
}

.day-body-total.p50 {
  background-color: #F7FF66;
  color: #666
}

.day-body-total.p40 {
  background-color: #FFED66;
  color: #666
}

.day-body-total.p30 {
  background-color: #FFD166;
  color: #666
}

.day-body-total.p20 {
  background-color: #FFAB66;
  color: #666
}

.day-body-total.p10 {
  background-color: #FF8266;
  color: #666
}

.day-body-total.p0 {
  background-color: #FF6666;
  color: #666
}

.error {
  color: var(--red-salsa);
}

button.btn {
  border: 3px solid var(--queen-blue);
  color: var(--queen-blue);
  border-radius: 50px;
  padding: 5px 15px;
}

button.btn:disabled {
  opacity: 0.5;
}

button.cta {
  background-color: var(--queen-blue);
  color: var(--white);
}
</style>
