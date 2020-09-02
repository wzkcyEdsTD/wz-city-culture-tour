/*
 * @Author: eds
 * @Date: 2020-08-31 15:45:25
 * @LastEditTime: 2020-09-02 17:05:29
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\validation\config.js
 */
const prodURL_HOST = "sourcelayer.wzcitybrain.com";
const signURL = "https://sourceserver.wzcitybrain.com/api/user/getSignStr";
const validationURL_PROD =
  "https://api-szjsc.wenzhou.gov.cn/cockpit/wzdsjjsc/wzsjjsc-server/scenario/v1/validAuthorCode";
const validationURL_DEV =
  "https://api-szjsc-pre.wenzhou.gov.cn/cockpit/wzdsjjsc/wzsjjsc-server/scenario/v1/validAuthorCode";
const VERSION = "1.0";
const APP_KEY = "kshjdnkdnkukamdjuwkmudjskskud";

export default {
  signURL,
  validationURL: window.location.href.includes(prodURL_HOST)
    ? validationURL_PROD
    : validationURL_DEV,
  validationJson: {
    version: VERSION,
    appKey: APP_KEY
  },
  avoidValidationString: "wzsjjt"
};
