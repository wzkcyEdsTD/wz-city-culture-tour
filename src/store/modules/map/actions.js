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
import { getMedicalList } from "api/layerServerAPI";

//  设置全市概览数据
export const SetWzAllData = async ({ commit }) => {
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
  commit(types.SET_WZ_ALL_DATA, {
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

//  设置发热数据
export const fetchMedicalList = async ({ commit }) => {
  const result = await getMedicalList();
  const res = result.result;
  commit(types.SET_MEDICAL_LIST, res);
};

//  设置监控视频
export const SetRtmpList = ({ commit }, data) => {
  commit(types.SET_RTMP_LIST, data);
};
//  设置弹窗显隐
export const SetIsInfoFrame = ({ commit }, data) => {
  commit(types.SET_IS_INFO_FRAME, data);
};
