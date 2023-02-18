import { get, post, put, del } from '@/utils/http'

/*
 * @description: 获取左侧菜单栏数据
 * @return {Object} Promise对象
 */
export const getMenuList = () => get("menus")

/**
 * @description: 获取管理员列表
 * @return {Object} Promise对象
 * @param {Object} params
 */
export const getUsers = params => get("users", params)

/**
 * @description: 修改管理员状态
 * @return {Object} Promise对象
 * @param {Object} data
 */
export const changeState = data => put(`users/${data.uId}/state/${data["type"]}`)

/**
 * @description: 新增管理员用户
 * @return {Object} Promise对象
 * @param {Object} data
 */
export const insertUser = data => post('users', data)
/**
 * @description: 修改管理员信息
 * @return {Object} Promise对象
 * @param {Object} data
 */
export const updateUserInfo = data => put(`users/${data.id}`, { email: data.email, mobile: data.mobile })
/**
 * @description: 删除管理员
 * @return {Object} Promise对象
 * @param {Number} id
 */
export const deleteUser = id => del(`users/${id}`)

/**
 * @description: 用户分配角色
 * @return {Object} Promise对象
 * @param {Number} id
 */
export const distrRoles = data => put(`users/${data.id}/role`, { rid: data.rid })

