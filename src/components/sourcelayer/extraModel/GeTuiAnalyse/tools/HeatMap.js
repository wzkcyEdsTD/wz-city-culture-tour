
import { gcj02towgs84 } from "common/js/coordinateTransfer";

/**
 * 制造热力图
 * @param {*} name 
 */
export const doHeatMap = (heatArr) => {
    let bounds = {
        west: 119.407,
        east: 121.408,
        south: 27.059,
        north: 28.692
    };

    // init heatmap
    const heatMap = window.CesiumHeatmap.create(
        window.earth,
        bounds,
        {
            backgroundColor: "rgba(0,0,0,0)",
            radius: 3,
            maxOpacity: 0.6,
            minOpacity: 0,
            blur: 1
        }
    );

    // random example data
    let data = heatArr.map(({ lng, lat, count }) => {
        const [x, y] = gcj02towgs84(lng, lat)
        return { x, y, value: parseInt(count / 20) }
    });
    let valueMin = 0;
    let valueMax = 100;

    // add data to heatmap
    heatMap.setWGS84Data(valueMin, valueMax, data)
    return heatMap;
}