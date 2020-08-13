/* eslint-disable */
import * as types from './mutation-types'
import state from './state'
// import { getRiskLevel } from "@/api/state/RiskLevel";

// 从左上角list.vue来的数据
export const SetStepOfLeft = function ({ commit }, data) {
  let info = {
    title: { titlename: "化工危化", titlenum: "250" },
    content: [
      { list_name: '生产企业', list_num: '111' },
      { list_name: '仓储经营', list_num: '11' },
      { list_name: '加油站', list_num: '11' },
      { list_name: '使用企业', list_num: '11' },
      { list_name: '带存储经营', list_num: '11' },
    ]
  }
  let time = [
    { timename: '化工危化(个)' },
    { timename: '非煤矿山(个)' },
    { timename: '烟花爆竹(个)' },
    { timename: '自然灾害(个)' },
    { timename: '道路运输(个)' },
    { timename: '建设工程(个)' },
    { timename: '密集场所(个)' },
    { timename: '山塘易涝积水(个)' },
  ]
  let point = []
  let PointTotal=0
  let point00 = [
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' },
    { point_num: '2345' }
  ]
  if (data == 0) {
    time = [
      { timename: '化工危化(个)' },
      { timename: '非煤矿山(个)' },
      { timename: '烟花爆竹(个)' },
      { timename: '自然灾害(个)' },
      { timename: '道路运输(个)' },
      { timename: '建设工程(个)' },
      { timename: '密集场所(个)' },
      { timename: '山塘易涝积水(个)' },
    ]
    point = state.TeamStatistics
    PointTotal=state.TeamTotal
    point00 = [
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' },
      { point_num: '2345' }
    ]
    if (state.bottomFlag == 0) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
        ]
      }
    }
    if (state.bottomFlag == 1) {
      info = {
        title: { titlename: "规上企业总数", titlenum: "1345" },
        content: [
          { list_name: '商贸业', list_num: '175' },
          { list_name: '轻工业', list_num: '175' },
          { list_name: '纺织业', list_num: '12' },
          { list_name: '建材行业', list_num: '31' },
          { list_name: '机械制造', list_num: '188' },
          { list_name: '冶金行业', list_num: '7' },
          { list_name: '有色金属', list_num: '92' },
          { list_name: '其他', list_num: '23' },
        ]
      }
    }
    if (state.bottomFlag == 2) {
      info = {
        title: { titlename: "规上企业总数", titlenum: "1345" },
        content: [
          { list_name: '商贸业', list_num: '175' },
          { list_name: '轻工业', list_num: '175' },
          { list_name: '纺织业', list_num: '12' },
          { list_name: '建材行业', list_num: '31' },
          { list_name: '机械制造', list_num: '188' },
          { list_name: '冶金行业', list_num: '7' },
          { list_name: '有色金属', list_num: '92' },
          { list_name: '其他', list_num: '23' },
        ]
      }
    }
  }
  if (data == 1) {
    time = [
      { timename: '自然灾害(个)' },
      { timename: '道路运输(个)' },
      { timename: '建设工程(个)' },
    ]
    point = state.TeamStatistics
    PointTotal=state.TeamTotal
    point00 = [
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' },
      { point_num: '2000' }
    ]
    if (state.bottomFlag == 0) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
    if (state.bottomFlag == 1) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
    if (state.bottomFlag == 2) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
  }
  if (data == 2) {
    time = [
      { timename: '洪涝灾害(次)' },
      { timename: '地震(次)' },
      { timename: '失火(次)' }
    ]
    point = state.SheltershpStatistics
    PointTotal=state.SheltershpTotal
    point00 = [
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' },
      { point_num: '3000' }
    ]
    if (state.bottomFlag == 0) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
    if (state.bottomFlag == 1) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
    if (state.bottomFlag == 2) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
  }
  let dataList = {
    flag: data,
    info: info,
    time: time,
    point: point,
    point00:point00,
    PointTotal:PointTotal
  }
  commit(types.SET_STEPOFLEFT, dataList)
}

/**
 * 
 * @param {*} param0 
 * @param {*} data1 时间轴flag
 */

// 从下面step4.vue来的数据 
export const SetStepOfBottom = function ({ commit }, data) {
  let info = {
    title: { titlename: "化工危化", titlenum: "250" },
    content: [
      { list_name: '生产企业', list_num: '111' },
      { list_name: '仓储经营', list_num: '11' },
      { list_name: '使用企业', list_num: '11' },
      { list_name: '带存储经营', list_num: '11' },
      { list_name: '加油站', list_num: '11' },
    ]
  }
  if (state.leftFlag == 0) {
    if (data == 0) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
    if (data == 1) {
      info = {
        title:{titlename:"规上企业总数",titlenum:"1345"},
        content:[
        { list_name: '商贸业', list_num: '175' },
        { list_name: '轻工业', list_num: '175' },
        { list_name: '纺织业', list_num: '12' },
        { list_name: '建材行业', list_num: '31' },
        { list_name: '机械制造', list_num: '188' },
        { list_name: '冶金行业', list_num: '7' },
        { list_name: '有色金属', list_num: '92' },
        { list_name: '其他', list_num: '23' },
      ]
    }
    }
    if (data == 2) {
      info = {
        title:{titlename:"规上企业总数",titlenum:"1345"},
        content:[
        { list_name: '商贸业', list_num: '175' },
        { list_name: '轻工业', list_num: '175' },
        { list_name: '纺织业', list_num: '12' },
        { list_name: '建材行业', list_num: '31' },
        { list_name: '机械制造', list_num: '188' },
        { list_name: '冶金行业', list_num: '7' },
        { list_name: '有色金属', list_num: '92' },
        { list_name: '其他', list_num: '23' },
      ]
    }
    }
  }
  if (state.leftFlag == 1) {
    if (data == 0) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
    if (data == 1) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
    if (data == 2) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
  }
  if (state.leftFlag == 2) {
    if (data == 0) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
    if (data == 1) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
    if (data == 2) {
      info = {
        title: { titlename: "化工危化", titlenum: "250" },
        content: [
          { list_name: '生产企业', list_num: '111' },
          { list_name: '仓储经营', list_num: '11' },
          { list_name: '使用企业', list_num: '11' },
          { list_name: '带存储经营', list_num: '11' },
          { list_name: '加油站', list_num: '11' },
        ]
      }
    }
  }
  let dataList = {
    flag: data,
    info
  }
  commit(types.SET_STEPOFBOTTOM, dataList)
}


export const SetStepOfLeft1 = function ({ commit }, data) {
  let info = 0
  if (data == 0) {
    info = 0
  }
  if (data == 1) {
    info = 1
  }
  if (data == 2) {
    info = 2
  }
  let dataList = {
    flag: data,
    info
  }
  commit(types.SET_STEPOFLEFT1, dataList)
}

export const SetRiskLevel = function ({ commit }, data) {
  commit(types.SET_RISKLEVEL, data)
}

export const SetPrimaryRiskSource = function ({ commit }, data) {
  commit(types.SET_PRIMARYRISKSOURCE, data)
}

export const SetSafetyRiskSource = function ({ commit }, data) {
  commit(types.SET_SEFETYRISKSOURCE, data)
}

export const SetTeamStatistics = function ({ commit }, data) {
  commit(types.SET_TEAMSTATISTICS, data)
}

export const SetSheltershpStatistics = function ({ commit }, data) {
  commit(types.SET_SHELTERSHPSTATISTICS, data)
}

/**
 *  设置轮播名称
 * @param {*} param
 * @param {*} data
 */
export const SetStepName = function ({ commit }, data) {
  commit(types.SET_STEPNAME, data)
}