/* eslint-disable */
let dataurl = "";
let measureurl = "";
let multilayersTable = [];
let basemapSourcesTiles = [];
let basemapTiles = "";
let queryAroundDataset = [];
let xzqhxs = "";
let xzqhxzjd = "";
let districtMap = [];
let districtDataServer = {};
let streetDataServer = {};
let zgmDataServer = {};
let yongjiaDataServer = {};
// let superMap3D = {}
const featureSearch = [
  "pg_wzyjdb:geo_disaster_p",
  "pg_wzyjdb:riverside_village",
  "pg_wzyjdb:natural_disaster_risk_prevention_area_P",
  "pg_wzyjdb:reservoir",
  "pg_wzyjdb:dyke",
  "pg_wzyjdb:pool",
  "pg_wzyjdb:seawall",
  "pg_wzyjdb:pump",
  "pg_wzyjdb:water_gate",
  "pg_wzyjdb:rural_drinking_water",
  "pg_wzyjdb:D_HAZARDS_CHEMICALSHP",
  "pg_wzyjdb:entertainment_place",
  "pg_wzyjdb:sports_gymnasium",
  "pg_wzyjdb:homestay",
  "pg_wzyjdb:market_mall",
  "pg_wzyjdb:rental_room",
  "pg_wzyjdb:tourist_spot",
  "pg_wzyjdb:training_organization",
  "pg_wzyjdb:D_HAZARDS_BEADHOUSESHP",
  "pg_wzyjdb:passenger_trans_unit",
  "pg_wzyjdb:D_HAZARDS_FOODMARKET",
  "pg_wzyjdb:agritainment",
  "pg_wzyjdb:D_HAZARDS_CULTURALPLACE",
  "pg_wzyjdb:high_buildings_P",
  "pg_wzyjdb:school",
  "pg_wzyjdb:D_HAZAZDS_ABOVESCALECOMPANYSHP"
];
const nearAnalysisLayers = [
  {
    layername: "疾控中心",
    alias: "GGYJZY_JKZX",
    url:
      "http://10.36.234.83:8090/iserver/services/data-wenzhouyingji/rest/data",
    datasetname: "pg_wzyjdb:JZJZNL_YLJH_JKZX",
    sql: "DATATYPE='疾控中心'",
    mapPopField: ["NAME", "DISTRICT", "ADDRESS"],
    mapPopName: ["名称", "区县", "地址"],
    icon: "./static/gitimage/gongongyingjiziyuan/jikongzhongxin.png"
  }
  // {
  //   layername: "救护场所",
  //   alias: "GGYJZY_JHCS",
  //   url: "http://10.36.234.83:8090/iserver/services/data-wenzhouyingji/rest/data",
  //   datasetname: "pg_wzyjdb:JZJZNL_YLJH_JHCS",
  //   sql: "DATATYPE='救护场所'",
  //   mapPopField: ["NAME","DISTRICT","ADDRESS"],
  //   mapPopName: ["名称","区县","地址"],
  //   icon: "./static/gitimage/gongongyingjiziyuan/jiuhuchangsuo.png"
  // }
  // {
  //   layername: "应急避难场所",
  //   alias: "YJBNS_YJBNS",
  //   url: "http://10.36.234.83:8090/iserver/services/data-wenzhouyingji/rest/data",
  //   datasetname: "pg_wzyjdb:JZJZNL_BZAZCS",
  //   sql: "DATATYPE='应急避难场所'",
  //   mapPopField: ["NAME","DISTRICT","ADDRESS"],
  //   mapPopName: ["名称","区县","地址"],
  //   icon: "./static/gitimage/jianzaijiuzai/yingjibinanchangsuo/cunshequji.png"
  // },
  // {
  //   layername: "消防站",
  //   alias: "GGYJZY_XFZ",
  //   url: "http://10.36.234.83:8090/iserver/services/data-wenzhouyingji/rest/data",
  //   datasetname: "pg_wzyjdb:JZJZNL_XFJYNL_XFZ",
  //   sql: "DATATYPE='消防站'",
  //   mapPopField: ["NAME","DISTRICT","ADDRESS","TYPE"],
  //   mapPopName: ["名称","地区","地址","类型"],
  //   icon: "./static/gitimage/jianzaijiuzai/xiaofangjiuyuannengli/xiaofangzhan.png"
  // }
];

const WWW_MAP = document.location.protocol + "//" + window.location.host;
// console.log('WWW_MAP: ' + WWW_MAP)
// if (WWW_MAP.indexOf('http://pshyz.f3322.net:9000') >= 0 || WWW_MAP.indexOf('http://localhost') === 0) {
//   dataurl = 'http://pshyz.f3322.net:8099/iserver/services/data-wenzhouyingji/rest/data'
//   measureurl = 'http://pshyz.f3322.net:8099/iserver/services/map-world/rest/maps/World'
//   multilayersTable = ['化工及危化品企业', '规上工贸企业', '非煤矿山', '烟花爆竹经营单位']
//   basemapSourcesTiles = [
//     {
//       name: 'wenzhou-raster',
//       tiles: 'http://172.20.83.218:8090/iserver/services/map-wzmap/rest/maps/TDT/zxyTileImage.png?prjCoordSys={"epsgCode":3857}&z={z}&x={x}&y={y}'
//     },
//     {
//       name: 'ArcGIS-raster',
//       tiles: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'
//     },
//     {
//       name: 'bigdata-vectortile',
//       tiles: 'http://172.20.83.218:8090/iserver/services/map-mvt-DSJ0116/restjsr/v1/vectortile/maps/DSJ0116/style.json'
//     },
//     {
//       name: 'standard-vectortile',
//       tiles: 'http://172.20.83.218:8090/iserver/services/map-mvt-TDT/restjsr/v1/vectortile/maps/TDT/style.json'
//     },
//     {
//       name: 'bigdata-raster',
//       tiles: 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000'
//     },
//     {
//       name: 'standard-raster',
//       tiles: 'http://pshyz.f3322.net:8099/iserver/services/map-agscache-ZWPTSGWZCGCS2000/rest/maps/ZWPT_SG_WZ_CGCS2000'
//       // tiles: 'http://10.36.245.203:8090/iserver/services/map-agscache-ZWPTSGWZCGCS2000/rest/maps/ZWPT_SG_WZ_CGCS2000'
//     },
//     {
//       name: '2012YX',
//       tiles: 'http://10.36.245.203:8090/iserver/services/map-agscachev2-Layers2/rest/maps/Layers'
//     },
//     {
//       name: '2014YX',
//       tiles: 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YX2014CGC2000/rest/maps/YX_2014_CGC2000'
//     },
//     {
//       name: '2017YX',
//       tiles: 'http://10.36.245.203:8090/iserver/services/map-agscachev2-Layers/rest/maps/Layers'
//     },
//     {
//       name: '2018YX',
//       tiles: 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YX2018CGC2000/rest/maps/YX_2018_CGC2000'
//     },
//     {
//       name: '2019YX',
//       // tiles: 'http://10.36.245.203:8090/iserver/services/map-agscache-ZWPTYX2019WZCGCS2000/rest/maps/ZWPT_YX_2019_WZ_CGCS2000'
//       tiles: 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJYX2019CGCS2000/rest/maps/YJ_YX_2019_CGCS2000'
//     },
//     {
//       name: '2019YXZJ',
//       tiles: 'http://10.36.245.203:8090/iserver/services/map-agscachev2-YJYXZJ2019CGCS2000/rest/maps/YJ_YXZJ_2019_CGCS2000'
//     }
//   ]
//   basemapTiles = 'standard-raster'
//   queryAroundDataset = [
//     { layername: '学校', datasetname: 'pg_wzyjdb:school' },
//     { layername: '市场商场', datasetname: 'pg_wzyjdb:market_mall' },
//     { layername: '高层建筑', datasetname: 'pg_wzyjdb:high_buildings' },
//     { layername: '养老院', datasetname: 'pg_wzyjdb:D_HAZARDS_BEADHOUSESHP' },
//     { layername: '小区', datasetname: 'pg_wzyjdb:D_HAZARDS_COMMUNITYSHP' },
//     { layername: '应急避难场所', datasetname: 'pg_wzyjdb:D_RESOURCES_SHELTERSHP' },
//     { layername: '医疗卫生结构', datasetname: 'pg_wzyjdb:hospital' }
//   ]
//   xzqhxs = 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/XZQUXS'
//   // xzqhxs = 'http://10.36.234.83:8090/iserver/services/map-QuHuaPeiTu/rest/maps/XZQUXS'
//   xzqhxzjd = 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/XZQHXZJD'
//   districtMap = [
//     {
//       name: '泰顺县',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/tsx'
//     },
//     {
//       name: '苍南县',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/cnx'
//     },
//     {
//       name: '文成县',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/wcx'
//     },
//     {
//       name: '平阳县',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/pyx'
//     },
//     {
//       name: '瑞安市',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ras'
//     },
//     {
//       name: '瓯海区',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ohq'
//     },
//     {
//       name: '龙湾区',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lwq'
//     },
//     {
//       name: '洞头区',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/dtq'
//     },
//     {
//       name: '鹿城区',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lcq'
//     },
//     {
//       name: '永嘉县',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yjx'
//     },
//     {
//       name: '乐清市',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yqs'
//     },
//     {
//       name: '龙港市',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lgs'
//     },
//     {
//       name: '经开区',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/jkq'
//     },
//     {
//       name: '瓯江口',
//       tiles: 'http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ojk'
//     }
//   ]
//   districtDataServer = {
//     url: 'http://pshyz.f3322.net:8099/iserver/services/data-wenzhouyingji/rest/data',
//     alias: 'district',
//     datasetname: 'pg_wzyjdb:xzqhm',
//     sql: 'SMID>=0'
//   }
//   streetDataServer = {
//     url: 'http://pshyz.f3322.net:8099/iserver/services/data-wenzhouyingji/rest/data',
//     alias: 'street',
//     datasetname: 'pg_wzyjdb:qhmxzjd',
//     sql: 'SMID>=0'
//   }
//   zgmDataServer = {
//     url: 'http://pshyz.f3322.net:8099/iserver/services/data-wenzhouyingji/rest/data',
//     alias: 'district',
//     datasetname: 'pg_wzyjdb:ZGM',
//     sql: 'SMID>=0'
//   }
//   yongjiaDataServer = {
//     url: 'http://10.36.234.83:8090/iserver/services/data-wenzhouyingji/rest/data',
//     alias: 'district',
//     datasetname: 'pg_wzyjdb:YJ_ZGM',
//     sql: 'SMID>=0'
//   }
// } else {
dataurl =
  "http://10.36.234.83:8090/iserver/services/data-wenzhouyingji/rest/data";
measureurl =
  "http://172.20.83.218:8090/iserver/services/map-world/rest/maps/World";
multilayersTable = [
  "化工及危化品企业",
  "规上工贸企业",
  "非煤矿山",
  "烟花爆竹经营单位"
];
basemapSourcesTiles = [
  {
    name: "wenzhou-raster",
    tiles:
      'http://172.20.83.218:8090/iserver/services/map-wzmap/rest/maps/TDT/zxyTileImage.png?prjCoordSys={"epsgCode":3857}&z={z}&x={x}&y={y}'
  },
  {
    name: "ArcGIS-raster",
    tiles:
      "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
  },
  {
    name: "bigdata-vectortile",
    tiles:
      "http://172.20.83.218:8090/iserver/services/map-mvt-DSJ0116/restjsr/v1/vectortile/maps/DSJ0116/style.json"
  },
  {
    name: "standard-vectortile",
    tiles:
      "http://172.20.83.218:8090/iserver/services/map-mvt-TDT/restjsr/v1/vectortile/maps/TDT/style.json"
  },
  {
    name: "bigdata-raster",
    tiles:
      "http://10.36.245.203:8090/iserver/services/map-agscachev2-YJDSJCGCS2000/rest/maps/YJ_DSJ_CGCS2000"
  },
  {
    name: "standard-raster",
    // tiles: 'http://10.36.245.203:8090/iserver/services/map-agscache-ZWPTSGWZCGCS2000/rest/maps/ZWPT_SG_WZ_CGCS2000'
    tiles:
      "http://10.36.245.203:8090/iserver/services/map-agscachev2-YJSGBZB2019CGCS2000/rest/maps/YJ_SG_BZB_2019_CGCS2000"
  },
  {
    name: "2012YX",
    tiles:
      "http://10.36.245.203:8090/iserver/services/map-agscachev2-Layers2/rest/maps/Layers"
  },
  {
    name: "2014YX",
    tiles:
      "http://10.36.245.203:8090/iserver/services/map-agscachev2-YX2014CGC2000/rest/maps/YX_2014_CGC2000"
  },
  {
    name: "2017YX",
    tiles:
      "http://10.36.245.203:8090/iserver/services/map-agscachev2-Layers/rest/maps/Layers"
  },
  {
    name: "2018YX",
    tiles:
      "http://10.36.245.203:8090/iserver/services/map-agscachev2-YX2018CGC2000/rest/maps/YX_2018_CGC2000"
  },
  {
    name: "2019YX",
    // tiles: 'http://10.36.245.203:8090/iserver/services/map-agscache-ZWPTYX2019WZCGCS2000/rest/maps/ZWPT_YX_2019_WZ_CGCS2000'
    tiles:
      "http://10.36.245.203:8090/iserver/services/map-agscachev2-YJYX2019CGCS2000/rest/maps/YJ_YX_2019_CGCS2000"
  },
  {
    name: "2019YXZJ",
    tiles:
      "http://10.36.245.203:8090/iserver/services/map-agscachev2-YJYXZJ2019CGCS2000/rest/maps/YJ_YXZJ_2019_CGCS2000"
  }
];
basemapTiles = "standard-raster";
queryAroundDataset = [
  { layername: "学校", datasetname: "pg_wzyjdb:school" },
  { layername: "市场商场", datasetname: "pg_wzyjdb:market_mall" },
  { layername: "高层建筑", datasetname: "pg_wzyjdb:high_buildings" },
  { layername: "养老院", datasetname: "pg_wzyjdb:D_HAZARDS_BEADHOUSESHP" },
  { layername: "小区", datasetname: "pg_wzyjdb:D_HAZARDS_COMMUNITYSHP" },
  {
    layername: "应急避难场所",
    datasetname: "pg_wzyjdb:D_RESOURCES_SHELTERSHP"
  },
  { layername: "医疗卫生结构", datasetname: "pg_wzyjdb:hospital" }
];
xzqhxs = "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/XZQUXS";
// xzqhxs = 'http://10.36.234.83:8090/iserver/services/map-QuHuaPeiTu/rest/maps/XZQUXS'
xzqhxzjd =
  "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/XZQHXZJD";
districtMap = [
  {
    name: "泰顺县",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/tsx"
  },
  {
    name: "苍南县",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/cnx"
  },
  {
    name: "文成县",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/wcx"
  },
  {
    name: "平阳县",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/pyx"
  },
  {
    name: "瑞安市",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ras"
  },
  {
    name: "瓯海区",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ohq"
  },
  {
    name: "龙湾区",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lwq"
  },
  {
    name: "洞头区",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/dtq"
  },
  {
    name: "鹿城区",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lcq"
  },
  {
    name: "永嘉县",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yjx"
  },
  {
    name: "乐清市",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/yqs"
  },
  {
    name: "龙港市",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/lgs"
  },
  {
    name: "经开区",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/jkq"
  },
  {
    name: "瓯江口",
    tiles: "http://10.36.234.83:8090/iserver/services/map-XZQH/rest/maps/ojk"
  }
];
districtDataServer = {
  url: "http://10.36.234.83:8090/iserver/services/data-wenzhouyingji/rest/data",
  alias: "district",
  datasetname: "pg_wzyjdb:xzqhm",
  sql: "SMID>=0"
};
streetDataServer = {
  url: "http://10.36.234.83:8090/iserver/services/data-wenzhouyingji/rest/data",
  alias: "street",
  datasetname: "pg_wzyjdb:qhmxzjd",
  sql: "SMID>=0"
};
zgmDataServer = {
  url: "http://10.36.234.83:8090/iserver/services/data-wenzhouyingji/rest/data",
  alias: "district",
  datasetname: "pg_wzyjdb:ZGM",
  sql: "SMID>=0"
};
yongjiaDataServer = {
  url: "http://10.36.234.83:8090/iserver/services/data-wenzhouyingji/rest/data",
  alias: "district",
  datasetname: "pg_wzyjdb:YJ_ZGM",
  sql: "SMID>=0"
};
// superMap3D = {
//   url: 'http://10.36.234.83:8090/iserver/services/3D-dsjmap/rest/realspace'
// }
// }

export default {
  dataurl,
  measureurl,
  multilayersTable,
  basemapSourcesTiles,
  basemapTiles,
  queryAroundDataset,
  xzqhxs,
  xzqhxzjd,
  districtMap,
  districtDataServer,
  streetDataServer,
  zgmDataServer,
  yongjiaDataServer,
  featureSearch,
  nearAnalysisLayers
  // superMap3D = {
  //   url: 'http://10.36.234.83:8090/iserver/services/3D-dsjmap/rest/realspace'
  // }
};
/* eslint-disable */
