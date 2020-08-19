import axios from "axios";


// 获取 token
export const getAccessToken = async () => {
  return axios.request({
    url: "https://api-hub.wenzhou.gov.cn/api/v1/oauth2/token?grant_type=client_credentials",
    method: 'post',
    headers: {
      'Authorization': 'Basic MUE3OThBODMyODJDNEQyODk1NkI5QzcyQkQxNzMxNUI6QzhCODE3RUUzMTAzNDRCN0I2OTkyQUNEMjlFOTRDQTQ='
    }
  }).then((res) => {
    return Promise.resolve(res)
  })
}


// 发热病人数
export const getFarebr = async (token) => {
  return axios.request({
    url: "https://api-hub.wenzhou.gov.cn/api/v1/data/100004005",
    method: 'post',
    headers: {
      'Authorization': `${token}`
    }
  }).then((res) => {
    return Promise.resolve(res)
  })
}
