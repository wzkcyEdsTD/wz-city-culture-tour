/**
 * save接口
 */
import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils' // eslint-disable-line

/**
 * 获取应急避难场所数据
 * @returns {*}
 */
export function getSheltershpStatistics() {
  const url = '/saveAbility/getSheltershpStatisticsData'
  return get(url, {})
}
