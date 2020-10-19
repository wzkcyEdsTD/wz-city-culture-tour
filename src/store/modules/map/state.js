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
  rtmpListOther: [],
  //  医院数据
  medicalList: {},
  medicalListWithGeometry: [],
  //  站点数据
  stationList: {},
  stationListWithGeometry: [],
  //  卡口数据
  bayonetList: {},
  bayonetListWithGeometry: [],
  //  重点景区流量
  tourPointList: {},
  tourPointListWithGeometry: [],
  //  医院
  hospitalList: [],
  //  各模块概览信息
  WzOverviewData: {},   //  城市总览指标
  WzMedicalData: {},    //  城市医疗指标
  WzTourData: {},       //  城市旅游指标
  WzCultureData: {},    //  城市文化指标
  WzBasicData: {},      //  城市基础指标
  WzSourceData: {},     //  城市资源指标
  WzTrafficData: {},    //  城市交通指标
  WzEmergencyData: {},  //  城市应急指标
  //  时间轮盘
  forceTime: 'now',
  //  白天黑夜
  nightMode: true,
  //  相机转动
  cameraMode: false,
  //  指标下表
  forceIndex: '医疗专题',
  //  tab下标
  forceTreeLabel: "医疗专题",
  forceTrueTopicLabels: [],
  forceTrueTopicLabelId: "",
};
export default state;
