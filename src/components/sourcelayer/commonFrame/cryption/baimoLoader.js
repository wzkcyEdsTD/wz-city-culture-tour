/*
 * @Author: eds
 * @Date: 2020-09-10 20:30:07
 * @LastEditTime: 2020-09-11 10:32:43
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\baimoLoader.js
 */
function PolylineTrailLinkMaterialProperty(color, duration) {
  this._definitionChanged = new Cesium.Event();
  this._color = undefined;
  this._colorSubscription = undefined;
  this.color = color;
  this.duration = duration;
  this._time = new Date().getTime();
}

Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
  isConstant: {
    get: function() {
      return false;
    }
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged;
    }
  },
  color: Cesium.createPropertyDescriptor("color")
});

PolylineTrailLinkMaterialProperty.prototype.getType = function(time) {
  return "PolylineTrailLink";
};

PolylineTrailLinkMaterialProperty.prototype.getValue = function(time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  result.color = Cesium.Property.getValueOrClonedDefault(
    this._color,
    time,
    Cesium.Color.WHITE,
    result.color
  );
  result.image = Cesium.Material.PolylineTrailLinkImage;
  result.time =
    ((new Date().getTime() - this._time) % this.duration) / this.duration;
  return result;
};

PolylineTrailLinkMaterialProperty.prototype.equals = function(other) {
  return (
    this === other ||
    (other instanceof PolylineTrailLinkMaterialProperty &&
      Cesium.Property.equals(this._color, other._color))
  );
};

Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
Cesium.Material.PolylineTrailLinkType = "PolylineTrailLink";
Cesium.Material.PolylineTrailLinkImage =
  "https://sourcelayer.wzcitybrain.com/static/images/area/line_blue.png";
Cesium.Material.PolylineTrailLinkSource =
  " czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
    czm_material material = czm_getDefaultMaterial(materialInput);\n\
    vec2 st = materialInput.st;\n\
    vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
    material.alpha = colorImage.a * color.a;\n\
    material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
    return material;\n\
}";
Cesium.Material._materialCache.addMaterial(
  Cesium.Material.PolylineTrailLinkType,
  {
    fabric: {
      type: Cesium.Material.PolylineTrailLinkType,
      uniforms: {
        color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
        image: Cesium.Material.PolylineTrailLinkImage,
        time: -20
      },
      source: Cesium.Material.PolylineTrailLinkSource
    },
    translucent: function(material) {
      return true;
    }
  }
);

window.drawPolyline = (linePoints, index) => {
  window.earth.entities.add({
    name: "PolylineTrail_" + index,
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(linePoints),
      width: 16,
      material: new Cesium.PolylineTrailLinkMaterialProperty(
        Cesium.Color.WHITE,
        10000
      ),
      clampToGround: true
    }
  });
};

window.baimoLoader = () => {
  const baimoPromise = window.earth.scene.addS3MTilesLayerByScp(
    "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb-BaiMoLuCheng/rest/realspace/datas/BaiMo_LuCheng/config",
    {
      name: "baimo"
    }
  );
  Cesium.when(baimoPromise, () => {
    const LAYER = window.earth.scene.layers.find("baimo");
    LAYER.style3D.fillForeColor = new Cesium.Color.fromCssColorString(
      "rgba(137,137,137, 1)"
    );
    const hyp = new Cesium.HypsometricSetting();
    const colorTable = new Cesium.ColorTable();
    hyp.MaxVisibleValue = 300;
    hyp.MinVisibleValue = 0;
    colorTable.insert(300, new Cesium.Color(1, 1, 1));
    colorTable.insert(160, new Cesium.Color(0.95, 0.95, 0.95));
    colorTable.insert(76, new Cesium.Color(0.7, 0.7, 0.7));
    colorTable.insert(0, new Cesium.Color(13 / 255, 24 / 255, 45 / 255));
    hyp.ColorTable = colorTable;
    hyp.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.FACE;
    hyp.Opacity = 1;
    hyp.LineInterval = 20.0;
    LAYER.hypsometricSetting = {
      hypsometricSetting: hyp,
      analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
    };
  });
  window.earth.scene.bloomEffect.show = true;
  const linePoints = window.lines.geometries.map(v => v.coordinates);
  linePoints.map((v, index) =>
    window.drawPolyline(
      v.reduce((a, b) => a.concat(b)),
      index
    )
  );
};
