import axios from "axios";
import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
if ("tibolan.herokuapp.com" === location.host) {
    axios.defaults.baseURL = "https://pocketmoneyapi.herokuapp.com/"
} else {
    axios.defaults.baseURL = "http://localhost:3000/"
}
Vue.use(Vuex)

/* eslint-disable no-new */
const store = new Vuex.Store({
    // plugins: [createPersistedState()],
    modules: {},
    state: {
        referentials: {
            amends: [],
            deposits: [],
            parameters: {}
        },
        currentUser: null,
        parentMode: false
    },
    mutations: {
        SET_REFERENTIAL (state, refs) {
            state.referentials = refs
        },
        SET_USER (state, payload) {
            state.currentUser = Object.assign({}, {name: payload.name}, payload.user)
        },
        SET_PARENT_MODE (state, value) {
            state.parentMode = value
        }
    },
    actions: {
        async GET_REFERENTIALS (context) {
            const refs = await axios.get('/referentials')
            context.commit('SET_REFERENTIAL', refs.data)
        },
        async GET_USER (context, name) {
            if (!name) {
                name = context.state.currentUser.name
            }
            const user = await axios.get(`users/${name}`)
            /*const amends = await axios.get(`amends?user=${name}`)
            user.data.amends = amends.data
            const deposits = await axios.get(`deposits?user=${name}`)
            user.data.deposits = deposits.data*/
            context.commit('SET_USER', {user: user.data, name})
        },
        async CHECK_CODE (context, code) {
            const isValid = await axios.get(`check/${code}`)
            return isValid.data.status
        },
        async CREATE_AMEND (context, payload) {
            let config = {
                data: Object.assign({}, {user: context.state.currentUser.name}, payload),
                url: `/amends`,
                method: "post"
            }
            return axios(config)
        },
        async UPDATE_AMEND (context, amend) {
            console.log("UPDATE_AMEND", amend)
            let id = amend._id
            delete amend._id
            let config = {
                data: Object.assign({}, amend),
                url: `/fee/${context.state.currentUser.name}/${id}`,
                method: "put"
            }
            return axios(config)
        },
        async DELETE_AMEND (context, feeId) {

            let config = {
                url: `/amends/${feeId}/`,
                method: "delete"
            }

            if (confirm("Etes-vous sur de vouloir supprimer cette amende ?")) {
                return axios(config)

            }
        },
        async GET_AMEND (context, filter) {
            let config = {
                url: `/amends/filter`,
                method: "post",
                data: filter
            }
            return axios(config)
        },
        async CREATE_DEPOSIT (context, payload) {
            let config = {
                data: Object.assign({}, {user: context.state.currentUser.name}, payload),
                url: `/deposits`,
                method: "post"
            }
            return axios(config)
        },
        async SET_PARENT_MODE (context, code) {
            let isValid = await context.dispatch('CHECK_CODE', code)
            if (isValid) {
                context.commit('SET_PARENT_MODE', true)
                return true
            }
            context.commit('SET_PARENT_MODE', false)
            return false

        }
    }
})

export default store
