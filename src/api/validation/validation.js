/*
 * @Author: eds
 * @Date: 2020-08-31 15:27:32
 * @LastEditTime: 2020-09-02 19:21:59
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\validation\validation.js
 */
import axios from "axios";
import validationObject from "./config";
const {
  signURL,
  validationURL,
  validationJson,
  avoidValidationString
} = validationObject;
const instance = axios.create();

/**
 * [API] 自家后端生成专班签名
 * @return {object} sign/timestamp
 */
const fetchSignByTimestamp = () => {
  return instance
    .request({
      url: signURL,
      method: "get"
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
};
/**
 * [API] 验证用户登录状态
 * @param {object} signObj
 * @param {string} authorCode
 */
const validation = (sign, authorCode) => {
  return instance
    .request({
      url: validationURL,
      method: "post",
      data: { ...validationJson, ...sign, authorCode }
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
};

/**
 * 用户验证入口
 * @param {*} authorCode
 */
export const doValidation = async authorCode => {
  if (authorCode == avoidValidationString) return true;
  const sign = await fetchSignByTimestamp();
  const { errorCode, success } = await validation(sign, authorCode);
  return errorCode == "0" && success ? true : false;
};
