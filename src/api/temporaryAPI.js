/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-09-07 16:32:04
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\cityBrainAPI.js
 */
import axios from "axios";
import { getDate } from 'common/js/util'
const BASEURL = "http://10.36.217.144:9009/api";
const instance = axios.create();
instance.defaults.baseURL = BASEURL;
instance.defaults.method = "get";

/**
 * axios default
 * @param {*} code 
 * @param {*} data 
 * @param {*} method 
 */
const getAxios = (url, data = {}) => {
    return instance.request({
        url,
        params: data
    }).then(res => {
        return res.data ? Promise.resolve(res) : Promise.reject(res);
    });
};

/**
 * 获取近一天事件信息
 */
export const getEventData = () => {
    const endTime = new Date();
    return getAxios("/designImpl", {
        startTime: getDate(new Date(endTime.getTime() - 24 * 3600 * 1000)),
        endTime: getDate(endTime),
        onlyCount: false
    }, "GET");
};

/**
 * 获取近day天事件数量
 * @param {number} day 
 */
export const getEventCount = (day = 1) => {
    const endTime = new Date();
    return getAxios("/designImpl", {
        startTime: getDate(new Date(endTime.getTime() - day * 24 * 3600 * 1000)),
        endTime: getDate(endTime),
        onlyCount: true
    }, "GET");
};