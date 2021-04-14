/*
 * @Author: eds
 * @Date: 2020-08-20 09:03:09
 * @LastEditTime: 2020-09-07 16:32:04
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\cityBrainAPI.js
 */
import axios from "axios";
import { sha256 } from 'js-sha256'
import md5 from 'js-md5';
import { _BBOX_, _AREA_CODE_ } from "config/local/getuiInterfaceConfig"
const BASEURL = "https://webapi.getui.com/api";
const instance = axios.create();
instance.defaults.baseURL = BASEURL;
instance.defaults.method = "post";
const _APPKEY_ = "wenzhou_PAPI_wzsjj";
const _VERSION_ = "v1.0"
const _MASTER_SECERT_ = "dfd28b6141e6b19e7a20f7dde4a0020ec626034f7379abc79a8312a0f0a668f1470d26258f296cb3bd5c808bb3608d713d58d238a60569aa98bfa0b3fcb793ac";

/**
 * 捕捉器
 */
instance.interceptors.request.use(
    async config => {
        if (config.url != "/auth/creditAuth") {
            const timestamp = parseInt(+new Date() / 1000);
            const { data } = await getAxios("/auth/creditAuth", {
                appKey: _APPKEY_,
                timestamp,
                version: _VERSION_,
                sign: sha256(_APPKEY_ + md5(timestamp.toString()) + _MASTER_SECERT_) + _MASTER_SECERT_
            })
            config.headers["Access-Token"] = data.accessToken;
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
const getAxios = (url, data = {}, method = 'post') => {
    return instance.request({
        url, method,
        data,
    }).then(res => {
        return res.data ? Promise.resolve(res.data) : Promise.reject(res);
    });
};

/**
 * 车辆数盘 / 获取某区域车速及车数数据
 * /vehicle/dashboard/getRoadsData
 * @returns {Promise}
 */
export const getRoadsData = () => {
    return getAxios("/vehicle/dashboard/getRoadsData", {
        bbox: _BBOX_,
        code: _AREA_CODE_,
        type_limit: 60,
        zoom: 18
    });
};

/**
 * 根据 code 查询热力图
 * /population/count/getHeatMapByCode
 * @param {*} area_code 
 * @returns 
 */
export const getHeatMapByCode = (area_code = _AREA_CODE_) => {
    return getAxios("/population/count/getHeatMapByCode", {
        area_code,
    });
}
export const getHeatMapByGeometry = (ranges, area_code = _AREA_CODE_) => {
    return getAxios("/population/count/getHeatMapByCode", {
        area_code, ranges
    });
}

/**
 * 根据范围集返回
 * @param {*} ranges 
 * @param {*} area_code 
 * @returns 
 */
export const getHeatMapByRanges = (ranges, area_code = _AREA_CODE_) => {
    return getAxios("/population/count/getHeatMapByRanges", {
        area_code, ranges
    })
}

/**
 * 获取大屏统计
 * /vehicle/dashboard/getDashboardStat
 * @returns {Promise}
 */
export const getDashboardStat = () => {
    return getAxios("/vehicle/dashboard/getDashboardStat", {
        code: _AREA_CODE_,
    });
}

/**
 * 根据 code 查询职住数据
 * /population/count/getWorkData
 * @returns {Promise}
 */
export const getWorkData = () => {
    return getAxios("/population/count/getWorkData", {
        area_code: _AREA_CODE_,
    });
}

/**
 * 获取区县街道列表
 * /population/dashboard/getList
 * @returns {Promise}
 */
export const getAreaCodeList = () => {
    return getAxios("/population/dashboard/getList");
}