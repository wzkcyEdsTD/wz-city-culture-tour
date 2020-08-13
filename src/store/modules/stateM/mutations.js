/* eslint-disable */
import * as types from './mutation-types'

const mutations = {
  [types.SET_STEPOFLEFT](state, data) {
    state.leftFlag = data.flag
    state.leftInfo = data.time
    state.point= data.point
    state.PointTotal= data.PointTotal
    state.bottomInfo = data.info
    state.point00= data.point00
  },
  [types.SET_STEPOFLEFT1](state, data) {
    state.btn = data.info
  },
  /**
   * 
   * @param {*} state 
   * @param {*} data1 时间轴flag
   * @param {*} data2 右下列表信息
   */
  [types.SET_STEPOFBOTTOM](state, data) {
    state.bottomFlag = data.flag
    state.bottomInfo = data.info
  },
  [types.NATURAL](state, data) {
    state.natural = data
  },
  [types.SET_RISKLEVEL](state, data) {
    state.risklevel = data
  },
  [types.SET_BOTTOMFLAG](state, data) {
    state.bottomFlag = data
  },
  [types.SET_PRIMARYRISKSOURCE](state, data) {
    // state.leftInfo = data.coordinate
    state.bottomInfo1=data.data
    state.point = data.data[0].mapData
    state.PointTotal0=data.data[0].totalNum
  },
  [types.SET_SEFETYRISKSOURCE](state, data) {
    state.point = data.list[0].disList
    state.PointTotal0=data.list[0].typeTotalCount
  },
  [types.SET_TEAMSTATISTICS](state, data) {
    state.TeamStatistics = data.categoryViews
    state.TeamTotal=data.totalCount
    state.point = data.categoryViews
    state.PointTotal0=data.totalCount
  },
  [types.SET_SHELTERSHPSTATISTICS](state, data) {
    state.SheltershpStatistics = data.categoryViews
    state.SheltershpTotal=data.totalCount
  },
  [types.SET_STEPNAME](state, data) {
    state.stepName = {
      name: data
    }
    // state.stepName.name = data
    // state.stepName.count += 1
  }
}

export default mutations