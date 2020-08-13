import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils'// eslint-disable-line

export function getSafeProduce() {
  // const url = 'http://10.10.0.2:9000/category/getSafeProduceMainByUser'
  const url = '/category/getSafeProduceMainByUser'
  return get(url, {})
}
