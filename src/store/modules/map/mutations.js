/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:07
 * @LastEditTime: 2020-08-20 19:22:56
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\store\modules\map\mutations.js
 */
// 定义修改操作
import * as types from "./mutation-types";

const mutations = {
  [types.SET_FEVER_LIST](state, data) {
    state.feverList = data;
  },
  [types.SET_RTMP_LIST](state, data) {
    state.rtmpList = data;
  },
  [types.SET_IS_INFO_FRAME](state, bool) {
    state.isInfoFrame = bool;
  },
  [types.SET_COLLAPSE1](state, bool) {
    state.collapse1 = bool;
  },
  [types.SET_COLLAPSE2](state, bool) {
    state.collapse2 = bool;
  },
  [types.SET_LEGEND_SHOW](state, bool) {
    state.legendShow = bool;
  },
  [types.SET_TREE](state, data) {
    state.tree = data;
  },
  [types.SET_CURRENT_MAP_TYPE](state, data) {
    state.currentMapType = data;
  },
  [types.SET_TREE_CHECKED_LIST](state, data) {
    state.treeCheckedList = data;
  },
  [types.SET_TYPE_INDEX](state, data) {
    state.typeIndex = data;
  },
  [types.SET_CURRENT_ONE_POINT](state, data) {
    state.currentOnePoint = data;
  },
  [types.SET_MAP_LOADED](state, data) {
    state.mapLoaded = data;
  },
  [types.SET_SPECAL_TREE_NAME](state, data) {
    state.specalTreeName = data;
  },
  [types.SET_SPLIT_SCREEN](state, data) {
    state.splitScreen = data;
  },
  [types.SET_NAME_LIST](state, data) {
    state.nameList = data;
  },
  [types.SET_FORCE_MAP_TYPE](state, data) {
    state.forceMapTypeBase = data;
  },
  [types.SET_FORCE_BIM_IDS](state, data) {
    state.forceBimIDS = data;
  },
  [types.SET_FORCE_BIM_DATA](state, data) {
    state.forceBimData = data;
  },
  [types.SET_FORCE_ROOM_DATA](state, data) {
    state.forceRoomData = data;
  }
};

export default mutations;
