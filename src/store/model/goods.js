const state = {
  goodData: {},
  //商品分类数据
  categoriesData: {}
}
const getters = {
  getGoodsData(state) {
    return state.goodData
  },
  getCategoriesData(state) {
    return state.categoriesData
  }
}
const mutations = {
  saveGoodsData(state, param) {
    state["goodData"] = param
  },
  saveCategoriesData(state, param) {
    state.categoriesData = param
  }
}
const actions = {
  saveGoodsData({ commit }, param) {
    commit("saveGoodsData", param);
  },
  saveCategoriesData({ commit }, param) {
    commit("saveCategoriesData", param);
  }
}


export default {
  state,
  getters,
  mutations,
  actions,
}