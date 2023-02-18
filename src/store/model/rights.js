const state = {
  rightsList: [],
  rolesList: [],
  rightsTree: {}
}
const getters = {


  getRightsList(state) {
    return state.rightsList;
  },
  getRolesList(state) {
    return state.rolesList;
  },
  getRightsTree(state) {
    return state.rightsTree;
  }

}
const mutations = {
  setRightsList(state, param) {
    state.rightsList = param;
  },
  setRolesList(state, param) {
    state.rolesList = param;
  },
  saveRightsTree(state, param) {
    state.rightsTree = param;
  }
}
const actions = {
  setRightsList({ commit }, param) {
    commit("setRightsList", param)
  },
  setRolesList({ commit }, param) {
    commit("setRolesList", param)
  },
  saveRightsTree({ commit }, param) {
    commit("saveRightsTree", param)
  }

}

export default {
  state, getters, mutations, actions
}