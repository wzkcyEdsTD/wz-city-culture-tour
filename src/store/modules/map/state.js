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
  WzEventData: {},
  //  时间轮盘
  forceTime: 'now',
  //  白天黑夜
  nightMode: true,
  //  相机转动
  cameraMode: false,
  //  指标下表
  forceIndex: '城市总览',
  //  tab下标
  forceTreeLabel: "城市总览",
  forceTreeEventLabel: "事件专题",
  //  树选择类型
  forceTrueTopicLabels: [], //  资源图层选中子节点
  forceTrueTopicLabelId: "",//  资源图层当前选中节点
  forceEventTopicLabels: [], //  事件图层选中子节点
  forceEventTopicLabelId: "",//  事件图层当前选中节点
  //  搜索框是否展示
  searchBoxVisible: false,
  //  搜索框模式 1资源 2事件 3地名地址
  searchBoxModel: 1,
  //  图层模式
  isSourceLayer: true,
  //  事件条件
  eventFormParams: {
    timeType: 1,
    areaCode: -1,
    status: -1
  },
  //  唯一 模块
  subModel: '3d1',
  //  区县街镇
  areaCodeList: []
};
export default state;
