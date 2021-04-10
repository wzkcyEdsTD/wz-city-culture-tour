/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-09-07 16:32:04
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\cityBrainAPI.js
 */
import axios from "axios";
import { danbin } from "mock/sourceMock";
const instance = axios.create();
// instance.defaults.baseURL = BASEURL;
instance.defaults.method = "get";

/**
 * axios default
 * @param {*} code 
 * @param {*} data 
 * @param {*} method 
 */
const getAxios = (url = "", data = {}, method = "GET") => {
    return instance.request({
        url,
        params: data
    }).then(res => {
        return res.data ? Promise.resolve(JSON.parse(res.data.result)) : Promise.reject(res);
    });
};

export const getSourceData = ({ label, url }) => {
    if (label == '单兵设备') {
        return getAxios(url);
        // return danbin;
    }
}
