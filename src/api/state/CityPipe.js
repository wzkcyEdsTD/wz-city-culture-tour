import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils'// eslint-disable-line

export function getCityPipe() {
  // const url = 'http://10.10.0.2:9000/category/getCityFireMainByUser'
  const url = '/category/getCityPipeMainByUser'
  return get(url, {})
}
