/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-08-31 09:26:08
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\config\index.js
 */
import axios from "axios";
const baseURL = "https://api-hub.wenzhou.gov.cn/api/v1";
const Authorization =
  "Basic MUE3OThBODMyODJDNEQyODk1NkI5QzcyQkQxNzMxNUI6QzhCODE3RUUzMTAzNDRCN0I2OTkyQUNEMjlFOTRDQTQ=";
const instance = axios.create({ baseURL, method: "post" });
instance.interceptors.request.use(
  async config => {
    console.log(config);
    // if (!config.url.match(/\/oauth/g)) {
    //   const accessToken = await getAccessToken();
    //   config.headers.common.Authorization = accessToken.data.access_token;
    // }
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// 获取 token
export const getAccessToken = () => {
  return instance
    .request({
      url: "/oauth2/token?grant_type=client_credentials",
      headers: {
        Authorization
      }
    })
    .then(res => {
      return Promise.resolve(res);
    });
};

// 发热病人数 100004005
export const getFarebr = async () => {
  return instance.request({ url: "/data/100004005" }).then(res => {
    return Promise.resolve(res);
  });
};

/**
 * 获取视频列表 100006019
 * @param {*} param0
 * @param {*} token
 */
export const getRtmpVideoList = async (geometry, dist) => {
  return instance
    .request({
      url: "/data/100006019",
      data: { ...geometry, dist }
    })
    .then(res => {
      return Promise.resolve(res.data.data);
    });
};

/**
 * 获取视频真实地址 100006020
 * @param {*} mp_id
 */
export const getRtmpVideoURL = async mp_id => {
  return instance
    .request({
      url: "/data/100006020",
      data: { mp_id }
    })
    .then(res => {
      return Promise.resolve(res.data.data);
    });
};
/**
 * 获取实施人口 100007059
 * @param {*} param0
 * @param {*} token
 */
export const getPopulation = async geometry => {
  return instance
    .request({
      url: "/data/100007059",
      data: { ...geometry, type: 2 }
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
};
