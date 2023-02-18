import axios from 'axios'
import { Loading, Message } from 'element-ui';
import { getToken } from './cookieHandle'
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASEURL,
  timeout: 6000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
})
/* 添加请求拦截器 => 前端给后端的参数【还没到后端响应】 */
let loadingInstance = null;
instance.interceptors.request.use(request => {
  //每次请求获取token值 保存到请求头的 Authorization属性
  request.headers.Authorization = getToken();
  // 在发送请求之前做些什么
  loadingInstance = Loading.service({
    text: "加载中",
    fullscreen: true,
    spinner: "el-icon-loading"
  });

  return request;
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});


let timer = null
function reaction(msg, status) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    Message({
      message: msg,
      center: true,
      duration: 3000,
      type: String(status).startsWith(2) ? "success" : "error"
    })
  }, 500)
}

/* 添加响应拦截器 => 后端给前端的数据【后端返回给前端的东西】 */
instance.interceptors.response.use(response => {
  loadingInstance.close();
  return new Promise((resolve, reject) => {
    const { msg, status } = response.data.meta
    // 对响应数据做点什么
    switch (status) {
      case 200:
        reaction(msg, status)
        resolve(response.data)
        break;
      case 201:
        reaction(msg, status)
        resolve(response.data)
        break;
      case 204:
        reaction(msg, status)
        resolve(response.data)
        break;
      default:
        reaction(msg, status)
        reject(response);
        break;
    }
  })
}, error => {
  // 对响应错误做点什么
  if (error.response) {
    switch (error.response.status) {
      case 401://未授权
        alert("未授权")
        break;
      case 403://被禁止访问
        alert("被禁止访问")
        break;
      case 404://请求的资源不存在
        alert("请求的资源不存在")
        break;
      case 422://创建一个对象时，发生一个验证错误
        alert("创建一个对象时，发生一个验证错误")
        break;
      case 500://内部错误
        break;
      default:
        break;
    }
    return Promise.reject(error);
  } else {
    reaction
  }
});
/**
 * @description: get方法，对应get请求
 * @return {promise} Promise
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const get = (url, params = {}) => instance.get(url, { params });

/**
 * @description: post方法，对应 post请求
 * @return {Object} Promise
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 */
export const post = (url, data = {}) => instance.post(url, data)

/**
 * @description: put方法，对应 put请求
 * @return {Object} Promise
 * @param {*} url [请求的url地址]
 * @param {*} data [请求时携带的参数]
 */
export const put = (url, data = {}) => instance.put(url, data)

/**
 * @description: del方法，对应 delete请求
 * @return {Object} Promise
 * @param {*} url [请求的url地址]
 * @param {*} data [请求时携带的参数]
 */
export const del = (url, data = {}) => instance.delete(url, data)


// 最终返回的对象
export default instance
