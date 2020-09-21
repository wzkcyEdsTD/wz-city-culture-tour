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
export const stationList = state => state.stationList;
export const stationListWithGeometry = state => state.stationListWithGeometry;
export const bayonetList = state => state.bayonetList;
export const bayonetListWithGeometry = state => state.bayonetListWithGeometry;
export const hospitalList = state => state.hospitalList;
export const WzMedicalData = state => state.WzMedicalData;
export const WzOverviewData = state => state.WzOverviewData;
export const WzTrafficData = state => state.WzTrafficData;
export const WzTourData = state => state.WzTourData;
export const WzCultureData = state => state.WzCultureData;
export const forceIndex = state => state.forceIndex;