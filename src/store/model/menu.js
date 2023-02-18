const state = {
  menuList: []
}
const getters = {
  getMenuListData(state) {
    return state["menuList"];
  }
}

const mutations = {
  setMenuListData(state, pal) {
    state["menuList"] = pal
  }
}

const actions = {
  setMenuListData({ commit }, pal) {
    commit("setMenuListData", pal);
  }
}


export default {
  state, getters, mutations, actions
}