import { gcj02towgs84 } from "common/js/coordinateTransfer";
/**
 * 开关热力图
 * @param {*} blocks 
 * @param {*} forceKey 
 */
export const switchHeatMap = (blocks, forceKey, heatArr) => {
    blocks.map(({ k }) => {
        if (k == forceKey) {
            window.heatMap[k] ? window.heatMap[k].show(true) : doHeatMap(k, heatArr);
        } else {
            window.heatMap[k] ? window.heatMap[k].show(false) : undefined
        }
    })
};
/**
 * 制造热力图
 * @param {*} name 
 */
export const doHeatMap = (heatArr) => {
    let bounds = {
        west: 120.58254,
        east: 120.738342,
        south: 27.984375,
        north: 28.031321
    };

    // init heatmap
    const heatMap = window.CesiumHeatmap.create(
        window.earth,
        bounds,
        {
            backgroundColor: "rgba(0,0,0,0)",
            radius: 40,
            maxOpacity: 0.4,
            minOpacity: 0,
            blur: 0.5
        }
    );

    // random example data
    let data = heatArr.map(({ lng, lat, count }) => {
        const [x, y] = gcj02towgs84(lng, lat)
        return { x, y, value: count / 80 }
    });
    let valueMin = 0;
    let valueMax = 100;

    // add data to heatmap
    heatMap.setWGS84Data(valueMin, valueMax, data)
}

/**
 * 盖重点人员面
 * @param {*} param0 
 */
export const doBlockKey = async ({ newdataset, url }) => {
    return new Promise((resolve, reject) => {
        const getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {
            eventListeners: {
                processCompleted: (data) => data && resolve(data.originResult.features),
                processFailed: (err) => reject(err),
            },
        });
        getFeatureBySQLService.processAsync(
            new SuperMap.REST.GetFeaturesBySQLParameters({
                queryParameter: new SuperMap.REST.FilterParameter({
                    attributeFilter: `ZDRY = '1'`,
                }),
                toIndex: -1,
                datasetNames: [newdataset],
            })
        );
    });
}