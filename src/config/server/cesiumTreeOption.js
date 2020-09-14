/*
 * @Author: eds
 * @Date: 2020-07-29 16:10:06
 * @LastEditTime: 2020-09-14 14:33:14
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\config\server\cesiumTreeOption.js
 */
const SERVER_HOST = "http://10.36.217.240:8098/iserver/services";
const SERVER_SUFFIX = "/restjsr/v1/vectortile/maps";
// 旅游专题
const TOUR_TOPIC = [{
    label: "精品农家乐",
    url: `${SERVER_HOST}/map-mongodbMvt-WenZhouNongJiaYue${SERVER_SUFFIX}`,
    map: "/温州农家乐",
    icon: "精品农家乐",
    dataset: "温州农家乐"
  },
  {
    label: "旅游景点",
    url: `${SERVER_HOST}/map-mongodbMvt-YongJiaLvYouJingDianDiTu${SERVER_SUFFIX}`,
    map: "/永嘉旅游景点地图",
    icon: "旅游景点",
    dataset: "永嘉旅游景点地图"
  },
  {
    label: "温州民宿",
    url: `${SERVER_HOST}/map-mongodbMvt-WenZhouMinSu${SERVER_SUFFIX}`,
    map: "/温州民宿",
    icon: "温州民宿",
    dataset: "温州民宿"
  },
  {
    label: "百姓健身房",
    url: `${SERVER_HOST}/map-mongodbMvt-BaiXingJianShenFang${SERVER_SUFFIX}`,
    map: "/百姓健身房",
    icon: "百姓健身房",
    dataset: "百姓健身房"
  },
  {
    label: "森林康养基地",
    url: `${SERVER_HOST}/map-mongodbMvt-WenZhouShiSenLinKangYangJi${SERVER_SUFFIX}`,
    map: "/温州市森林康养基",
    icon: "森林康养基地",
    dataset: "温州市森林康养基地"
  },
  {
    label: "夜光经济",
    url: `${SERVER_HOST}/map-mongodbMvt-YeJing${SERVER_SUFFIX}`,
    map: "/夜景",
    icon: "夜光经济",
    dataset: "夜景"
  },
  {
    label: "精品旅游路线",
    // url: `${SERVER_HOST}/map-mongodbMvt-YeJing${SERVER_SUFFIX}`,
    map: "/精品旅游路线",
    icon: "精品旅游路线",
    // dataset: "精品旅游路线",
    componentEvent: "cesium-3d-event",
    componentKey: "line1",
  }
];
// 文化专题
const CULTURE_TOPIC = [{
    label: "爱国义务教育基地",
    url: `${SERVER_HOST}/map-mongodbMvt-AiGuoZhuYiJiaoYuJiDi${SERVER_SUFFIX}`,
    map: "/爱国主义教育基地",
    icon: "爱国义务教育基地",
    dataset: "爱国主义教育基地"
  },
  {
    label: "市区阅读",
    url: `${SERVER_HOST}/map-mongodbMvt-WenZhouShiYueDu${SERVER_SUFFIX}`,
    map: "/温州市阅读",
    icon: "市区阅读",
    dataset: "温州市阅读"
  },
  {
    label: "文化礼堂",
    url: `${SERVER_HOST}/map-mongodbMvt-WenHuaLiTang${SERVER_SUFFIX}`,
    map: "/文化礼堂",
    icon: "文化礼堂",
    dataset: "文化礼堂"
  },
  {
    label: "文化生活",
    url: `${SERVER_HOST}/map-mongodbMvt-WenZhouWenHuaShengHuo${SERVER_SUFFIX}`,
    map: "/温州文化生活",
    icon: "文化生活",
    dataset: "温州文化生活"
  }
];
const MODEL_3D_FINE = [{
  label: "南塘精细三维",
  url: `${SERVER_HOST}/3D-mongodb-JMLCDNJD/rest/realspace/datas/JM_LCDNJD/config`,
  componentEvent: "cesium-3d-event",
  componentKey: "3d1",
  action: "SetIsInfoFrame"
}];
const KG_INFO = [{
  label: "控规信息",
  url: "http://172.20.83.223:8090/iserver/services/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata"
}];
export const CESIUM_TREE_OPTION = [{
    id: "精细三维",
    label: "精细三维",
    children: MODEL_3D_FINE.map(v => {
      return {
        ...v,
        id: v.label,
        type: "model"
      };
    })
  },
  {
    id: "旅游专题",
    label: "旅游专题",
    children: TOUR_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        type: "mvt"
      };
    })
  },
  {
    id: "文化专题",
    label: "文化专题",
    children: CULTURE_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        type: "mvt"
      };
    })
  },
  {
    id: "控规信息",
    label: "控规信息",
    children: KG_INFO.map(v => {
      return {
        ...v,
        id: v.label,
        type: "image"
      };
    })
  }
];
