import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils'// eslint-disable-line

export function getPersonDense() {
  // const url = 'http://10.10.0.2:9000/category/getPersonDenseMainByUser'
  const url = '/category/getPersonDenseMainByUser'
  return get(url, {})
}
