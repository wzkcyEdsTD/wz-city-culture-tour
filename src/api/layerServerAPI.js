/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-09-09 16:21:53
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\layerServerAPI.js
 */
import axios from "axios";
const BASEURL = "https://sourceserver.wzcitybrain.com";
const serverInstanec = axios.create();
serverInstanec.defaults.baseURL = BASEURL;

/**
 * axios default
 * @param {*} url
 * @param {*} data
 */
const getAxios = (url = "", data = {}) => {
  return serverInstanec.request({ url, data, method: "get" }).then(res => {
    return res.data ? Promise.resolve(res.data) : Promise.reject(res);
  });
};

/**
 * 获取医院各类数据
 */
export const getMedicalList = () => {
  return getAxios("/statistics/getDataDic");
};
