import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils'// eslint-disable-line

export function getRoad() {
  // const url = 'http://10.10.0.2:9000/category/getCityFireMainByUser'
  const url = '/category/getRoadMainByUser'
  return get(url, {})
}

/**
 * 道路隐患
 * @returns {*}
 */
export function roadHazards() {
  // const url = 'http://10.10.0.2:9000/category/getCityFireMainByUser'
  const url = '/category/roadHazards'
  return get(url, {})
}

/**
 * 道路运输-瑞安
 * @returns {*}
 */
export function getRoadMainByUserRA() {
  // const url = 'http://10.10.0.2:9000/category/getCityFireMainByUser'
  const url = '/category/getRoadMainByUserRA'
  return get(url, {})
}

/**
 * 道路运输-鹿城区
 * @returns {*}
 */
export function getRoadMainByUserRCQ() {
  // const url = 'http://10.10.0.2:9000/category/getCityFireMainByUser'
  const url = '/category/getRoadMainByUserRCQ'
  return get(url, {})
}
