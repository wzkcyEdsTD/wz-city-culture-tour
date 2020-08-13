import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils'// eslint-disable-line

export function getOldBuild() {
  // const url = 'http://10.10.0.2:9000/category/getCityFireMainByUser'
  const url = '/category/getOldBuildMainByUser'
  return get(url, {})
}

// 鹿城区建设工程
export function getOldBuildMainByUserLcq() {
  // const url = 'http://10.10.0.2:9000/category/getCityFireMainByUser'
  const url = '/category/getOldBuildMainByUserLcq'
  return get(url, {})
}
