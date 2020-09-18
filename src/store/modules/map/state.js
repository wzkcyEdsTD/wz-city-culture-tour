/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:07
 * @LastEditTime: 2020-09-03 15:52:48
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\store\modules\map\state.js
 */
const state = {
  forceMapTypeBase: true,
  currentMapType: "cesiumMap", // 地图类型  四色图 sandian cesiumMap
  initDataLoaded: false, // 地图底图是否加载完毕
  //  详情
  isInfoFrame: false,
  //  视频列表
  rtmpList: [],
  //  医院数据
  medicalList: {},
  medicalListWithGeometry: [],
  //  医院
  hospitalList: [],
  //  总体概览
  WzAllData: {},
  //  指标下表
  forceIndex: '城市总览',
};
export default state;
