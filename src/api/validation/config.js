/*
 * @Author: eds
 * @Date: 2020-08-31 15:45:25
 * @LastEditTime: 2020-09-02 09:11:05
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\validation\config.js
 */
const signURL = "http://10.36.198.17:9000/user/getSignStr";
// const validationURL =
//   "https://api-szjsc.wenzhou.gov.cn/cockpit/wzdsjjsc/wzsjjsc-server/scenario/v1/validAuthorCode";
const validationURL =
  "https://api-szjsc-pre.wenzhou.gov.cn/cockpit/wzdsjjsc/wzsjjsc-server/scenario/v1/validAuthorCode";
const VERSION = "1.0";
const APP_KEY = "kshjdnkdnkukamdjuwkmudjskskud";

export default {
  signURL,
  validationURL,
  validationJson: {
    version: VERSION,
    appKey: APP_KEY
  }
};
