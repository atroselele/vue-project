import { get, post, put, del } from '@/utils/http'

/**
 * @description: 获取权限列表
 * @return {Object} Promise
 */
export const getRightsData = type => get("rights/" + type)
/**
 * @description: 获取角色列表
 * @return {Object} Promise
 */
export const getRolesList = () => get("roles")

/**
 * @description: 添加角色
 * @return {Object} Promise
 * @param {Object} data
 */
export const insertRoles = data => post("roles", data)
/**
 * @description: 编辑角色
 * @return {Object} Promise
 * @param {Object} data
 */
export const updateRoles = data => put(`roles/${data.id}`, { roleName: data.roleName, roleDesc: data.roleDesc })

/**
 * @description: 删除角色
 * @return {Object} Promise
 * @param {Number} id
 */
export const deleteRoles = id => del(`roles/${id}`)

/**
 * @description: 移除角色管理权限
 * @return {Object} Promise
 * @param {Object} data
 */
export const removeRolesRights = data => del(`roles/${data.roleId}/rights/${data.rightId}`)


/**
 * @description: 更新角色权限
 * @return {Object} Promise
 * @param {Object} data
 */
export const updateRolesRight = data => post(`roles/${data.id}/rights`, { rids: data.checkedAllId.join(",") })
