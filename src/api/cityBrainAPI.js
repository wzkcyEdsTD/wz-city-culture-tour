/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-09-07 16:32:04
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\cityBrainAPI.js
 */
import axios from "axios";
const BASEURL = "https://sourceserver.wzcitybrain.com/statistics/ProxyGetCityBraainData";
const instance = axios.create();
instance.defaults.baseURL = BASEURL;
instance.defaults.method = "get";
/**
 * axios default
 * @param {*} url
 * @param {*} data
 */
const getAxios = (code = "", data = {}) => {
  return instance.request({
    url: "",
    params: { params: JSON.stringify(data), code, systype: 1 }
  }).then(res => {
    return res.data ? Promise.resolve(JSON.parse(res.data.result)) : Promise.reject(res);
  });
};

/**
 * 获取雪亮所有视频点
 */
export const getRtmpVideoAll = () => {
  return getAxios("100007018");
};
/**
 * 获取视频列表 100006019
 * @param {*} param0
 * @param {*} token
 */
export const getRtmpVideoList = (geometry, dist) => {
  return getAxios("100006019", { ...geometry, dist });
};
/**
 * 获取视频真实地址 100006020
 * @param {*} mp_id
 */
export const getRtmpVideoURL = mp_id => {
  return getAxios("100006020", { mp_id });
};
/**
 * 获取实施人口 100007059
 * @param {*} param0
 * @param {*} token
 */
export const getPopulation = geometry => {
  return getAxios("100007059", { ...geometry, type: 2 });
};
/**
 * [概览]已接入健康数据共享平台的医疗机构数	100002050
 * [先不用,数据为0]
 */
export const getWzAllMedicalInstitution = () => {
  return getAxios("100002050");
};
/**
 * [概览]当日实时门诊人次 100002034
 * @param {string} areaCode 区域代码 暂不明确
 */
export const getWzAllOutpatientCount = () => {
  return getAxios("100002034", { areaCode: "330300000000" });
};
/**
 * [概览]定点医院家数	100004121
 */
export const getWzAllDesignatedHospitals = () => {
  return getAxios("100004121");
};
/**
 * [概览]医保参保单位数	100005051
 */
export const getWzAllMedicalInsuranceInstitution = () => {
  return getAxios("100005051");
};
/**
 * [概览]	医保支付额	100004125
 */
export const getWzAllMedicalInsurancePayment = () => {
  return getAxios("100004125");
};
