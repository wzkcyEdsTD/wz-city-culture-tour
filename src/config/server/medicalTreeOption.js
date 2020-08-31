/*
 * @Author: eds
 * @Date: 2020-07-29 16:10:06
 * @LastEditTime: 2020-08-31 14:34:56
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\config\server\medicalTreeOption.js
 */
const SERVER_HOST = "https://ditu.wzcitybrain.com/iserver/services";
const SERVER_SUFFIX = "/restjsr/v1/vectortile/maps";
const SW_DATA = "/data-SW_DATA/rest/data";
const SW_DATA_NAME = "172.20.83.196_swdata:";
const SERVER_DEFAULT_DATA = SERVER_HOST + SW_DATA;
// 医疗专题
const MEDICAL_TOPIC = [
  {
    label: "医疗场所",
    url: SERVER_DEFAULT_DATA,
    icon: "救护场所",
    icon_size: "large",
    dataset: "JZJZNL_YLJH_JHCS"
  }
];

const TOUR_TOPIC = [
  {
    label: "精品农家乐",
    url: SERVER_DEFAULT_DATA,
    icon: "精品农家乐",
    dataset: "温州农家乐"
  },
  {
    label: "旅游景点",
    url: SERVER_DEFAULT_DATA,
    icon: "旅游景点",
    dataset: "永嘉旅游景点地图"
  },
  {
    label: "温州民宿",
    url: SERVER_DEFAULT_DATA,
    icon: "温州民宿",
    dataset: "温州民宿"
  },
  {
    label: "百姓健身房",
    url: SERVER_DEFAULT_DATA,
    icon: "百姓健身房",
    dataset: "百姓健身房"
  },
  {
    label: "森林康养基地",
    url: SERVER_DEFAULT_DATA,
    icon: "森林康养基地",
    dataset: "温州市森林康养基地"
  },
  {
    label: "夜光经济",
    url: SERVER_DEFAULT_DATA,
    icon: "夜光经济",
    dataset: "夜景"
  },
  {
    label: "公厕",
    url: SERVER_DEFAULT_DATA,
    icon: "公厕",
    reduce: true,
    dataset: "PublicToilet"
  },
  {
    label: "精品旅游路线",
    url: SERVER_DEFAULT_DATA,
    icon: "精品旅游路线",
    componentEvent: "cesium-3d-event",
    componentKey: "line1"
  }
];
// 文化专题
const CULTURE_TOPIC = [
  {
    label: "爱国义务教育基地",
    url: SERVER_DEFAULT_DATA,
    icon: "爱国义务教育基地",
    dataset: "爱国主义教育基地"
  },
  {
    label: "市区阅读",
    url: SERVER_DEFAULT_DATA,
    icon: "市区阅读",
    dataset: "温州市阅读"
  },
  {
    label: "文化礼堂",
    url: SERVER_DEFAULT_DATA,
    icon: "文化礼堂",
    dataset: "文化礼堂"
  },
  {
    label: "文化生活",
    url: SERVER_DEFAULT_DATA,
    icon: "文化生活",
    dataset: "温州文化生活"
  }
];
//  应急专题
const EMERGENCY_TOPIC = [
  {
    label: "非煤矿山",
    url: SERVER_DEFAULT_DATA,
    icon: "非煤矿山",
    dataset: "D_HARAZDS_NONCOALMINE"
  },
  {
    label: "烟花爆竹经营单位",
    url: SERVER_DEFAULT_DATA,
    icon: "烟花爆竹经营单位",
    dataset: "D_HARAZDS_FIREWORKS"
  },
  {
    label: "应急避灾场所",
    url: SERVER_DEFAULT_DATA,
    icon: "应急避灾场所",
    reduce: true,
    dataset: "JZJZNL_BZAZCS"
  },
  {
    label: "应急队伍",
    url: SERVER_DEFAULT_DATA,
    icon: "应急队伍",
    reduce: true,
    dataset: "JZJZNL_YJDW"
  },
  {
    label: "加油站",
    url: SERVER_DEFAULT_DATA,
    icon: "加油站",
    dataset: "D_HAZARDS_GasStation"
  }
];

const MODEL_3D_FINE = [
  {
    label: "精细三维",
    componentEvent: "cesium-3d-event",
    componentKey: "3d1",
    action: "SetIsInfoFrame"
  }
];
const KG_INFO = [
  {
    label: "控规信息",
    url: `${SERVER_HOST}/map-KongGui_LuCheng/rest/maps/%E6%8E%A7%E8%A7%84%E4%B8%89%E5%8C%BA20200304%40172.20.83.196_swdata`
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
    id: "医疗专题",
    label: "医疗专题",
    children: MEDICAL_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
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
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
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
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
      };
    })
  },
  {
    id: "应急专题",
    label: "应急专题",
    children: EMERGENCY_TOPIC.map(v => {
      return {
        ...v,
        id: v.label,
        type: "mvt",
        newdataset: `${SW_DATA_NAME}${v.dataset}`
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
