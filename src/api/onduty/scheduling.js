import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils'// eslint-disable-line

export function getSchedul(startTime, endTime) {
  const url = 'http://pshyz.f3322.net:9000/dutyArrange/'
  // const url = 'http://192.168.1.45:9000/dutyArrange/getMonthList'
  return get(url, { startTime, endTime })
}
