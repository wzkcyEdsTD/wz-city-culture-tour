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
  getWzAllOutpatientCount,
  getWzAllDesignatedHospitals,
  getWzAllMedicalInsuranceInstitution,
  getWzAllMedicalInsurancePayment
} from "api/cityBrainAPI";
import { getMedicalList, getBayonetList, fetchWzOverviewData, fetchWzTrafficData, fetchTourData, fetchCultureData, fetchSourceData, fetchBasicData } from "api/layerServerAPI";

//  获取全市总览数据
export const SetWzOverviewData = async ({ commit, state }) => {
  if (!Object.keys(state.WzOverviewData).length) {
    const { result } = await fetchWzOverviewData();
    commit(types.SET_WZ_OVERVIEW_dATA, result);
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
    console.log(result);
    commit(types.SET_WZ_BASIC_DATA, result);
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
export const SetWzMedicalData = async ({ commit }) => {
  const outpatientCount = await getWzAllOutpatientCount();
  const designatedHospitals = await getWzAllDesignatedHospitals();
  const medicalInsuranceInstitution = await getWzAllMedicalInsuranceInstitution();
  const medicalInsurancePayment = await getWzAllMedicalInsurancePayment();
  const designatedHospitalsNum = eval(
    designatedHospitals.data.map(v => parseInt(v.sl)).join("+")
  );
  const medicalInsurancePaymentNum = eval(
    medicalInsurancePayment.data.map(v => parseFloat(v.je)).join("+")
  );
  commit(types.SET_WZ_MEDICAL_DATA, {
    outpatientCount: outpatientCount.data.currentNum,
    designatedHospitals: designatedHospitalsNum,
    medicalInsuranceInstitution: medicalInsuranceInstitution.data.currentNum,
    medicalInsurancePayment: (medicalInsurancePaymentNum / 10000).toFixed(1)
  });
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
  const result = await getMedicalList();
  const res = result.result;
  commit(types.SET_MEDICAL_LIST, res);
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

//  设置站点数据
export const fetchStationList = async ({ commit }) => {
  const result = await getStationList();
  const res = result.result;
  commit(types.SET_STATION_LIST, res);
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
  const result = await getBayonetList();
  const res = result.result;
  commit(types.SET_BAYONET_LIST, res);
  commit(types.SET_INIT_DATA_LOADED, true)
};

//  设置监控视频
export const SetRtmpList = ({ commit }, data) => {
  commit(types.SET_RTMP_LIST, data);
};
//  设置弹窗显隐
export const SetIsInfoFrame = ({ commit }, data) => {
  commit(types.SET_IS_INFO_FRAME, data);
};
//  设置展示指标
export const SetForceIndex = ({ commit }, data) => {
  commit(types.SET_FORCE_INDEX, data);
};