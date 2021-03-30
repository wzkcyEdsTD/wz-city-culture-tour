/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-09-09 16:21:53
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\layerServerAPI.js
 */
import axios from "axios";
import qs from 'qs';
const BASEURL = "https://sourceserver.wzcitybrain.com";
const serverInstanec = axios.create({
  headers: { 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8' }
});
serverInstanec.defaults.baseURL = BASEURL;

/**
 * axios default
 * @param {*} url
 * @param {*} data
 */
const getAxios = (url = "", data = {}, method = 'get') => {
  const option = { url, method };
  method == 'get' ? option.params = data : option.data = qs.stringify(data);
  return serverInstanec.request(option).then(res => {
    return res.data ? Promise.resolve(res.data) : Promise.reject(res);
  });
};

/**
 * 获取全市各模块数据
 * @param {*} type 
 * 1.交通
 * 2.医疗
 * 3.
 * 4.经济
 * 5.
 * 8.卡口
 * 11.重点景点流量数据
 * 12.应急体征
 */
const getWzKindsData = (type) => {
  return getAxios(`/statistics/GetCityBraainData?time=202008&type=${type}&businessType=1&workTime=20200101`)
}

/**
 * 获取医院各类数据
 */
export const getMedicalList = () => {
  return getAxios("/statistics/getDataDic");
};
/**
 * 获取周边分析点位 100021005
 * @param {*} obj 
 */
export const getAroundSourceAnalyse = (obj) => {
  return getAxios("/api/v1/resource/distance", obj, 'post');
};
/**
 * 获取卡口各类数据
 */
export const getBayonetList = () => {
  return getWzKindsData(8);
};

/**
 * 获取站点各类数据
 */
export const getStationList = () => {
  return getWzKindsData(9);
};

/**
 * 获取景点人流量数据
 */
export const getTourPointList = () => {
  return getWzKindsData(11)
};

/**
 * 获取全市总览数据
 */
export const fetchWzOverviewData = () => {
  return getWzKindsData(4)
}

/**
 * 获取全市人口数据
 */
export const fetchWzPeopleData = () => {
  return getWzKindsData(10)
}

/**
 * 获取全市医疗数据
 */
export const fetchMedicalData = () => {
  return getWzKindsData(2)
};

/**
 * 获取全市旅游数据
 */
export const fetchTourData = () => {
  return getWzKindsData(6)
};

/**
 * 获取全市应急数据
 */
export const fetchEmergencyData = () => {
  return getWzKindsData(12)
};

/**
 * 获取全市资源数据
 */
export const fetchSourceData = () => {
  return getWzKindsData(3)
};

/**
 * 获取全市基础数据
 */
export const fetchBasicData = () => {
  return getWzKindsData(7)
};

/**
 * 获取全市文化数据
 */
export const fetchCultureData = () => {
  return getWzKindsData(5)
};

/**
 * 获取全市交通数据
 */
export const fetchWzTrafficData = () => {
  return getWzKindsData(1)
}
