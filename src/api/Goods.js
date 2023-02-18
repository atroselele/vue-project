import { get, post, put, del } from '@/utils/http'

/**
 * @description: 获取商品列表
 * @return {Object} Promise对象
 * @param {Object} params
 */
export const getGoods = params => get("goods", params)

/**
 * @description: 添加商品
 * @return {Object} Promise对象
 * @param {Object} params
 */
export const addGoods = params => post("goods", params)

/**
 * @description: 根据id查询商品
 * @return {Object} Promise对象
 * @param {Number} id
 */
export const findGoodsById = id => get(`goods/${id}`)
/**
 * @description: 编辑商品
 * @return {Object} Promise对象
 * @param {Object} params
 */
export const updateGoods = ({ id, params }) => put(`goods/${id}`, params)

/**
 * @description: 删除商品
 * @return {Object} Promise对象
 * @param {Number} id
 */
export const deleteGood = id => del("goods/" + id)

/**
 * @description: 获取商品分类列表
 * @return {Object} Promise对象
 * @param {Object} data 
 */
export const getCategoriesList = data => get("categories", data)

/**
 * @description: 添加商品分类
 * @return {Object} Promise对象
 * @param {Object} params 
 */
export const insertGoodsCate = params => post("categories", params)
/**
 * @description: 修改商品分类名称
 * @return {Object} Promise对象
 * @param {Object} params 
 */
export const editGoodsCateName = params => put(`categories/${params.cat_id}`, { cat_name: params.cat_name })

/**
 * @description: 删除商品分类
 * @return {Object} Promise对象
 * @param {Number} id
 */
export const deleteCate = id => del("categories/" + id)

/**
 * @description: 获取参数列表
 * @return {Object} Promise对象
 * @param {Object} params 
 */
export const getParams = params => get(`categories/${params.cat_id}/attributes`, { sel: params.attr_sel })
/**
 * @description: 添加动态参数或者静态属性
 * @return {Object} Promise对象
 * @param {Object} params 
 */
export const addParams = ({ cat_id, attr_name, attr_sel, attr_vals }) => post(`categories/${cat_id}/attributes`, { attr_name, attr_sel, attr_vals })
/**
 * @description: 编辑提交参数
 * @return {Object} Promise对象
 * @param {Object} params 
 */
export const editParams = ({ cat_id, attr_id, attr_name, attr_sel, attr_vals }) => put(`categories/${cat_id}/attributes/${attr_id}`, { attr_name, attr_sel, attr_vals: attr_vals.join(" ") })

/**
 * @description: 删除参数
 * @return {Object} Promise对象
 * @param {Object} params 
 */
export const removeParam = ({ cat_id, attr_id }) => del(`categories/${cat_id}/attributes/${attr_id}`)


export const findByIdParams = id => get(`categories/${id}`)