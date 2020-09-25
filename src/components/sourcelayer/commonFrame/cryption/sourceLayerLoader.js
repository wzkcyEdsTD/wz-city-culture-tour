/*
 * @Author: eds
 * @Date: 2020-09-10 20:30:07
 * @LastEditTime: 2020-09-11 10:32:43
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\baimoLoader.js
 */

/********** linestyle **********/
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
        get: function () {
            return false;
        }
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor("color")
});

PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
    return "PolylineTrailLink";
};

PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
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

PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
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
        translucent: function (material) {
            return true;
        }
    }
);

/********** config **********/
window.SCENE_WZMODEL = [
    { KEY: "ZGDYP_ZB", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_ZB/config" },
    { KEY: "ZGDYP_DL", d: 5500, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_DL/config" },
    { KEY: "ZGDYP_QT", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_QT/config" },
    { KEY: "ZGDYP_SX", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_SX/config" },
    { KEY: "ZGDYP_JZ", d: 5500, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_JZ/config" },
    { KEY: "ZGDYP_DX", d: 5500, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/ZGDYP_DX/config" },
    { KEY: "MaxShijuJZ", d: 5500, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/MaxShijuJZ/config" },
    { KEY: "MaxShijuQT", d: 1400, url: "https://ditu.wzcitybrain.com/iserver/services/3D-mongodb3/rest/realspace/datas/MaxShijuQT/config" },
]
window.WZBaimo_OBJ = [
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
]
window.RIVER = "https://ditu.wzcitybrain.com/iserver/services/3D-River_CityBrain/rest/realspace/datas/River_CityBrain/config";

/********** lineDraw **********/
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

/********** modelLoader **********/
window.baimoLoader = () => {
    window.earth.imageryLayers.get(0).show = false;
    window.earth.scene.globe.baseColor = new Cesium.Color.fromCssColorString(
        "rgba(13,24,45, 1)"
    );
    window.earth.scene.bloomEffect.show = true;
    //  水面
    const riverPromise = window.earth.scene.addS3MTilesLayerByScp(
        window.RIVER,
        {
            name: "RIVER",
        }
    );
    Cesium.when(riverPromise, async ([forceLayer, ...oLayer]) => {
        window.earth.scene.layers.find("RIVER").style3D.bottomAltitude = 1;
        window.earth.scene.layers.find("RIVER").refresh();
    });
    //  白模
    const PROMISES = window.WZBaimo_OBJ.map(({ KEY, URL, FLOW }) => {
        return window.earth.scene.addS3MTilesLayerByScp(URL, {
            name: KEY,
        });
    });
    Cesium.when(PROMISES[PROMISES.length - 1], () => {
        setTimeout(() => {
            window.WZBaimo_OBJ.map(({ KEY, FLOW }) => {
                const LAYER = window.earth.scene.layers.find(KEY);
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
                //  贴图纹理
                if (FLOW) {
                    hyp.emissionTextureUrl = "/static/images/area/speedline.png";
                    hyp.emissionTexCoordUSpeed = 0.2;
                    LAYER.hypsometricSetting = {
                        hypsometricSetting: hyp,
                        analysisMode:
                            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
                    };
                }
            });
        }, 500)

    })
    const linePoints = window.lines.geometries.map(v => v.coordinates);
    linePoints.map((v, index) =>
        window.drawPolyline(
            v.reduce((a, b) => a.concat(b)),
            index
        )
    );
};

window.fineModelLoader = () => {
    //  关白模
    window.WZBaimo_OBJ.map(({ KEY }) => {
        window.earth.scene.layers.find(KEY).visible = false;
    });
    window.earth.scene.bloomEffect.show = false;
    const PROMISES = window.SCENE_WZMODEL.map((v) => {
        return window.earth.scene.addS3MTilesLayerByScp(v.url, {
            name: v.KEY,
        });
    });
    //  精模服务暂有问题，先用setTimeout代替promise处理可见
    Cesium.when(PROMISES[PROMISES.length - 1], () => {
        window.SCENE_WZMODEL.map((v) => {
            const V_LAYER = window.earth.scene.layers.find(v.KEY);
            V_LAYER && (V_LAYER.visibleDistanceMax = v.d || 1400);
        });
    });
}

/**
 * 开关白模
 * @param {*} isBaimo 
 */
window.modelSwither = (isBaimo) => {
    window.WZBaimo_OBJ.map(({ KEY }) => {
        window.earth.scene.layers.find(KEY).visible = isBaimo ? true : false;
    });
    window.SCENE_WZMODEL.map(({ KEY }) => {
        window.earth.scene.layers.find(KEY).visible = isBaimo ? false : true;
    });
    window.earth.scene.bloomEffect.show = isBaimo;
}


