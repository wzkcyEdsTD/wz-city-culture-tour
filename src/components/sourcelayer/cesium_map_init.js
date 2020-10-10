import szf_road_light from "mock/szf_road_light.json";
import szf_road_lamp from "mock/szf_road_lamp.json";
import szf_build_light from "mock/szf_build_light.json";
import window_array from "config/local/windowPositions";
/**
 * 地图参数调节
 */
export const mapConfigInit = () => {
    // window.earth.scene.globe.depthTestAgainstTerrain = false;
    // window.earth.scene.debugShowFramesPerSecond = true;
    window.earth.scene.sun.show = false;
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
 * 路灯图层,玻璃3d模型叠加
 * @param {*} name 
 * @param {*} url 
 */
export const mapRoadLampLayerInit = (...params) => {
    //  路灯
    szf_road_lamp.Street_Lamp_light.map((item, i) => {
        const [x, y, z] = item;
        var position = new Cesium.Cartesian3.fromDegrees(x, y, z);
        const pointLight = new Cesium.PointLight(position, szf_road_lamp.options);
        window.earth.scene.addLightSource(pointLight);
    })
    //  聚光灯
    szf_road_light.position_array.map((item, i) => {
        const [x, y, z] = item;
        const [tx, ty, tz] = szf_road_light.tarposition_array[i];
        const position = new Cesium.Cartesian3(x, y, z);
        const targetPosition = new Cesium.Cartesian3(tx, ty, tz);
        var spotLight = new Cesium.SpotLight(position, targetPosition, szf_road_light.options);
        window.earth.scene.addLightSource(spotLight);
    })
    //  向上聚光灯
    // szf_build_light.position_array.map((item, i) => {
    //     const [x, y, z] = item;
    //     const [tx, ty, tz] = szf_build_light.tarposition_array[i];
    //     const position = new Cesium.Cartesian3.fromDegrees(x, y, z);
    //     const targetPosition = new Cesium.Cartesian3.fromDegrees(tx, ty, tz);
    //     var spotLight = new Cesium.SpotLight(position, targetPosition, szf_build_light.options);
    //     window.earth.scene.addLightSource(spotLight);
    // })
    //  平行灯
    const dir_position = new Cesium.Cartesian3.fromDegrees(120.69313536231014, 27.994595917140288, 267.31285740879105);
    const targetPosition = new Cesium.Cartesian3.fromDegrees(120.69364375255293, 27.995973200938042, 125.7711425019562);
    const dirLightOptions = {
        targetPosition,
        color: new Cesium.Color(43 / 255, 146 / 255, 236 / 255, 1.0),
        intensity: 1
    };
    const directionalLight = new Cesium.DirectionalLight(dir_position, dirLightOptions);
    window.earth.scene.addLightSource(directionalLight);
    //  窗户
    const WindowsEntityCollection = new Cesium.CustomDataSource('cesium-windows');
    window.earth.dataSources.add(WindowsEntityCollection).then(datasource => {
        window.windowEntityMap = datasource;
    });
    window_array.map(v => {
        WindowsEntityCollection.entities.add({
            name: v.name,
            position: new Cesium.Cartesian3.fromDegrees(...v.geometry),
            model: {
                uri: v.url
            }
        });
    })
}

/**
 * 开关路灯/窗户
 * @param {*} boolean 
 */
export const mapRoadLampLayerTurn = (boolean) => {
    window.earth.scene.lightSource.pointLight._array.map(v => v.intensity = boolean ? 12 : 0)
    window.earth.scene.lightSource.spotLight._array.map(v => v.intensity = boolean ? 4 : 0)
    window.earth.scene.lightSource.directionalLight._array.map(v => v.intensity = boolean ? 1 : 0)
    window.windowEntityMap.show = boolean ? true : false;
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
                } else {
                    const LAYER = window.earth.scene.layers.find(KEY);
                    LAYER.brightness = 0.6;
                    LAYER.style3D.fillForeColor = {
                        alpha: 1,
                        blue: 0.6,
                        green: 0.6,
                        red: 0.6
                    }
                    LAYER.gamma = 0.6;
                    LAYER.refresh();
                }
                index == arrURL.length - 1 && resolve(true)
            });
        });
    })
}