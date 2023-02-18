import { get, post } from '@/utils/http'

/**
 * @description: 用户登录
 * @return {Object} Promise
 * @param {Object} userInfo 账号密码
 */
export const handlerByLogin = userInfo => post("/login", userInfo)


