/*
 * @Author: eds
 * @Date: 2020-08-11 20:39:44
 * @LastEditTime: 2020-09-14 16:38:02
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\config\server\mapConfig.js
 */
export const ServiceUrl = {
  // 温州白模
  WZBaimo:
    // "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-BaiMoLuCheng/rest/realspace/datas/BaiMo_LuCheng/config",
    // "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb/rest/realspace/datas/RES_LC_Model@baimo/config",
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-RESPYQSY/rest/realspace/datas/RES_PY_QSY/config",
  //  白模分区
  WZBaimo_OBJ: [
    {
      KEY: 'WZBaimo_POINT_AROUND',
      URL: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-BaiMoLuChengEraShiZhengFu/rest/realspace/datas/BaiMo_LuCheng_EraShiZhengFu/config",
      FLOW : true
    }
  ]
  ,
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
    "https://ditu.wzcitybrain.com/iserver/services/map-mongodbMvt-SWmap/restjsr/v1/vectortile/maps/SW_map",
  //  全市区精模
  WZMODEL:
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-JMLC20121/rest/realspace/datas/JM_LC_2012_1/config",
  SCENE_WZMODEL: {
    BUILDING:
      "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb2/rest/realspace/datas/MAXShiQu2012JZ/config",
    OTHERS:
      "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb2/rest/realspace/datas/MAXShiQu2012QT/config"
  }
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
