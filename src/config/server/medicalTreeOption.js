/*
 * @Author: eds
 * @Date: 2020-07-29 16:10:06
 * @LastEditTime: 2020-08-17 11:10:27
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\config\server\cesiumTreeOption.js
 */
const SERVER_HOST = "http://10.36.217.240:8098/iserver/services";
const SERVER_SUFFIX = "/restjsr/v1/vectortile/maps";
// 旅游专题
const TOUR_TOPIC = [{
    label: "医疗场所",
    url: `${SERVER_HOST}/map-mongodbMvt-WenZhouNongJiaYue${SERVER_SUFFIX}`,
    map: "/医疗场所",
    icon: "救护场所",
    icon_size: 0,
    dataset: "JZJZNL_YLJH_JHCS"
  },
  {
    label: "百姓健身房",
    url: `${SERVER_HOST}/map-mongodbMvt-BaiXingJianShenFang${SERVER_SUFFIX}`,
    map: "/百姓健身房",
    icon: "百姓健身房",
    icon_size: 1,
    dataset: "百姓健身房"
  },
  {
    label: "城市书房",
    url: `${SERVER_HOST}/map-mongodbMvt-WenZhouShiYueDu${SERVER_SUFFIX}`,
    map: "/温州市阅读",
    icon: "市区阅读",
    icon_size: 1,
    dataset: "温州市阅读"
  },
];

const MODEL_3D_FINE = [{
  label: "精细三维",
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
