import szf_road_light from "mock/lamp/szf_road_light.json";
import szf_road_lamp from "mock/lamp/szf_road_lamp.js";
import szf_direction_light from "mock/lamp/szf_direction_light.json";
import window_array from "config/local/windowPositions";
/**
 * 地图参数调节
 */
export const mapConfigInit = () => {
    // window.earth.scene.globe.depthTestAgainstTerrain = false;
    // window.earth.scene.debugShowFramesPerSecond = true;
    window.earth.clock.currentTime.secondsOfDay = 51830.97475229357
    // window.earth.scene.fxaa = true;
    window.earth.scene.sun.show = true;
    window.earth.scene.bloomEffect.bloomIntensity = 1.05;
    window.earth.scene.bloomEffect.show = true;
    window.earth.imageryLayers.get(0).show = false;
    window.earth.scene.skyAtmosphere.show = false;
    window.earth.scene.globe.baseColor = new Cesium.Color.fromCssColorString(
        "rgba(13,24,45, 1)"
    );
    // window.earth.scene.globe.enableLighting = true;
    window.earth.scene.shadowMap.darkness = 0.35;
    // window.earth.scene.lightSource.ambientLightColor = new Cesium.Color(0.65, 0.65, 0.65, 1);
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
            LAYER.visibleDistanceMax = 2000;
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
    //  平行灯
    const dir_position = new Cesium.Cartesian3.fromDegrees(...szf_direction_light.position);
    const targetPosition = new Cesium.Cartesian3.fromDegrees(...szf_direction_light.tarposition);
    const dirLightOptions = {
        targetPosition,
        ...szf_direction_light.options
    };
    window.earth.scene.addLightSource(new Cesium.DirectionalLight(dir_position, dirLightOptions));
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
    window.earth.scene.lightSource.pointLight._array.map(v => v.intensity = boolean ? 4 : 0)
    window.earth.scene.lightSource.spotLight._array.map(v => v.intensity = boolean ? 2 : 0)
    window.earth.scene.lightSource.directionalLight._array.map(v => v.intensity = boolean ? 1 : 0)
    window.windowEntityMap.show = boolean ? true : false;
    window.earth.scene.sun.show = boolean ? false : true;
}

/**
 * 阴影查询
 */
export const mapShadowInit = () => {
    window.shadowQuery = new Cesium.ShadowQueryPoints(window.earth.scene);
    window.shadowQuery.build();
}

/**
 * 白模叠加初始化
 * @param {*} arrURL 
 */
export const mapBaimoLayerInit = (arrURL) => {
    return new Promise((resolve, reject) => {
        arrURL.map(({ KEY, URL, FLOW, d, s, withoutFix }, index) => {
            const baimoPromise = window.earth.scene.addS3MTilesLayerByScp(URL, {
                name: KEY,
            });
            Cesium.when(baimoPromise, async (_LAYER_) => {
                const LAYER = window.earth.scene.layers.find(KEY);
                LAYER.indexedDBSetting.isGeoTilesRootNodeSave = true;
                LAYER.residentRootTile = true;
                if (FLOW) {
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
                    if (withoutFix) {
                        LAYER.style3D.fillForeColor = new Cesium.Color(0.4, 0.4, 0.43)
                    } else {
                        LAYER.brightness = 0.5;
                        LAYER.gamma = 0.6;
                        LAYER.refresh();
                    }
                }
                //  最大可见
                d && (LAYER.visibleDistanceMax = d);
                s && (LAYER.shadowType = 2)
                index == arrURL.length - 1 && resolve(true)
            });
        });
    })
}