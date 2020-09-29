import szf_road_light from "mock/szf_road_light.json";
import szf_road_lamp from "mock/szf_road_lamp.json"
/**
 * 地图参数调节
 */
export const mapConfigInit = () => {
    // window.earth.scene.globe.depthTestAgainstTerrain = false;
    // window.earth.scene.debugShowFramesPerSecond = true;
    window.earth.scene.bloomEffect.show = true;
    window.earth.imageryLayers.get(0).show = false;
    window.earth.scene.skyAtmosphere.show = false;
    window.earth.scene.globe.baseColor = new Cesium.Color.fromCssColorString(
        "rgba(13,24,45, 1)"
    );
}

/**
 * 大数据底图叠加
 * @param {*} url 
 */
export const mapImageLayerInit = (url) => {
    return window.earth.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({ url })
    );
}

/**
 * Mvt服务叠加
 * @param {*} name 
 * @param {*} url 
 */
export const mapMvtLayerInit = (name, url) => {
    window.earth.scene.addVectorTilesMap({ url, name, viewer: window.earth });
}

/**
 * 水面叠加
 * @param {*} name 
 * @param {*} url 
 */
export const mapRiverLayerInit = (name, url) => {
    return new Promise((resolve, reject) => {
        const riverPromise = window.earth.scene.addS3MTilesLayerByScp(url, { name });
        Cesium.when(riverPromise, () => {
            const LAYER = window.earth.scene.layers.find(name)
            LAYER.style3D.bottomAltitude = 1;
            LAYER.refresh();
            LAYER.visible = false;
            resolve(true)
        });
    })
}

/**
 * 路灯图层叠加
 * @param {*} name 
 * @param {*} url 
 */
export const mapRoadLampLayerInit = (name, url) => {
    window.earth.scene.lightSource.ambientLightColor = new Cesium.Color(0.35, 0.35, 0.35, 1);
    //路灯
    szf_road_lamp.Street_Lamp_light.map(item => {
        const [x, y, z] = item;
        const lamp_position = new Cesium.Cartesian3.fromDegrees(x, y, z);
        const lamp_targetPosition = new Cesium.Cartesian3.fromDegrees(x, y, z - 10);
        const lamp_posDeg = Cesium.Cartographic.fromCartesian(lamp_position);
        const lamp_pointPosition = Cesium.Cartesian3.fromRadians(lamp_posDeg.longitude, lamp_posDeg.latitude, lamp_posDeg.height);
        const lamp_spotLight = new Cesium.SpotLight(lamp_pointPosition, lamp_targetPosition, szf_road_lamp.options);
        window.earth.scene.addLightSource(lamp_spotLight);
    })

    //市政府聚光灯
    szf_road_light.position_array.map((item, i) => {
        const [x, y, z] = item;
        const [tx, ty, tz] = szf_road_light.tarposition_array[i];
        const position = new Cesium.Cartesian3(x, y, z);
        const targetPosition = new Cesium.Cartesian3(tx, ty, tz);
        var spotLight = new Cesium.SpotLight(position, targetPosition, szf_road_light.options);
        window.earth.scene.addLightSource(spotLight);
    })
}

/**
 * 白模叠加初始化
 * @param {*} arrURL 
 */
export const mapBaimoLayerInit = (arrURL) => {
    return new Promise((resolve, reject) => {
        arrURL.map(({ KEY, URL, FLOW }, index) => {
            const baimoPromise = window.earth.scene.addS3MTilesLayerByScp(URL, {
                name: KEY,
            });
            Cesium.when(baimoPromise, async ([forceLayer, ...oLayer]) => {
                if (FLOW) {
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
                    hyp.emissionTextureUrl = "/static/images/area/speedline.png";
                    hyp.emissionTexCoordUSpeed = 0.2;
                    LAYER.hypsometricSetting = {
                        hypsometricSetting: hyp,
                        analysisMode:
                            Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL,
                    };
                }
                index == arrURL.length - 1 && resolve(true)
            });
        });
    })
}