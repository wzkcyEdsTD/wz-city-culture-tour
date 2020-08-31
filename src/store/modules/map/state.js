/*
 * @Author: eds
 * @Date: 2020-07-01 15:22:07
 * @LastEditTime: 2020-08-31 10:15:25
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\store\modules\map\state.js
 */
const state = {
  forceMapTypeBase: true,
  currentMapType: "cesiumMap", // 地图类型  四色图 sandian cesiumMap
  mapLoaded: false, // 地图底图是否加载完毕
  //  详情
  isInfoFrame: false,
  //  视频列表
  rtmpList: [],
  //  发热数据
  feverList: [],
  //  医院
  hospitalList: [],
  //  总体概览
  WzAllData: {}
};
export default state;
