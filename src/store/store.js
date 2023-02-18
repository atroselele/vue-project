import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import user from './model/user'
import menu from './model/menu'
import users from './model/users'
import rights from './model/rights'
import goods from './model/goods'
import orders from './model/orders'

export const store = new Vuex.Store({
  state: {
    token: user.state.token
  },
  getters: {

  },
  mutations: {

  },
  modules: {
    user,
    menu,
    users,
    rights,
    goods,
    orders
  }
})