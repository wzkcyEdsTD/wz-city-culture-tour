import { gcj02towgs84 } from "common/js/coordinateTransfer";
let roadData = [];
// 标识配置
const labelConfig = {
    outlineColor: Cesium.Color.BLACK,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    font: "10px",
    scale: 1.2,
    outlineWidth: 4,
    showBackground: false,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
}

/**
 * 画道路
 * @param {*} lines 
 * @param {*} _GRIDROAD_INDEX_ 
 * @param {*} BUS_EVENT_TAG_ROAD_CLICK 
 * @returns 
 */
export const doCountRoute = (lines, _GRIDROAD_INDEX_, BUS_EVENT_TAG_ROAD_CLICK) => {
    roadData = lines;
    const linePoints = lines.map(({ path }) =>
        path.map(([x, y]) => gcj02towgs84(x, y).concat([5]))
    );
    return linePoints.map((v, index) => {
        const singeLine = v.flat(2);
        const id = `${BUS_EVENT_TAG_ROAD_CLICK}@${index}`;
        window.earth.entities.add({
            name: lines[index].name,
            id,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(singeLine),
                width: lines[index].type > 40 ? 3 : lines[index].num > 20 ? 12 : 20,
                material: new Cesium.PolylineTrailLinkMaterialProperty(
                    lines[index].speed < 15
                        ? Cesium.Color.INDIANRED
                        : lines[index].speed < 30
                            ? Cesium.Color.ORANGE
                            : Cesium.Color.LIGHTGREEN,
                    (1 / lines[index].speed) * 250000
                ),
            },
        });
        return id;
    });
}

/**
 * 画道路
 * @param {*} lines 
 * @param {*} _GRIDROAD_INDEX_ 
 * @param {*} BUS_EVENT_TAG_ROAD_CLICK 
 * @returns 
 */
export const doCountRouteByCount = (lines, _GRIDROAD_INDEX_, BUS_EVENT_TAG_ROAD_CLICK) => {
    roadData = lines;
    const linePoints = lines.map(({ path }) =>
        path.map(([x, y]) => gcj02towgs84(x, y).concat([5]))
    );
    return linePoints.map((v, index) => {
        const singeLine = v.flat(2);
        const id = `${BUS_EVENT_TAG_ROAD_CLICK}@${index}`;
        window.earth.entities.add({
            name: lines[index].name,
            id,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(singeLine),
                width: 10,
                material: new Cesium.PolylineTrailLinkMaterialProperty(
                    lines[index].num > 40
                        ? Cesium.Color.INDIANRED
                        : lines[index].num > 20
                            ? Cesium.Color.ORANGE
                            : Cesium.Color.LIGHTGREEN,
                    10000
                ),
            },
        });
        return id;
    });
}

/**
 * 道路标记
 * @param {*} param0 
 * @param {*} _GRIDROADLABEL_INDEX_ 
 * @param {*} isBySpeed 
 */
export const doRoadLabel = ({ index }, _GRIDROADLABEL_INDEX_, isBySpeed = true) => {
    if (!window.extraPrimitiveMap[_GRIDROADLABEL_INDEX_]) {
        window.extraPrimitiveMap[_GRIDROADLABEL_INDEX_] = window.earth.scene.primitives.add(new Cesium.LabelCollection())
    }
    const data = roadData[index];
    //  draw label
    window.extraPrimitiveMap[_GRIDROADLABEL_INDEX_].add({
        id: +new Date(),
        text: `[${data.name}] ${data.num}辆 车速${data.speed}km/h`,
        fillColor: isBySpeed ? (data.speed < 15
            ? Cesium.Color.INDIANRED
            : data.speed < 30
                ? Cesium.Color.ORANGE
                : Cesium.Color.LIGHTGREEN) : (data.num > 40
                    ? Cesium.Color.INDIANRED
                    : data.num > 20
                        ? Cesium.Color.ORANGE
                        : Cesium.Color.LIGHTGREEN),
        position: Cesium.Cartesian3.fromDegrees(
            ...gcj02towgs84(...data.path[parseInt(data.path.length / 2)]).concat([6])
        ),
        ...labelConfig,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    });
}