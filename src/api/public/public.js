/**
 * 公共接口
 */
import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils' // eslint-disable-line

/**
 * 获取用户信息
 * @returns {*}
 */
export function getUserInfo() {
  const url = '/user/getUserInfo'
  return get(url)
}

/**
 * 获取菜单信息
 * @returns {*}
 */
export function getMenu() {
  const url = '/columnInfo/getMenus'
  return get(url)
}

/**
 * 修改用户密码
 * @returns {*}
 */
export function updatePassword(params) {
  const url = '/sys/user/updatePassword'
  return putRequest(url, params)
}
