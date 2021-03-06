import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User2.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/user/:user',
    name: 'user',
    component: User
  },
  {
    path: '/planning-des-repas',
    name: 'mealPlanning',
    component: () => import(
        /* webpackChunkName: "meal" */
        '../views/mealPlanning')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
