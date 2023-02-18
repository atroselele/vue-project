import { setUserInfo, setToken } from '@/utils/cookieHandle'
import { handlerByLogin } from "@/api/login"

const state = {
  username: "",
  token: "",
}

const getters = {
  getUserName(state) {
    return state.username;
  }
}
const mutations = {
  /* 存储 token 用户信息 */
  saveToken(state, pal) {
    state.token = pal.token;
    state.username = pal.username;
    setToken(pal.token);
    setUserInfo(pal.username)
  }
}

const actions = {
  toLogin({ commit }, pal) {
    return new Promise((resolve, reject) => {
      handlerByLogin(pal).then(res => {
        /* 存储 token */
        commit("saveToken", res.data);
        resolve(res)
      }).catch(err => {
        // alert("账号或密码错误")
        reject(err)
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}