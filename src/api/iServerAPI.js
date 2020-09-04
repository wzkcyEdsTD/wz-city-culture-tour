/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-09-04 14:48:39
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\iServerAPI.js
 */
import axios from "axios";
const serverInstanec = axios.create();

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
 * 获取iserver指定数据集下所有别名
 * @param {*} url
 * @param {*} dataset
 */
export const getIserverFields = (url, dataset) => {
  const [dataName, dataSet] = dataset.split(":");
  const fieldURL = `${url}/datasources/${dataName}/datasets/${dataSet}/fields.json?returnAll=true`;
  return getAxios(fieldURL);
};
