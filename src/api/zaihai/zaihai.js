/**
 * map接口
 */
import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils' // eslint-disable-line

/**
 * 列表查询
 * @returns {*}
 */
export function queryByTypeTime(pageNo, pageSize, time, type, caseName) {
  const url = '/smartcase/smartCase/queryByTypeTime'
  return get(url, { pageNo, pageSize, time, type, caseName })
}

/**
 * 详情
 * @param pageNo
 * @param pageSize
 * @param time
 * @param type
 * @returns {*}
 */
export function queryById(id) {
  const url = '/plan/smartPlan/queryById'
  return get(url, { id })
}
