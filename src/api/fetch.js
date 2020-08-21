import axios from "axios";
const BASEURL = "https://api-hub.wenzhou.gov.cn/api/v1";
const Authorization =
  "Basic MUE3OThBODMyODJDNEQyODk1NkI5QzcyQkQxNzMxNUI6QzhCODE3RUUzMTAzNDRCN0I2OTkyQUNEMjlFOTRDQTQ=";
axios.defaults.baseURL = BASEURL;
// 获取 token
export const getAccessToken = async () => {
  return axios
    .request({
      url: "/oauth2/token?grant_type=client_credentials",
      method: "post",
      headers: {
        Authorization
      }
    })
    .then(res => {
      return Promise.resolve(res);
    });
};

// 发热病人数 100004005
export const getFarebr = async token => {
  return axios
    .request({
      url: "/data/100004005",
      method: "post",
      headers: {
        Authorization: `${token}`
      },
    })
    .then(res => {
      return Promise.resolve(res);
    });
};

/**
 * 获取视频列表 100006019
 * @param {*} param0
 * @param {*} token
 */
export const getRtmpVideoList = async (geometry, token) => {
  return axios
    .request({
      url: "/data/100006019",
      method: "post",
      headers: {
        Authorization: `${token}`
      },
      data: { ...geometry }
    })
    .then(res => {
      return Promise.resolve(res);
    });
};

/**
 * 获取视频列表 100007059
 * @param {*} param0
 * @param {*} token
 */
export const getPopulation = async (geometry, token) => {
  return axios
    .request({
      url: "/data/100007059",
      method: "post",
      headers: {
        Authorization: `${token}`
      },
      data: { ...geometry }
    })
    .then(res => {
      return Promise.resolve(res);
    });
};
