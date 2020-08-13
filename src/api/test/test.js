/**
 * map接口
 */
import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils' // eslint-disable-line

/**
 * 列表查询
 * @returns {*}
 */
export function test(next) {
  const url = '/home/index/learn_more'
  return get(url, { next })
}
