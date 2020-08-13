import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils'// eslint-disable-line

export function getWaterProject() {
  // const url = 'http://10.10.0.2:9000/category/getCityFireMainByUser'
  const url = '/category/getWaterProjectMainByUser'
  return get(url, {})
}

export function getWaterProjectMainByUserOH() {
  const url = '/category/getWaterProjectMainByUserOH'
  return get(url, {})
}

// 龙港getWaterProjectMainByUserLW
export function getWaterProjectMainByUserLG() {
  const url = '/category/getWaterProjectMainByUserLG'
  return get(url, {})
}

// 龙湾
export function getWaterProjectMainByUserLW() {
  const url = '/category/getWaterProjectMainByUserLW'
  return get(url, {})
}

// 乐清市
export function getWaterProjectMainByUserLQS() {
  const url = '/category/getWaterProjectMainByUserLQS'
  return get(url, {})
}

// 洞头区
export function getWaterProjectMainByUserDTQ() {
  const url = '/category/getWaterProjectMainByUserDTQ'
  return get(url, {})
}

// 泰顺县
export function getWaterProjectMainByUserTSX() {
  const url = '/category/getWaterProjectMainByUserTSX'
  return get(url, {})
}
