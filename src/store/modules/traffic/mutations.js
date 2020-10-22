import { type } from "jquery";
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
  [types.SET_WZ_EMERGENCY_DATA](state, data) {
    state.WzEmergencyData = data;
  },
  [types.SET_WZ_BASIC_DATA](state, data) {
    state.WzBasicData = data;
  },
  [types.SET_WZ_SOURCE_DATA](state, data) {
    state.WzSourceData = data;
  },
  [types.SET_WZ_TOUR_DATA](state, data) {
    state.WzTourData = data;
  },
  [types.SET_WZ_CULTURE_DATA](state, data) {
    state.WzCultureData = data;
  },
  [types.SET_WZ_TRAFFIC_DATA](state, data) {
    state.WzTrafficData = data;
  },
  [types.SET_WZ_OVERVIEW_dATA](state, data) {
    state.WzOverviewData = data;
  },
  [types.SET_WZ_MEDICAL_DATA](state, data) {
    state.WzMedicalData = data;
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
  [types.SET_STATION_LIST_WITH_GEOMETRY](state, data) {
    state.stationListWithGeometry = data;
  },
  [types.SET_STATION_LIST](state, data) {
    state.stationList = data;
  },
  [types.SET_BAYONET_LIST_WITH_GEOMETRY](state, data) {
    state.bayonetListWithGeometry = data;
  },
  [types.SET_BAYONET_LIST](state, data) {
    state.bayonetList = data;
  },
  [types.SET_TOUR_POINT_LIST_WITH_GEOMETRY](state, data) {
    state.tourPointListWithGeometry = data;
  },
  [types.SET_TOUR_POINT_LIST](state, data) {
    state.tourPointList = data;
  },
  [types.SET_RTMP_LIST](state, data) {
    state.rtmpList = data;
  },
  [types.SET_RTMP_LIST_OTHER](state, data) {
    state.rtmpListOther = data;
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
  [types.SET_INIT_DATA_LOADED](state, data) {
    state.initDataLoaded = data;
  },
  [types.SET_FORCE_MAP_TYPE](state, data) {
    state.forceMapTypeBase = data;
  },
  [types.SET_FORCE_INDEX](state, data) {
    state.forceIndex = data
  },
  [types.SET_FORCE_TIME](state, data) {
    state.forceTime = data
  },
  [types.SET_NIGHT_MODE](state, data) {
    state.nightMode = data
  },
  [types.SET_CAMERA_MODE](state, data) {
    state.cameraMode = data
  },
  [types.SET_FORCE_TREE_LABEL](state, data) {
    state.forceTreeLabel = data
  },
  [types.SET_FORCE_TRUE_TOPIC_LABEL](state, data) {
    state.forceTrueTopicLabels = [...data];
  },
  [types.SET_FORCE_TRUE_TOPIC_LABEL_ID](state, data) {
    state.forceTrueTopicLabelId = data;
  }
};

export default mutations;
