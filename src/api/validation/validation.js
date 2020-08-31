/*
 * @Author: eds
 * @Date: 2020-08-31 15:27:32
 * @LastEditTime: 2020-08-31 15:55:02
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\validation\validation.js
 */
import axios from "axios";
import validationObject from "./config";
const { signURL, validationURL, validationJson } = validationObject;

/**
 * [API] 自家后端生成专班签名
 * @return {object} sign/timestamp
 */
const fetchSignByTimestamp = () => {
  return axios
    .request({
      url: signURL,
      method: "post"
    })
    .then(res => {
      return Promise.resolve(res);
    });
};
/**
 * [API] 验证用户登录状态
 * @param {object} signObj
 * @param {string} authorCode
 */
const validation = (signObj, authorCode) => {
  return axios
    .request({
      url: validationURL,
      method: "post",
      data: { ...validationJson, ...signObj, authorCode }
    })
    .then(res => {
      return Promise.resolve(res);
    });
};

/**
 * 用户验证入口
 * @param {*} authorCode
 */
export const doValidation = async authorCode => {
  const signObj = await fetchSignByTimestamp();
  const { errorCode, data } = await validation(signObj, authorCode);
  return errorCode == "0" && data.userId ? true : false;
};
