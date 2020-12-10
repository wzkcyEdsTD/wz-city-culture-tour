/*
 * @Author: eds
 * @Date: 2020-08-21 18:30:30
 * @LastEditTime: 2020-09-04 15:08:51
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\store\modules\map\actions.js
 */
import * as types from "./mutation-types";
import {
  getMedicalList, getBayonetList, getStationList, getTourPointList, fetchWzOverviewData, fetchWzTrafficData,
  fetchMedicalData, fetchTourData, fetchCultureData, fetchSourceData, fetchBasicData, fetchWzPeopleData, fetchEmergencyData
} from "api/layerServerAPI";

/**
 * 对象下所有值相加
 * @param {*} object 
 */
function addByObjectKey(object) {
  let count = 0;
  Object.keys(object).map(k => {
    count += parseFloat(object[k])
  })
  return count;
}

//  获取全市总览数据
export const SetWzOverviewData = async ({ commit, state }) => {
  if (!Object.keys(state.WzOverviewData).length) {
    const { result } = await fetchWzOverviewData();
    const peopleResponse = await fetchWzPeopleData();
    commit(types.SET_WZ_OVERVIEW_dATA, { ...result, gdp: 3076, people: (peopleResponse.result["常住人口登记——总数"].currentNum / 10000 || '-').toFixed(2) });
  }
}

//  获取全市旅游数据
export const SetWzTourData = async ({ commit, state }) => {
  if (!Object.keys(state.WzTourData).length) {
    const { result } = await fetchTourData();
    const _result_ = {}
    for (let key in result) {
      _result_[key] = result[key].count
    }
    commit(types.SET_WZ_TOUR_DATA, _result_);
  }
}

//  获取全市资源数据
export const SetWzSourceData = async ({ commit, state }) => {
  if (!Object.keys(state.WzSourceData).length) {
    const { result } = await fetchSourceData();
    commit(types.SET_WZ_SOURCE_DATA, result.全市);
  }
}

//  获取全市基础数据
export const SetWzBasicData = async ({ commit, state }) => {
  if (!Object.keys(state.WzBasicData).length) {
    const { result } = await fetchBasicData();
    commit(types.SET_WZ_BASIC_DATA, result);
  }
}

//  获取全市应急数据
export const SetWzEmergencyData = async ({ commit, state }) => {
  if (!Object.keys(state.WzEmergencyData).length) {
    const { result } = await fetchEmergencyData();
    const _result_ = {};
    for (let key in result) {
      _result_[key] = addByObjectKey(result[key]);
    }
    commit(types.SET_WZ_EMERGENCY_DATA, _result_);
  }
}

//  获取全市文化数据
export const SetWzCultureData = async ({ commit, state }) => {
  if (!Object.keys(state.WzCultureData).length) {
    const { result } = await fetchCultureData();
    const _result_ = {}
    for (let key in result) {
      _result_[key] = result[key].count || result[key].currentNum
    }
    commit(types.SET_WZ_CULTURE_DATA, _result_);
  }
}

//  获取全市交通数据
export const SetTrafficData = async ({ commit, state }) => {
  if (!Object.keys(state.WzTrafficData).length) {
    const { result } = await fetchWzTrafficData();
    const _result_ = {};
    for (let key in result) {
      const obj = result[key];
      let num = 0;
      for (let i in obj) {
        num += parseInt(obj[i]);
      }
      _result_[key] = (num / 10000).toFixed(2)
    }
    commit(types.SET_WZ_TRAFFIC_DATA, _result_);
  }
}

//  获取全市医疗数据
export const SetWzMedicalData = async ({ commit, state }) => {
  if (!Object.keys(state.WzMedicalData).length) {
    const { result } = await fetchMedicalData();
    commit(types.SET_WZ_MEDICAL_DATA, result);
  }
};

//  设置医院数据
export const SetHospitalList = ({ commit }, data) => {
  commit(types.SET_HOSPITAL_LIST, data);
};

/**
 * 设置带空间参数的医院信息
 * @param {*} param0
 * @param {*} data
 */
export const setMedicalListWithGeometry = ({ commit }, data) => {
  commit(types.SET_MEDICAL_LIST_WITH_GEOMETRY, data);
};

//  设置医院数据
export const fetchMedicalList = async ({ commit }) => {
  const { result } = await getMedicalList();
  commit(types.SET_MEDICAL_LIST, result);
  commit(types.SET_INIT_DATA_LOADED, true)
};

/**
 * 设置带空间参数的站点信息
 * @param {*} param0
 * @param {*} data
 */
export const setStationListWithGeometry = ({ commit }, data) => {
  commit(types.SET_STATION_LIST_WITH_GEOMETRY, data);
};

//  设置卡口数据
export const fetchStationList = async ({ commit }) => {
  const { result } = await getStationList();
  const flowData = {};
  for (let key in result["进出站客流排行(出站)"]) {
    const obj = result["进出站客流排行(出站)"][key];
    const _k_ = obj.stationName;
    !flowData[_k_] && (flowData[_k_] = { in: 0, out: 0 });
    flowData[_k_].out += parseInt(obj.passengerNum);
  }
  for (let key in result["进出站客流排行(进站)"]) {
    const obj = result["进出站客流排行(进站)"][key];
    const _k_ = obj.stationName;
    !flowData[_k_] && (flowData[_k_] = { in: 0, out: 0 });
    flowData[_k_].in += parseInt(obj.passengerNum);
  }
  commit(types.SET_STATION_LIST, flowData);
  commit(types.SET_INIT_DATA_LOADED, true)
};

/**
 * 设置带空间参数的卡口信息
 * @param {*} param0
 * @param {*} data
 */
export const setBayonetListWithGeometry = ({ commit }, data) => {
  commit(types.SET_BAYONET_LIST_WITH_GEOMETRY, data);
};

//  设置卡口数据
export const fetchBayonetList = async ({ commit }) => {
  const { result } = await getBayonetList();
  commit(types.SET_BAYONET_LIST, result);
  commit(types.SET_INIT_DATA_LOADED, true)
};

/**
 * 设置带空间参数的景点信息
 * @param {*} param0
 * @param {*} data
 */
export const setTourPointListWithGeometry = ({ commit }, data) => {
  commit(types.SET_TOUR_POINT_LIST_WITH_GEOMETRY, data);
};

//  设置卡口数据
export const fetchTourPointList = async ({ commit }) => {
  const { result } = await getTourPointList();
  commit(types.SET_TOUR_POINT_LIST, result['重点景区客流数据']);
  commit(types.SET_INIT_DATA_LOADED, true)
};

//  设置监控视频
export const SetRtmpList = ({ commit }, data) => {
  commit(types.SET_RTMP_LIST, data);
};
//  设置事件跳转监控视频
export const SetRtmpListOther = ({ commit }, data) => {
  commit(types.SET_RTMP_LIST_OTHER, data);
};
//  设置弹窗显隐
export const SetIsInfoFrame = ({ commit }, data) => {
  commit(types.SET_IS_INFO_FRAME, data);
};
//  设置展示指标
export const SetForceIndex = ({ commit }, data) => {
  commit(types.SET_FORCE_INDEX, data);
};
//  设置时间线
export const SetForceTime = ({ commit }, data) => {
  commit(types.SET_FORCE_TIME, data);
};
//  设置白天黑夜
export const SetNightMode = ({ commit }, data) => {
  commit(types.SET_NIGHT_MODE, data);
};
//  设置相机转动
export const SetCameraMode = ({ commit }, data) => {
  commit(types.SET_CAMERA_MODE, data);
};
//  设置tab下标
export const SetForceTreeLabel = ({ commit }, data) => {
  commit(types.SET_FORCE_TREE_LABEL, data);
};
//  设置tab子菜单下标数组
export const SetForceTrueTopicLabels = ({ commit }, data) => {
  commit(types.SET_FORCE_TRUE_TOPIC_LABEL, data);
};
//  设置tab子菜单下标
export const SetForceTrueTopicLabelId = ({ commit }, data) => {
  commit(types.SET_FORCE_TRUE_TOPIC_LABEL_ID, data);
};