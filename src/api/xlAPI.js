/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-09-07 16:32:04
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\cityBrainAPI.js
 */
import axios from "axios";
const BASEURL = "https://sourcelayer.wzcitybrain.com:8010/xl";
const instance = axios.create();
instance.defaults.baseURL = BASEURL;
instance.defaults.method = "POST";
const LOGIN_CONFIG = {
    MACAddr: " ",
    pwd: "ef73781effc5774100f87fe2f437a435",
    uaccount: "caizheng@wz"
}

/**
 * 捕捉器
 */
instance.interceptors.request.use(
    async config => {
        if (config.url != "/login") {
            const { data } = await getAxios("/login", LOGIN_CONFIG)
            const { token, uid } = data;
            config.data = { ...config.data, token, uid }
        }
        return config;
    },
    err => {
        // 请求超时!
        return Promise.reject(err);
    }
);

/**
 * axios default
 * @param {*} code 
 * @param {*} data 
 * @param {*} method 
 */
const getAxios = (url, data = {}, method = 'POST') => {
    return instance.request({
        url, method,
        data,
    }).then(res => {
        return res.data ? Promise.resolve(res.data) : Promise.reject(res);
    });
};

/**
 * 雪亮登录
 * /login
 * @returns {Promise}
 */
export const xlLogin = () => {
    return getAxios("/login", LOGIN_CONFIG)
};

/**
 * 根据mp_id获取m3u8地址
 * /population/count/getHeatMapByCode
 * @param {*} area_code 
 * @returns 
 */
export const xlHLS = (MpID) => {
    return getAxios("/HlsVideo", { MpID });
}