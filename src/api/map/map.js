/**
 * map接口
 */
import { get, post, postRequest, uploadFileRequest, getRequest, putRequest, deleteRequest } from 'api/utils' // eslint-disable-line

/**
 * 获取用户图层信息左侧树
 * @returns {*}
 */
export function getRoleCategory() {
  const url = '/coverage/coverage/getRoleCategory'
  return get(url)
}

/**
 * 获取周边分析的信息树
 * @returns {*}
 */
export function getCategoryByPid() {
  const url = '/coverage/coverage/getCategoryByPid'
  return get(url)
}

/**
 * 获取地图搜索的信息树
 * @returns {*}
 */
export function getPointTreeList() {
  const url = '/statistics/getPointTreeList'
  return post(url)
}

/**
 * 获取就近分析的信息树
 * @returns {*}
 */
export function getNearAnalysisList() {
  const url = '/statistics/getPZList'
  return post(url)
}

/**
 * 获取地图搜索的模糊搜索结果
 * @returns {*}
 */
export function getSearchNameList(name, pageNo, pageSize, tableNames) {
  const url = '/riskPicture/getSearchNameList'
  return post(url, {
    name,
    pageNo,
    pageSize,
    tableNames
  })
}

//
/**
 * 获取聚合图数量
 * @returns {*}
 */
export function getPictureDistrictTypeNum(layerList, queryType) {
  const url = '/riskPicture/getPictureDistrictTypeNum'
  return post(url, {
    layerList,
    queryType
  })
}

/**
 * 查询地图搜索的点详情
 * @returns {*}
 */
export function getTypeDetail(smid, tableName) {
  const url = '/riskPicture/getTypeDetail'
  return get(url, {
    smid,
    tableName
  })
}

/**
 * 获取当前页签的右下角数据
 * @param fieldLikeNameValue
 * @param fieldLikeNames
 * @param fieldName
 * @param fieldNameValue
 * @param pageNo
 * @param pageSize
 * @param tableName
 * @returns {*}
 */
export function likeStatistics(fieldLikeNameValue, fieldLikeNames, fieldName, fieldNameValue, barName, barValue, pageNo, pageSize, tableName, district, typeName, order, value) {
  const url = '/statistics/likeStatistics'
  return post(url, {
    fieldLikeNameValue,
    fieldLikeNames,
    fieldName,
    fieldNameValue,
    pageNo,
    pageSize,
    tableName,
    district,
    typeName,
    barName,
    barValue,
    order
  })
}

/**
 * 获取当前页签的右下角数据全部
 * @param fieldLikeNameValue
 * @param fieldLikeNames
 * @param fieldName
 * @param fieldNameValue
 * @param barName
 * @param barValue
 * @param pageNo
 * @param pageSize
 * @param tableName
 * @param district
 * @param typeName
 * @param order
 * @returns {*}
 */
export function likeStatisticsAll(fieldLikeNameValue, fieldLikeNames, fieldName, fieldNameValue, barName, barValue, pageNo, pageSize, tableName, district, typeName, order, value) {
  const url = '/statistics/likeStatisticsAll'
  return post(url, {
    barName,
    barValue,
    district,
    fieldLikeNameValue,
    fieldLikeNames,
    fieldName,
    fieldNameValue,
    pageNo,
    pageSize,
    tableName,

    typeName,
    order,
    value
  })
}

/**
 * 根据字段和表名获取当前页签的数据
 * @param fieldNames
 * @param tableName
 * @returns {*}
 */
export function statistics(fieldNames, tableName, district, typeName) {
  const url = '/statistics/statistics'
  return post(url, { fieldNames, tableName, district, typeName })
}

/**
 * 获取详细信息
 * @param smid
 * @param tableName
 * @returns {*}
 */
export function getTableData(smid, tableName) {
  const url = '/columnInfo/getTableData/' + tableName + '/' + smid
  return get(url)
}

/**
 * 测试mock数据
 * @returns {*}
 */
export function test() {
  const url = '/test/test'
  return post(url)
}
