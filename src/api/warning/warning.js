/**
 * warning接口
 */
import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils' // eslint-disable-line

/**
 * 获取监测预警分类信息ok
 * @returns {*}
 */
export function getRoleMonitorCategory() {
  const url = '/coverage/coverage/getRoleMonitorCategory'
  return get(url)
}

/**
 * 危化企业监测ok
 * @returns {*}
 */
export function getChemicalMonitorMainByUser() {
  const url = '/monitor/getChemicalMonitorMainByUser'
  return get(url)
}

/**
 * 两客一危企业ok
 * @returns {*}
 */
export function getEnterpriseMainByUser() {
  const url = '/monitor/getEnterpriseMainByUser'
  return get(url)
}

/**
 * 卫星云图
 * @returns {*}
 */
export function getLocalCloud() {
  const url = '/monitor/getLocalCloud'
  return get(url)
}

/**
 * 水情监测ok
 * @returns {*}
 */
export function getNatureDisasterByUser(type, riverType) {
  const url = '/monitor/getNatureDisasterByUser'
  return get(url, type, riverType)
}

/**
 * 积水点ok
 * @returns {*}
 */
export function getPondingMainByUser(type) {
  const url = '/monitor/getPondingMainByUser'
  return get(url, { type })
}

/**
 * 降雨分析
 * @returns {*}
 */
export function getRain() {
  const url = '/monitor/getRain'
  return get(url)
}

/**
 * 根据smid查询雨情详情 -不做
 * @returns {*}
 */
export function getRainMonitorDetailBySmid() {
  const url = '/monitor/getRainMonitorDetailBySmid'
  return get(url)
}

/**
 * 雨情监控ok
 * @returns {*}
 */
export function getRainMonitorMainByUser(type, timeType, time) {
  const url = '/monitor/getRainMonitorMainByUser'
  return get(url, { type: type, timeType: timeType, time: time })
}

/**
 * 根据smid查询景区客流量详情-不做
 * @returns {*}
 */
export function getScenicDetailBySmid() {
  const url = '/monitor/getScenicDetailBySmid'
  return get(url)
}

/**
 * 景区ok
 * @returns {*}
 */
export function getScenicMainByUser() {
  const url = '/monitor/getScenicMainByUser'
  return get(url)
}

/**
 * 台风列表ok
 * @returns {*}
 */
export function getTyphoon() {
  const url = '/monitor/getTyphoon'
  return get(url)
}

/**
 * 台风详情ok
 * @param tfbh
 * @returns {*}
 */
export function getTyphoonDetail(tfbh) {
  const url = '/monitor/getTyphoonDetail'
  return get(url, { tfbh })
}

/**
 * 气象雷达
 * @returns {*}
 */
export function getWeather() {
  const url = '/monitor/getWeather'
  return get(url)
}

/**
 * 天气预报ok
 * @returns {*}
 */
export function getWeatherReport() {
  const url = '/monitor/getWeatherReport'
  return get(url)
}

/**
 * 预警ok
 * @returns {*}
 */
export function getWeatherWarn() {
  const url = '/monitor/getWeatherWarn'
  return get(url)
}

/**
 * 获取第三方通用数据
 * @param src
 * @returns {*}
 */
export function getCommonWeather(src) {
  const url = '/monitor/getCommonWeather'
  return get(url, { url: src })
}

/**
 * 视频列表
 * @param src
 * @returns {*}
 */
export function getVideoType() {
  const url = '/monitor/getVideoType'
  return get(url)
}

/**
 * 获取视屏信息
 * @returns {*}
 */
export function getCityVideoInfo(district, name, page, pageSize, type) {
  const url = '/monitor/getCityVideoInfo'
  return get(url, { district, name, page, pageSize, type })
}

/**
 * 获取监控摄像头分类
 * @returns {*}
 */
export function getMonitorCamera() {
  const url = '/coverage/coverage/getMonitorCamera'
  return get(url)
}

/**
 * 查询雨情列表
 * @returns {*}
 */
export function getTimeRainInfo(time, districtName, type) {
  const url = '/monitor/getTimeRainInfo'
  return get(url, { time: 0, name: districtName, type: type, startTime: time[0], endTime: time[1] })
}

/**
 * 查询区域测站雨情
 * @returns {*}
 */
export function getDistructRainInfo(time, type) {
  const url = '/monitor/getDistructRainInfo'
  return get(url, { time: 0, type: type, startTime: time[0], endTime: time[1] })
}

/**
 * 查询渔船信息
 * @returns {*}
 */
export function getFishBoatInfo() {
  const url = '/monitor/getFishBoatInfo'
  return get(url)
}

/**
 * 查询渔船信息
 * @returns {*}
 */
export function getFishBoatDetailSmid(smid) {
  const url = '/monitor/getFishBoatDetailSmid'
  return get(url, { smid: smid })
}

/**
 * 获取区县和类别
 * @returns {*}
 */
export function getDistrictAndTypeInfo() {
  const url = '/monitor/getDistrictAndTypeInfo'
  return get(url)
}

/**
 * 获取视频列表
 * @returns {*}
 */
export function getVideoInfo(code) {
  const url = '/coverage/coverage/getMonitorCamera'
  return get(url, { '区县码': code })
}

/**
 * 获取监测预警配置
 * @returns {*}
 */
export function getJCYJMenuOrder(code) {
  const url = '/columnInfo/getJCYJMenuOrder'
  return get(url)
}

/**
 * 获取地灾列表信息
 * @returns {*}
 */
export function getPointInfo() {
  const url = '/monitor/getPointInfo'
  return get(url)
}

/**
 * 获取雨量设备信息
 * @returns {*}
 */
export function getRainDetail(smid, dataType, endTime = '', startTime = '', timeType) {
  const url = '/monitor/getRainDetail'
  return get(url, { smid, dataType, endTime, startTime, timeType })
}

/**
 * 获取倾角设备信息
 * @returns {*}
 */
export function getIncDetail(smid, dataType, endTime = '', startTime = '', timeType) {
  const url = '/monitor/getIncDetail'
  return get(url, { smid, dataType, endTime, startTime, timeType })
}

/**
 * 获取GPS设备信息
 * @returns {*}
 */
export function getPointGpsDetail(smid, dataType, endTime = '', startTime = '', timeType) {
  const url = '/monitor/getPointGpsDetail'
  return get(url, { smid, dataType, endTime, startTime, timeType })
}

/**
 * 获取地表位移设备信息
 * @returns {*}
 */
export function getPointDispDetail(smid, dataType, endTime = '', startTime = '', timeType) {
  const url = '/monitor/getPointDispDetail'
  return get(url, { smid, dataType, endTime, startTime, timeType })
}

/**
 * 获取预警信息
 * @returns {*}
 */
export function getWarningByUser() {
  const url = '/monitor/getWarningByUser'
  return get(url)
}

/**
 * 单兵设备
 * @param src
 * @returns {*}
 */
export function getIndividualData() {
  const url = '/monitor/getIndividualData'
  return get(url)
}
export function getPointList() {
  const url = '/monitor/getPointList'
  return get(url)
}

/**
 * 预警列表
 * @param src
 * @returns {*}
 */
export function getWarnList(name, end_time, start_time, warn_type) {
  const url = '/monitor/getWarnList'
  return get(url, { name, end_time, start_time, warn_type })
}

/**
 * 地灾监测列表
 * @param src
 * @returns {*}
 */
export function getDeviceList() {
  const url = '/monitor/getDeviceList'
  return get(url)
}

/**
 * 地灾监测详情
 * @param src
 * @returns {*}
 */
export function getDeviceDetail(dataType, deviceId, startTime, endTime, tablename, timeType) {
  const url = '/monitor/getDeviceDetail'
  return get(url, { dataType, deviceId, startTime, endTime, tablename, timeType })
}

/**
 * 卫星电话
 * @param src
 * @returns {*}
 */
export function getSatellitePhone() {
  const url = '/monitor/getSatellitePhone'
  return get(url)
}
