/**
 * save接口
 */
import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils' // eslint-disable-line

/**
 * 获取救灾能力排序
 * @returns {*}
 */
export function getJZJZMenuOrder() {
  const url = '/columnInfo/getJZJZMenuOrder'
  return get(url)
}

/**
 * 获取应急避难场所数据
 * @returns {*}
 */
export function getShelterAddressMainByUser() {
  const url = '/saveAbility/getShelterAddressMainByUser'
  return get(url)
}

/**
 * 物资储备企业
 * @returns {*}
 */
export function getStoreEnterpriseMainByUser() {
  const url = '/saveAbility/getStoreEnterpriseMainByUser'
  return get(url)
}

/**
 * 应急队伍
 * @returns {*}
 */
export function getTeamStatisticsData() {
  const url = '/saveAbility/getTeamStatisticsData'
  return get(url)
}

/**
 * 大型关键设备
 * @returns {*}
 */
export function getEquipmentMainByUser() {
  const url = '/saveAbility/getEquipmentMainByUser'
  return get(url)
}

/**
 * 大型关键设备中间地图
 * @returns {*}
 */
export function getEquipmentMainMap() {
  const url = '/saveAbility/getEquipmentMainMap'
  return get(url)
}

/**
 * 应急避难场所
 * @returns {*}
 */
export function getSheltershpStatisticsData() {
  const url = '/saveAbility/getSheltershpStatisticsData'
  return get(url)
}

/**
 * 应急专家
 * @returns {*}
 */
export function getEmergencyExpertsMainByUser() {
  const url = '/saveAbility/getEmergencyExpertsMainByUser'
  return get(url)
}

/**
 * 应急专家-乐清市
 * @returns {*}
 */
export function getEmergencyExpertsMainByUserLQS() {
  const url = '/saveAbility/getEmergencyExpertsMainByUserLQS'
  return get(url)
}

/**
 * 应急队伍
 * @returns {*}
 */
export function getEmergencyTeamMainByUser() {
  const url = '/saveAbility/getEmergencyTeamMainByUser'
  return get(url)
}

/**
 * 应急队伍-乐清市
 * @returns {*}
 */
export function getEmergencyTeamMainByUserLQS() {
  const url = '/saveAbility/getEmergencyTeamMainByUserLQS'
  return get(url)
}

/**
 * 医疗救援能力
 * @returns {*}
 */
export function getSaveAbilityMainByUser() {
  const url = '/saveAbility/getSaveAbilityMainByUser'
  return get(url, {})
}

/**
 * 消防救援能力
 * @returns {*}
 */
export function getFireSaveAbilityMainByUser() {
  const url = '/saveAbility/getFireSaveAbilityMainByUser'
  return get(url, {})
}

/**
 * 根据smid查询雨情监测详情
 * @returns {*}
 */
export function getRainMonitorDetailBySmid(smid, type, timeType, time) {
  const url = '/monitor/getRainMonitorDetailBySmid'
  if (time) {
    return get(url, { smid, type, timeType, time })
  } else {
    return get(url, { smid, type })
  }
}

/**
 * 根据smid查询河道监测详情
 * @returns {*}
 */
export function getRiverMonitorDetailBySmid(smid, type) {
  const url = '/monitor/getRiverMonitorDetailBySmid'
  return get(url, { smid, type })
}

/**
 * 根据smid查询水库监测详情
 * @returns {*}
 */
export function getReservoirMonitorDetailBySmid(smid) {
  const url = '/monitor/getReservoirMonitorDetailBySmid'
  return get(url, { smid })
}

/**
 * 根据smid查询积水点库监测详情
 * @returns {*}
 */
export function getPondingDetailBySmid(smid, type) {
  const url = '/monitor/getPondingDetailBySmid'
  return get(url, { smid, type })
}

/**
 * 根据smid查询渔船监测详情
 * @returns {*}
 */
export function getFishBoatDetailSmid(smid) {
  const url = '/monitor/getFishBoatDetailSmid'
  return get(url, { smid })
}

/**
 * 根据smid查询两客一危监测详情
 * @returns {*}
 */
export function getEnterpriseDetailSmid(smid) {
  const url = '/monitor/getEnterpriseDetailSmid'
  return get(url, { smid })
}

/**
 * 根据smid查询景区客流量监测详情
 * @returns {*}
 */
export function getScenicDetailBySmid(smid) {
  const url = '/monitor/getScenicDetailBySmid'
  return get(url, { smid })
}

/**
 * 救灾物资储备库数据统计
 * @returns {*}
 */
export function getMaterialWarehouseStatistics() {
  const url = '/saveAbility/getMaterialWarehouseStatistics'
  return get(url)
}
