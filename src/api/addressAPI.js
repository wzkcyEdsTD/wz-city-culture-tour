/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-09-09 16:21:53
 * @LastEditors: eds
 * @Description: 地名地址接口对接
 * @FilePath: \wz-city-culture-tour\src\api\layerServerAPI.js
 */
import axios from "axios";
const BASEURL = "http://10.36.133.219:8081/openServer/address/search";
const serverInstanec = axios.create();
serverInstanec.defaults.baseURL = BASEURL;

/**
 * axios default
 * @param {*} url
 * @param {*} data
 */
const getAxios = (data = {}, url = "") => {
    return serverInstanec.request({ url, data, method: "post" }).then(({ data }) => {
        return !data.code ? data.data : [];
    });
};

/**
 * 地名地址标准数据在线调用服务
 */
export const getAddressList = (address) => {
    return getAxios({ address, pageNum: 1, pageSize: 100 });
};