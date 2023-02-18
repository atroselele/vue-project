const state = {
  userList: {}
}
const getters = {
  getUserList(state) {
    return state.userList
  }
}
const mutations = {
  saveUsersData(state, pal) {
    state.userList = pal
  }
}
const actions = {
  saveUsersData({ commit }, pal) {
    commit("saveUsersData", pal)
  }
}

export default {
  namespace: true,
  state,
  getters,
  mutations,
  actions
}