const state = {
  ordersData: {},

}
const getters = {
  getOrdersData(state) {
    return state.ordersData
  },

}
const mutations = {
  saveOrdersData(state, param) {
    state["ordersData"] = param
  },

}
const actions = {
  saveOrdersData({ commit }, param) {
    commit("saveOrdersData", param);
  },

}


export default {
  state,
  getters,
  mutations,
  actions,
}