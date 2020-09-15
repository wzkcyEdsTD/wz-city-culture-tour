/*
 * @Author: eds
 * @Date: 2020-09-01 15:38:12
 * @LastEditTime: 2020-09-01 16:01:55
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\mapTool.js
 */

/**
 * 获取当前视野范围
 */
export const getCurrentExtent = () => {
  var extent = {};
  var scene = window.earth.scene;
  var ellipsoid = scene.globe.ellipsoid;
  var canvas = scene.canvas;
  var car3_lt = window.earth.camera.pickEllipsoid(
    new Cesium.Cartesian2(0, 0),
    ellipsoid
  );
  var car3_rb = window.earth.camera.pickEllipsoid(
    new Cesium.Cartesian2(canvas.width, canvas.height),
    ellipsoid
  );
  // 当canvas左上角和右下角全部在椭球体上
  if (car3_lt && car3_rb) {
    var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
    var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
    extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
    extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
    extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
    extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
  } else if (!car3_lt && car3_rb) {
    // 当canvas左上角不在但右下角在椭球体上
    var car3_lt2 = null;
    var yIndex = 0;
    do {
      // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
      yIndex <= canvas.height ? (yIndex += 10) : canvas.height;
      car3_lt2 = this.rightMap.camera.pickEllipsoid(
        new Cesium.Cartesian2(0, yIndex),
        ellipsoid
      );
    } while (!car3_lt2);
    var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
    var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
    extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
    extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
    extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
    extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
  }
  return extent;
};

/**
 * 是否在范围内
 * @param {*} extent
 * @param {*} geometry
 */
export const isContainByExtent = (extent, geometry) => {
  const boolean =
    geometry.x >= extent.xmin &&
    geometry.y >= extent.ymin &&
    geometry.x <= extent.xmax &&
    geometry.y <= extent.ymax;
  return boolean;
};
