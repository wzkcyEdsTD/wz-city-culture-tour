// import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils'// eslint-disable-line

// export function getArrange(district, staffNos, dutyDate, week, times, staffNames) {
//   // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//   const url = 'http://pshyz.f3322.net:9000/dutyArrange/'
//   // const url = 'http://192.168.1.45:9000/dutyArrange/getMonthList'
//   console.log(1111)
//   return post(url, { district, staffNos, dutyDate, week, times, staffNames })
// }
// console.log(getArrange)

import axios from "axios"// eslint-disable-line
// axios.interceptors.request.use(function (config) {
//   let token = localStorage.getItem("token")
//   config.headers['authorization'] = token
// })
// const service =axios.create({
//   baseURL:'/',
//   timeout:10000,
//   withCredentials:true
// }),
export const getArrange = (district, staffNos, dutyDate, week, times, staffNames) => axios({
  url: "http://pshyz.f3322.net:9000/dutyArrange/",// eslint-disable-line
  method: 'post',
  timeout: 10000,
  header: {"Cookie": "2D111E635E54164620D5B050FF17D71A"},// eslint-disable-line
  data: {
    district,
    staffNos,
    dutyDate,
    week,
    times,
    staffNames
  }
})
