import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils'// eslint-disable-line

export function getCityFire() {
  const url = '/category/getCityFireMainByUser'
  return get(url, {})
}

/**
 * 高层建筑
 * @returns {*}
 */
export function getDistrictBuildingByUser() {
  const url = '/category/getDistrictBuildingByUser'
  return get(url)
}

