import Cookie from 'js-cookie'
const SyeToken = "syeToken";
const UserInfo = "userInfo"

/* 设置Token */
export const setToken = token => Cookie.set(SyeToken, token, { expires: 7 })
/* 获取Token */
export const getToken = () => Cookie.get(SyeToken);
/* 移除Token */
export const removeToken = () => Cookie.remove(SyeToken);

/* 设置用户信息 */
export const setUserInfo = userInfo => Cookie.set(UserInfo, userInfo, { expires: 7 })
/* 获取用户信息 */
export const getUserInfo = () => Cookie.get(UserInfo);
/* 移除用户信息 */
export const removeUserInfo = () => Cookie.remove(UserInfo);

/* 设置Cookie */
export const setCookie = (key, value) => Cookie.set(key, value, { expires: 7 })
/* 获取Cookie */
export const getCookie = key => Cookie.get(key);
/* 移除Cookie */
export const removeCookie = key => Cookie.remove(key);

