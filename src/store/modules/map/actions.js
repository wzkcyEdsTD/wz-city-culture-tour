import * as types from "./mutation-types";
import {
  getFarebr,
  getWzAllOutpatientCount,
  getWzAllDesignatedHospitals,
  getWzAllMedicalInsuranceInstitution,
  getWzAllMedicalInsurancePayment
} from "api/fetch";

//  设置全市橄榄数据
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

//  设置发热数据
export const SetFeverList = async function({ commit }) {
  const result = await getFarebr();
  const res = result.data.ranking_data;
  commit(types.SET_FEVER_LIST, res);
};

//  设置监控视频
export const SetRtmpList = ({ commit }, data) => {
  commit(types.SET_RTMP_LIST, data);
};
//  设置弹窗显隐
export const SetIsInfoFrame = ({ commit }, data) => {
  commit(types.SET_IS_INFO_FRAME, data);
};
