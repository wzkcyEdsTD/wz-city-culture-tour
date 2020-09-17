/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:07
 * @LastEditTime: 2020-09-03 15:40:51
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\store\modules\map\getters.js
 */
// 获取state
export const forceMapTypeBase = state => state.forceMapTypeBase;
export const currentMapType = state => state.currentMapType;
export const mapLoaded = state => state.mapLoaded;
export const initDataLoaded = state => state.initDataLoaded;
export const isInfoFrame = state => state.isInfoFrame;
export const rtmpList = state => state.rtmpList;
export const medicalList = state => state.medicalList;
export const medicalListWithGeometry = state => state.medicalListWithGeometry;
export const hospitalList = state => state.hospitalList;
export const WzAllData = state => state.WzAllData;
