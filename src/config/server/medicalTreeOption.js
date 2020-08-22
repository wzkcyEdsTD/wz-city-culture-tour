/*
 * @Author: eds
 * @Date: 2020-07-29 16:10:06
 * @LastEditTime: 2020-08-22 21:52:17
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\config\server\medicalTreeOption.js
 */
const SERVER_HOST = "https://ditu.wzcitybrain.com/iserver/services";
const SERVER_SUFFIX = "/restjsr/v1/vectortile/maps";
// 旅游专题
const TOUR_TOPIC = [
  {
    label: "救护场所",
    url: `${SERVER_HOST}/map-mongodbMvt-WenZhouNongJiaYue${SERVER_SUFFIX}`,
    map: "/救护场所",
    icon: "救护场所",
    dataset: "JZJZNL_YLJH_JHCS"
  }
  // {
  //   label: "旅游景点",
  //   url: `${SERVER_HOST}/map-mongodbMvt-YongJiaLvYouJingDianDiTu${SERVER_SUFFIX}`,
  //   map: "/永嘉旅游景点地图",
  //   icon: "旅游景点",
  //   dataset: "永嘉旅游景点地图"
  // },
];

const MODEL_3D_FINE = [
  {
    label: "南塘精细三维",
    url: `${SERVER_HOST}/3D-mongodb-JMLC20121/rest/realspace/datas/JM_LC_2012_1/config`,
    componentEvent: "cesium-3d-event",
    componentKey: "3d1",
    action: "SetIsInfoFrame"
  }
];
const KG_INFO = [
  {
    label: "控规信息",
    url:
      "http://172.20.83.223:8090/iserver/services/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata"
  }
];
export const CESIUM_TREE_OPTION = [
  {
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
    id: "医疗资源",
    label: "医疗资源",
    children: TOUR_TOPIC.map(v => {
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
