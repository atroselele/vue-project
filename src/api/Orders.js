import { get, post, put, del } from '@/utils/http'

/**
 * @description: 获取商品分类列表
 * @return {Object} Promise对象
 * @param {Object} params 
 */
export const getOrderList = params => get("orders", params)

/**
 * @description: 查询物流信息
 * @return {Object} Promise对象
 * @param {Number} id
 */
export const getLogisticInfo = id => get(`kuaidi/${id}}`)

/**
 * @description: 修改收获地址
 * @return {Object} Promise对象
 * @param {Object} params 
 */
export const editHarvest = ({ order_id, consignee_addr }) => put(`${order_id}/address`, { consignee_addr })


