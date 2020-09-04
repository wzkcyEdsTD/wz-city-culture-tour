/*
 * @Author: eds
 * @Date: 2020-09-03 15:04:37
 * @LastEditTime: 2020-09-04 15:17:37
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\treeTool\TreeDrawTool.js
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
    reg.test(caption) ? (fieldHash[name] = caption) : undefined;
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
    ~extraKeys.indexOf(attributes.SHORTNAME)
      ? extraFeatures.push({ ...item, extra_data: eObj[attributes.SHORTNAME] })
      : drawFeatures.push(item);
  });
  context[node.saveExtraDataByGeometry](extraFeatures);
  context.searchFilter();
  return { drawFeatures };
};

/**
 * 画点、面
 * @param {*} context
 * @param {*} param1
 * @param {*} node
 * @param {*} fields 别名数组
 */
export const treeDrawTool = (context, { result }, node, fields = []) => {
  const fieldHash = fixFieldsByArr(fields);
  const poiEntityCollection = new Cesium.CustomDataSource(node.id);
  window.earth.dataSources.add(poiEntityCollection).then(datasource => {
    context.entityMap[node.id] = datasource;
  });
  context.featureMap[node.id] = result.features;
  let forceDrawFeatures = [];
  if (node.withExtraData) {
    const { drawFeatures } = fixTreeWithExtra(
      result.features,
      context[node.withExtraData],
      node,
      context
    );
    forceDrawFeatures = [...drawFeatures];
  } else {
    forceDrawFeatures = result.features;
  }

  forceDrawFeatures.map(item => {
    const entityOption = {
      id: `${item.attributes.SMID}@${node.icon}@${node.dataset}`,
      label: {
        text: item.attributes.SHORTNAME || item.attributes.NAME,
        color: Cesium.Color.fromCssColorString("#fff"),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        font: "10px",
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2000),
        pixelOffset: new Cesium.Cartesian2(0, -40)
      },
      name: node.id,
      fieldHash,
      extra_data: item.attributes,
      fix_data: fixAttributesByOrigin(item.attributes, fieldHash),
      geometry: item.geometry
    };
    const polygonGeometry = node.polygon
      ? [].concat.apply(
          [],
          item.geometry.components[0].components.map(v => [
            parseFloat(v.x),
            parseFloat(v.y)
          ])
        )
      : [];
    const entityInstance = node.polygon
      ? {
          ...entityOption,
          position: Cesium.Cartesian3.fromDegrees(
            ...getCenterOfPolygon(polygonGeometry, 30)
          ),
          polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(polygonGeometry),
            outline: true,
            outlineWidth: 4,
            outlineColor: new Cesium.Color.fromCssColorString("#FFD700"),
            material: new Cesium.Color.fromCssColorString("#7FFF00").withAlpha(
              0.6
            ),
            perPositionHeight: true,
            height: 2
          }
        }
      : {
          ...entityOption,
          position: Cesium.Cartesian3.fromDegrees(
            item.geometry.x,
            item.geometry.y,
            10
          ),
          billboard: {
            image: `/static/images/${node.icon}.png`,
            width: node.icon_size == "large" ? 48 : 32,
            height: node.icon_size == "large" ? 48 : 35
          }
        };

    poiEntityCollection.entities.add(entityInstance);
  });
};
