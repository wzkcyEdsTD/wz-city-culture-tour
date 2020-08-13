import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils'// eslint-disable-line

export function getnatural() {
  // const url = 'http://10.10.0.2:9000/category/getNatureDisasterByUser'
  const url = '/category/getNatureDisasterByUser'
  return get(url, {})
}

