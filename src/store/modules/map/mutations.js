/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:07
 * @LastEditTime: 2020-09-03 15:41:28
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\store\modules\map\mutations.js
 */
// 定义修改操作
import * as types from "./mutation-types";

const mutations = {
  [types.SET_WZ_ALL_DATA](state, data) {
    state.WzAllData = data;
  },
  [types.SET_HOSPITAL_LIST](state, data) {
    state.hospitalList = data;
  },
  [types.SET_MEDICAL_LIST_WITH_GEOMETRY](state, data) {
    state.medicalListWithGeometry = data;
  },
  [types.SET_MEDICAL_LIST](state, data) {
    state.medicalList = data;
  },
  [types.SET_RTMP_LIST](state, data) {
    state.rtmpList = data;
  },
  [types.SET_IS_INFO_FRAME](state, bool) {
    state.isInfoFrame = bool;
  },
  [types.SET_CURRENT_MAP_TYPE](state, data) {
    state.currentMapType = data;
  },
  [types.SET_MAP_LOADED](state, data) {
    state.mapLoaded = data;
  },
  [types.SET_FORCE_MAP_TYPE](state, data) {
    state.forceMapTypeBase = data;
  }
};

export default mutations;
