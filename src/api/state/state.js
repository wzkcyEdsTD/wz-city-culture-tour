/**
 * state
 */
import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils' // eslint-disable-line

/**
 * 获取风险态势排序
 * @returns {*}
 */
export function getAQFXMenuOrder() {
  const url = '/columnInfo/getAQFXMenuOrder'
  return get(url)
}

/**
 * 风险感知预测
 * @returns {*}
 */
export function getForecastMainByUser() {
  const url = '/category/getForecastMainByUser'
  return get(url, {})
}

/**
 * 一级风险源
 * @returns {*}
 */
export function getPrimaryRiskSource() {
  const url = '/category/getPrimaryRiskSourceByUser'
  return get(url, {})
}

/**
 * 安全风险源
 * @returns {*}
 */
export function getSafetyRiskSource() {
  const url = '/category/getSafetyRiskSourceStatistics'
  return get(url, {})
}

/**
 * 本年地质灾害
 * @returns {*}
 */
export function getCurYearDisaster() {
  const url = '/category/getCurYearDisaster'
  return get(url)
}

/**
 * 山塘易涝点
 * @returns {*}
 */
export function getStyld() {
  const url = '/category/getStyld'
  return get(url)
}

/**
 * 山塘易涝点
 * @returns {*}
 */
export function getStgyl() {
  const url = '/category/getStgyl'
  return get(url)
}

/**
 * 渔船总数
 * @returns {*}
 */
export function getfishBoot() {
  const url = '/category/getfishBoot'
  return get(url)
}

/**
 * 渔港总数
 * @returns {*}
 */
export function getFishPort() {
  const url = '/category/getFishPort'
  return get(url)
}

/**
 * 气象灾害
 * @returns {*}
 */
export function getMeteLogByUser() {
  const url = '/category/getMeteLogByUser'
  return get(url)
}

/**
 * 地下空间
 * @returns {*}
 */
export function getUnderGroudByUser() {
  const url = '/category/getUnderGroudByUser'
  return get(url)
}

/**
 * 城市规划专题-永嘉
 * @returns {*}
 */
export function getCityBaseInfo() {
  const url = '/category/getCityBaseInfo'
  return get(url)
}

/**
 * 污染源
 * @returns {*}
 */
export function getPollutionByUser() {
  const url = '/category/getPollutionByUser'
  return get(url)
}

/**
 * 特种设备
 * @returns {*}
 */
export function specialEquipment() {
  const url = '/category/specialEquipment'
  return get(url)
}

/**
 * 智慧工地
 * @returns {*}
 */
export function smartConstructionSite() {
  const url = '/category/smartConstructionSite'
  return get(url)
}
/**
 * 重点工程
 * @returns {*}
 */
export function getKeyProjectsData() {
  const url = '/category/getKeyProjectsData'
  return get(url)
}

/**
 * 危旧房屋-鹿城
 * @returns {*}
 */
export function getDangerHouseByUser_lcq() {
  const url = '/category/getDangerHouseByUser_lcq'
  return get(url)
}

/**
 * 两客一危-鹿城
 * @returns {*}
 */
export function getEnterPriseLcq() {
  const url = '/category/getEnterPriseLcq'
  return get(url)
}
export function getChemicalData() {
  const url = '/category/getChemicalData'
  return get(url)
}

/**
 * guishanggongmaoqiye
 * @returns {*}
 */
export function getSafeProductByUser() {
  const url = '/category/getSafeProductByUser'
  return get(url)
}
