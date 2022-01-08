import axios from "axios";
import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
axios.defaults.baseURL = "https://pocketmoneyapi.herokuapp.com/"

Vue.use(Vuex)

/* eslint-disable no-new */
const store = new Vuex.Store({
    // plugins: [createPersistedState()],
    modules: {},
    state: {
        referentials: null,
        currentUser: null,
        parentMode: null
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
            const user = await axios.get(`user/${name}`)
            context.commit('SET_USER', {user: user.data, name})
        },
        async REFRESH_USER (context) {
            const name = context.state.currentUser.name
            const user = await axios.get(`user/${name}`)
            context.commit('SET_USER', {user: user.data, name})
        },
        async CHECK_CODE (context, code) {
            const isValid = await axios.get(`check/${code}`)
            return isValid.data.status
        },
        async CREATE_AMEND (context, payload) {
            let config = {
                data: Object.assign({}, {user: context.state.currentUser.name}, payload),
                url: `/fee/${context.state.currentUser.name}/`,
                method: "post"
            }
            return axios(config)
        },
        async DELETE_AMEND (context, feeId) {

            let config = {
                url: `/fee/${feeId}/`,
                method: "delete"
            }

            if (confirm("Etes-vous sur de vouloir supprimer cette amende ?")) {
                return axios(config)

            }
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
