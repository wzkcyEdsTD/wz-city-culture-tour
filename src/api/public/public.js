/*
 * @Author: eds
 * @Date: 2020-08-11 20:39:44
 * @LastEditTime: 2020-08-31 15:18:44
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\api\public\public.js
 */
/**
 * 公共接口
 */
import { get, putRequest } from "api/utils"; // eslint-disable-line

/**
 * 获取用户信息
 * @returns {*}
 */
export function getUserInfo() {
  const url = "/user/getUserInfo";
  return get(url);
}

/**
 * 获取菜单信息
 * @returns {*}
 */
export function getMenu() {
  const url = "/columnInfo/getMenus";
  return get(url);
}

/**
 * 修改用户密码
 * @returns {*}
 */
export function updatePassword(params) {
  const url = "/sys/user/updatePassword";
  return putRequest(url, params);
}
