import axios from 'axios'
// import router from '@/router'
import { MessageBox } from 'element-ui'
import { commonParams } from 'api/config'

function count() {
  let num = 0
  return {
    getNum() {
      return num
    },
    addNum() {
      num += 1
      return num
    },
    clearNum() {
      num = 0
      return num
    }
  }
}

const countNum = count()
// 请求发送拦截，把数据发送给后台之前做些什么......
axios.interceptors.request.use((config) => {
  config.baseURL = ''
  config.withCredentials = true // 允许携带token ,这个是解决跨域产生的相关问题
  config.timeout = 60000
  const token = sessionStorage.getItem('access_token')
  if (token) {
    // return config
    config.headers = {
      'access-token': token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  if (config.url === 'refresh') {
    config.headers = {
      'refresh-token': sessionStorage.getItem('refresh_token'),
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  if (!config.headers['X-Requested-With']) {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
  }
  return config
}, function(error) {
  return Promise.reject(error)
})
// 请求返回拦截，把数据返回到页面之前做些什么...
axios.interceptors.response.use((response) => {
  // countNum()
  // console.log(document.getElementsByClassName('el-message').length)
  if (response.data.success) {
    // 成功的情况 直接返回
    if (response.data.code === '403') {
      countNum.addNum()
      if (countNum.getNum() === 1) {
        MessageBox.alert('用户身份已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          showClose: 'false',
          callback: action => {
            window.location.href = 'http://' + window.location.host + '/logout'
          }
        })
      }
    }
    return response.data.result
  } else {
    if (response.data.code === '403') {
      countNum.addNum()
      if (countNum.getNum() === 1) {
        MessageBox.alert('用户身份已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          showClose: 'false',
          callback: action => {
            window.location.href = 'http://' + window.location.host + '/logout'
          }
        })
      }
    } else {
      // Message.error({
      //   message: response.data.message,
      //   showClose: true,
      //   offset: [80],
      //   duration: 1000
      // })
    }
    return response.data
  }
  // return Promise.reject(data.message)
}, function(error) {
  console.log(error)
  if (error.data.code === '403') {
    countNum.addNum()
    if (countNum.getNum() === 1) {
      MessageBox.alert('用户身份已失效，请重新登录', '提示', {
        confirmButtonText: '确定',
        showClose: 'false',
        callback: action => {
          window.location.href = 'http://' + window.location.host + '/logout'
        }
      })
    }
  } else {
    // Message.error({
    //   message: error.message,
    //   showClose: true,
    //   offset: [80],
    //   duration: 1000
    // })
  }
  return Promise.reject(error)
})
// var oldRequest = axios.request
// axios.request = function request(config) {
//   var self = this
//   return new Promise(function(resolve, reject) {
//     console.log('请求开始')
//     oldRequest.call(self, config).then(
//       function(response) {
//         console.log(response)
//         if (response.data && response.data.code === '403' && response.data.redirect) {
//           console.log('原始请求- 发现 CAS 客户端未登录')
//           const url = response.data.redirect + '&method=POST'
//           axios.get(url, {
//             withCredentials: true,
//             responseType: 'document'
//           }).then(function(ssoResponse) {
//             var form = ssoResponse.data.getElementsByTagName('form')
//             if (form) {
//               form = form[0]
//               if (form.getAttribute('id') === 'fm1') {
//                 console.log('获取ticket 失败 ，CAS 服务端未登录')
//                 ssoResponse.message = '获取ticket 失败 ，CAS 服务端未登录'
//                 reject(ssoResponse)
//                 // alert('请在弹出窗口完成登录后，再进行操作')
//                 // window.open(response.data.redirect.substring(0, response.data.redirect.indexOf('?')))
//                 window.location.reload()
//               } else if (form.getAttribute('name') === 'acsForm' && form.getElementsByTagName('input')) {
//                 var join = config.url.indexOf('?') > 0 ? '&' : '?'
//                 config.url = config.url + join + 'ticket=' + form.getElementsByTagName('input')[0].value
//                 axios.request(config).then(function(withLoginResponse) {
//                   console.log('获取ticket 成功，再次请求数据')
//                   resolve(withLoginResponse)
//                 }).catch(function(err) {
//                   reject(err)
//                 })
//               }
//             }
//           })
//         } else {
//           console.log(response)
//           resolve(response.data.result)
//         }
//       },
//       function(error) {
//         reject(error)
//       }
//     ).catch(err => {
//       console.log(err)
//     })
//   })
// }
// 公共的post方法
export function post(url, data) {
  return axios.request({ url: url, data: data, method: 'post' }).then((res) => {
    return Promise.resolve(res)
  })
}

// 公共的get方法
export function get(url, data) {
  const allData = Object.assign({}, commonParams, data)
  return axios.request({
    url: url,
    method: 'get',
    params: allData
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// POST 方法封装  (参数处理)
export function postRequest(url, params) {
  return axios({
    method: 'post',
    url: url,
    data: params,
    transformRequest: [function(data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// POST 方法封装  (文件上传)
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
//  GET 方法封装
export const getRequest = (url) => {
  return axios({
    method: 'get',
    url: url
  })
}
//  PUT 方法封装
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: url,
    data: params
    // transformRequest: [function(data) {
    //   let ret = ''
    //   for (const it in data) {
    //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    //   }
    //   return ret
    // }]
  })
}
//  DELETE 方法封装
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: url
  })
}
