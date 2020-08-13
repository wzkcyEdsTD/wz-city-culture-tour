/**
 * save接口
 */
import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils' // eslint-disable-line

/**
 * 获取应急避难场所数据
 * @returns {*}
 */
export function getTeamStatistics() {
  const url = '/saveAbility/getTeamStatisticsData'
  return get(url, {})
}
