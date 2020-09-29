/*
 * @Author: eds
 * @Date: 2020-08-11 20:39:44
 * @LastEditTime: 2020-09-14 16:38:02
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\config\server\mapConfig.js
 */
export const ServiceUrl = {
  // 温州白模 暂不用
  WZBaimo:
    // "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-BaiMoLuCheng/rest/realspace/datas/BaiMo_LuCheng/config",
    // "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb/rest/realspace/datas/RES_LC_Model@baimo/config",
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-RESPYQSY/rest/realspace/datas/RES_PY_QSY/config",
  //  白模分区
  WZBaimo_OBJ: [
    {
      KEY: 'WZBaimo_POINT_AROUND',
      URL: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-BaiMoLuChengEraShiZhengFu/rest/realspace/datas/BaiMo_LuCheng_EraShiZhengFu/config",
      FLOW: true
    },
    {
      KEY: 'WZBaimo_POINT_CENTER',
      URL: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-ShiZhengFuModel/rest/realspace/datas/ShiZhengFu_Model/config",
      FLOW: true
    },
  ],
  //  水面模型切片
  RIVER: "https://ditu.wzcitybrain.com/iserver/services/3D-River_CityBrain/rest/realspace/datas/River_CityBrain/config",
  //  影像底图
  SWImage:
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-YX2019SW/rest/realspace/datas/YX_2019_SW",
  //  大数据底图
  DataImage:
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-DSJCGS2000SW/rest/realspace/datas/DSJ_CGS2000_SW",
  // 全市域地形
  YJDem:
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-DEMLC/rest/realspace/datas/DEM_LC",
  // mvt矢量服务
  YJMVT:
    "https://ditu.wzcitybrain.com/iserver/services/map-mongodbMvt-Routesdata3/restjsr/v1/vectortile/maps/Routes_data3",
  //  重要地物注记
  KEYMVT: "https://ditu.wzcitybrain.com/iserver/services/map-mongodbMvt-ZhongYaoDiWu/restjsr/v1/vectortile/maps/ZhongYaoDiWu",
  //  全市区精模
  WZMODEL:
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-JMLC20121/rest/realspace/datas/JM_LC_2012_1/config",
  SCENE_WZMODEL: [
    { key: "ZGDYP_ZB", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_ZB/config" },
    { key: "ZGDYP_DL", d: 5500, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_DL/config" },
    { key: "ZGDYP_QT", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_QT/config" },
    { key: "ZGDYP_SX", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_SX/config" },
    { key: "ZGDYP_JZ", d: 5500, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_JZ/config" },
    { key: "ZGDYP_DX", d: 5500, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_DX/config" },
    { key: "MaxShijuJZ", d: 5500, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/MaxShijuJZ/config" },
    { key: "MaxShijuQT", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/MaxShijuQT/config" },
  ],
  ROAD_LAMP: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-LightModel/rest/realspace/datas/LightModel/config"
};

export const ImagesURL = [
  { year: 2019, url: "https://sourceserver.wzcitybrain.com/iserver/services/map-agscachev2-YJYX2019CGCS2000/rest/maps/YJ_YX_2019_CGCS2000" },
  { year: 2018, url: "https://sourceserver.wzcitybrain.com/iserver/services/map-agscachev2-YX2018CGC2000/rest/maps/YX_2018_CGC2000" },
  { year: 2017, url: "https://sourceserver.wzcitybrain.com/iserver/services/map-agscachev2-Layers/rest/maps/Layers" },
  { year: 2014, url: "https://sourceserver.wzcitybrain.com/iserver/services/map-agscachev2-YX2014CGC2000/rest/maps/YX_2014_CGC2000" },
  { year: 2012, url: "https://sourceserver.wzcitybrain.com/iserver/services/map-agscachev2-Layers2/rest/maps/Layers" },
]

export const ExtraSourceURL = {
  S1:
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-S1/rest/realspace/datas/S1/config",
};


export const BimSourceURL = {
  SCENE_URL:
    "http://172.20.83.223:8098/iserver/services/3D-Placement_house_0728/rest/realspace",
  SCENE_DATA_URL:
    "http://172.20.83.223:8098/iserver/services/data-Placement_house_0728/rest/data",
  SCENE_SQL_URL:
    "http://172.20.83.223:8098/iserver/services/data-SW_Data/rest/data/featureResults.rjson?returnContent=true",
  STATION_SCENE_URL:
    "http://172.20.83.223:8098/iserver/services/3D-Airport_Station/rest/realspace",
  STATION_DATA_URL:
    "http://172.20.83.223:8098/iserver/services/data-Airport_Station/rest/data",
  UNDERGROUND_SCENE_URL:
    "http://172.20.83.223:8098/iserver/services/3D-GSLINE/rest/realspace"
};
