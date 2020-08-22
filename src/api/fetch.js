/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-08-22 20:47:41
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\fetch.js
 */
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
      }
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
export const getRtmpVideoList = async (geometry, dist, token) => {
  return axios
    .request({
      url: "/data/100006019",
      method: "post",
      headers: {
        Authorization: `${token}`
      },
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
export const getRtmpVideoURL = async (mp_id, token) => {
  return axios
    .request({
      url: "/data/100006020",
      method: "post",
      headers: {
        Authorization: `${token}`
      },
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
export const getPopulation = async (geometry, token) => {
  return axios
    .request({
      url: "/data/100007059",
      method: "post",
      headers: {
        Authorization: `${token}`
      },
      data: { ...geometry, type: 2 }
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
};
