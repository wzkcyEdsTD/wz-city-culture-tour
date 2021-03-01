/*
 * @Author: eds
 * @Date: 2020-09-03 15:04:37
 * @LastEditTime: 2020-09-11 17:05:49
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\treeTool\TreeDrawTool.js
 */
import { isDayOff } from "common/js/util";
// 标识配置
const labelConfig = {
  fillColor: Cesium.Color.WHITE,
  outlineColor: Cesium.Color.BLACK,
  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  font: "10px",
  scale: 1,
  outlineWidth: 4,
  showBackground: true,
  backgroundColor: Cesium.Color(0.165, 0.165, 0.165, 0.1),
  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000),
  pixelOffset: new Cesium.Cartesian2(0, -30),
  disableDepthTestDistance: Number.POSITIVE_INFINITY,
}
//  图像配置
const billboardConfig = {
  width: 34,
  height: 34,
  disableDepthTestDistance: Number.POSITIVE_INFINITY,
}

/**
 * 取面中心点
 * @param {*} arr
 * @param {*} height
 */
const getCenterOfPolygon = (arr, height) => {
  let x = 0,
    y = 0;
  arr.map((v, index) => {
    index % 2 == 0 ? (x += v) : (y += v);
  });
  return [(x * 2) / arr.length, (y * 2) / arr.length, height];
};

/**
 * 别名数组转对象
 * @param {*} fields
 */
const fixFieldsByArr = fields => {
  const fieldHash = {};
  fields.map(({ name, caption }) => {
    const reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    reg.test(caption) ? (fieldHash[name.toLowerCase()] = caption) : undefined;
  });
  return fieldHash;
};

/**
 * 属性名替换中文别名
 * @param {*} attributes
 * @param {*} fields
 */
const fixAttributesByOrigin = (attributes, fields) => {
  const fixAttributes = {};
  for (let v in attributes) {
    const V = v.toLowerCase();
    fields[V] ? (fixAttributes[fields[V]] = attributes[v]) : undefined;
  }
  return fixAttributes;
};

/**
 * 从feature数组里剔除有信息的个例，并返回新的两个数组
 * @param {*} gArr
 * @param {*} eObj
 * @param {*} node
 * @param {*} context
 */
export const fixTreeWithExtra = (gArr, eObj, node, context) => {
  const extraKeys = Object.keys(eObj);
  const drawFeatures = [];
  const extraFeatures = [];
  gArr.map(item => {
    const { attributes } = item;
    ~extraKeys.indexOf(attributes[node.withExtraKey])
      ? extraFeatures.push({ ...item, extra_data: eObj[attributes[node.withExtraKey]] })
      : drawFeatures.push(item);
  });
  context[node.saveExtraDataByGeometry](extraFeatures);
  // context.searchFilter();
  return { drawFeatures };
};

/**
 * 画点、面
 * @param {*} context
 * @param {*} param1
 * @param {*} node
 * @param {*} fields 别名数组
 * @param {function} fn 回调
 */
export const treeDrawTool = (context, { result }, node, fields = [], fn) => {
  const fieldHash = fixFieldsByArr(fields);
  //  hash赋值
  window.billboardMap[node.id] = window.earth.scene.primitives.add(new Cesium.BillboardCollection());
  window.labelMap[node.id] = window.earth.scene.primitives.add(new Cesium.LabelCollection());
  //  属性赋值
  result.features.map(v => {
    if (node.withExtraKey) {
      !window.entityMapGeometry[node.id] && (window.entityMapGeometry[node.id] = {});
      window.entityMapGeometry[node.id][v.attributes[node.withExtraKey]] = {
        geometry: v.geometry, attributes: v.attributes, id: v.id, extra_data: v.attributes,
      };
    }
    const name = v.attributes.SHORTNAME || v.attributes.NAME || v.attributes.MC || v.attributes.JC || v.attributes[node.withExtraKey] || v.attributes["项目名称"] || v.attributes.SMID;
    !window.featureMap[node.id] && (window.featureMap[node.id] = {});
    name && (window.featureMap[node.id][v.attributes.SMID] = {
      name,
      attributes: v.attributes,
      geometry: v.geometry,
      fix_data: fixAttributesByOrigin(v.attributes, fieldHash),
      dataSet: node.dataset
    })
    //  叠加
    const position = Cesium.Cartesian3.fromDegrees(
      v.geometry.x,
      v.geometry.y,
      4
    );
    !node.hiddenIcon && !node.hiddenLabel && window.labelMap[node.id].add({
      id: `label@${v.attributes.SMID}@${node.id}`,
      text: v.attributes.SHORTNAME || v.attributes[node.withExtraKey] || v.attributes.NAME,
      position,
      ...labelConfig
    });
    !node.hiddenIcon && window.billboardMap[node.id].add({
      id: `billboard@${v.attributes.SMID}@${node.id}`,
      image: `/static/images/map-ico/${node.icon}.png`,
      position,
      ...billboardConfig,
    })
  })
  fn && fn();
};

/**
 * 画事件点、面
 * @param {*} context
 * @param {*} param1
 * @param {*} node
 * @param {*} fields 别名数组
 * @param {function} fn 回调
 */
export const treeDrawEventTool = (context, { result }, node, fn) => {
  //  hash赋值
  window.billboardMap[node.id] = window.earth.scene.primitives.add(new Cesium.BillboardCollection());
  window.labelMap[node.id] = window.earth.scene.primitives.add(new Cesium.LabelCollection());
  //  属性赋值
  result.features.map(v => {
    const name = v.attributes.NAME;
    const eventTime = v.attributes.eventTime;
    const dayOff = eventTime && isDayOff(eventTime) ? '_extra' : '';
    !window.featureMap[node.id] && (window.featureMap[node.id] = {});
    window.featureMap[node.id][v.attributes.SMID] = {
      name,
      attributes: v.attributes,
      geometry: v.geometry,
      fix_data: v.attributes,
    }
    //  叠加
    const position = Cesium.Cartesian3.fromDegrees(
      v.geometry.x,
      v.geometry.y,
      4
    );
    const eventTag = "eventLayer_";
    !node.hiddenIcon && !node.hiddenLabel && window.labelMap[node.id].add({
      id: `${eventTag}label@${v.attributes.SMID}@${node.id}`,
      text: v.attributes.NAME,
      position,
      ...labelConfig
    });
    !node.hiddenIcon && window.billboardMap[node.id].add({
      id: `${eventTag}billboard@${v.attributes.SMID}@${node.id}`,
      image: `/static/images/map-ico/${node.icon}${dayOff}.png`,
      position,
      ...billboardConfig,
      ...(dayOff ? {
        width: 46,
        height: 46,
      } : {})
    })
  })
  fn && fn();
};
