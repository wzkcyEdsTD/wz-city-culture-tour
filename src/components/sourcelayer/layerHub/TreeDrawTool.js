/*
 * @Author: eds
 * @Date: 2020-09-03 15:04:37
 * @LastEditTime: 2020-09-11 17:05:49
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\treeTool\TreeDrawTool.js
 */

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
  // const poiEntityCollection = new Cesium.CustomDataSource(node.id);
  // window.earth.dataSources.add(poiEntityCollection).then(datasource => {
  //   window.entityMap[node.id] = datasource;
  // });
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
    })
  })
  result.features.map(item => {
    const position = Cesium.Cartesian3.fromDegrees(
      item.geometry.x,
      item.geometry.y,
      4
    );
    !node.hiddenLabel && window.labelMap[node.id].add({
      id: `label@${item.attributes.SMID}@${node.id}`,
      text: item.attributes.SHORTNAME || item.attributes[node.withExtraKey] || item.attributes.NAME,
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
      position
    });
    !node.hiddenLabel && window.billboardMap[node.id].add({
      id: `billboard@${item.attributes.SMID}@${node.icon}`,
      image: `/static/images/map-ico/${node.icon}.png`,
      width: 34,
      height: 34,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      position
    })
  });
  fn && fn();
};
