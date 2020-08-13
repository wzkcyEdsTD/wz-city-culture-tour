/*
 * @Author: eds
 * @Date: 2020-07-28 11:19:46
 * @LastEditTime: 2020-08-07 10:17:05
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\BimAnalyseFloorSection.js
 */
import { BimSourceURL } from "config/server/mapConfig";
const { SCENE_DATA_URL } = BimSourceURL;
const DATASOURCE_NAME = "第一栋";
const DATA_SETS = "结构框架@结构柱@楼板@墙@平台@梯段"
  .split("@")
  .map(v => `${DATASOURCE_NAME}:${v}`);

/**
 * async SQL query
 * @param {*} datasetNames
 * @param {*} bimHash
 * @param {*} selectedFloors_number
 */
const do_SQL_QUERY = (datasetNames, bimHash, selectedFloors_number) => {
  const key = datasetNames[0].split(":")[1];
  const hash = bimHash[key];
  return new Promise((resolve, reject) => {
    var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
    getFeatureParam = new SuperMap.REST.FilterParameter({
      attributeFilter: `所属楼层='${selectedFloors_number}'`
    });
    getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
      queryParameter: getFeatureParam,
      toIndex: -1,
      datasetNames
    });
    getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
      SCENE_DATA_URL,
      {
        eventListeners: {
          processCompleted: queryEventArgs => {
            const selectedFeatures = queryEventArgs.originResult.features;
            const feature = selectedFeatures[0];
            const _INDEX_ = feature ? feature.fieldNames.indexOf("SMID") : null;
            resolve({
              key,
              startID: hash,
              SMID:
                _INDEX_ || _INDEX_ > -1
                  ? selectedFeatures.map(v => parseInt(v.fieldValues[_INDEX_]))
                  : [],
              value:
                _INDEX_ || _INDEX_ > -1
                  ? selectedFeatures.map(
                      v => parseInt(v.fieldValues[_INDEX_]) + hash - 1
                    )
                  : []
            });
          },
          processFailed: () => {
            resolve({});
          }
        }
      }
    );
    getFeatureBySQLService.processAsync(getFeatureBySQLParams);
  });
};

/**
 * get SMIDS by floor
 * @param {*} context
 * @param {*} selectedFloors_number
 * @param {*} bimHash
 * @param {*} layer (none)
 */
export const queryFloorByBottom = (context, selectedFloors_number, bimHash) => {
  const PROMISES = [];
  DATA_SETS.map(async v => {
    PROMISES.push(do_SQL_QUERY([v], bimHash, selectedFloors_number));
  });
  Promise.all(PROMISES).then(values => {
    let IDS = [];
    values.map(({ key, value }) => {
      key && (IDS = IDS.concat(value));
    });
    context.SetForceBimIDS(IDS);
  });
};
