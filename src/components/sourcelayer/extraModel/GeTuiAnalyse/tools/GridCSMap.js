const TOP_COUNT = 8000;
const DENOMINATOR = 100;
const DEFAULT_COLOR = Cesium.Color.fromCssColorString("rgb(166,0,21)")
const ColorHash = {
    0: Cesium.Color.fromCssColorString("rgb(27,29,41)"),
    1: Cesium.Color.fromCssColorString("rgb(0,73,135)"),
    2: Cesium.Color.fromCssColorString("rgb(26,116,192)"),
    3: Cesium.Color.fromCssColorString("rgb(139,185,227)"),
    4: Cesium.Color.fromCssColorString("rgb(220,238,255)"),
    5: Cesium.Color.fromCssColorString("rgb(255,255,255)"),
    6: Cesium.Color.fromCssColorString("rgb(232,232,189)"),
    7: Cesium.Color.fromCssColorString("rgb(243,208,139)"),
    8: Cesium.Color.fromCssColorString("rgb(249,172,98)"),
    9: Cesium.Color.fromCssColorString("rgb(229,80,56)"),
    10: Cesium.Color.fromCssColorString("rgb(166,0,21)"),
}
// 标识配置
const labelConfig = {
    outlineColor: Cesium.Color.BLACK,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    font: "10px",
    scale: 1.2,
    outlineWidth: 4,
    showBackground: true,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
}

/**
 * 制造网格柱
 * @param {*} heatArr 
 * @param {*} _GRIDMAP_INDEX_ 
 */
export const doGridMap = ({ id, list, center, count }, _GRIDMAP_INDEX_, BUS_EVENT_TAG_CLICK) => {
    count && window.extraPrimitiveMap[_GRIDMAP_INDEX_].add(new Cesium.Primitive({
        geometryInstances: [
            new Cesium.GeometryInstance({
                id: `${BUS_EVENT_TAG_CLICK}@${center.x}@${center.y}@${count}@${id}`,
                geometry: new Cesium.PolygonGeometry({
                    polygonHierarchy: new Cesium.PolygonHierarchy(
                        Cesium.Cartesian3.fromDegreesArray(list.flat(2))
                    ),
                    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                    height: 0,
                    // rotation: Cesium.Math.toRadians(0),
                    extrudedHeight: count / DENOMINATOR
                }),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(ColorHash[Math.round((count / TOP_COUNT) * 10)] || DEFAULT_COLOR)
                }
            })
        ],
        appearance: new Cesium.PerInstanceColorAppearance({
            translucent: false,
            closed: true
        })
    }))
}

/**
 * 画标签
 * @param {*} obj 
 * @param {*} _GRIDLABEL_INDEX_ 
 */
export const doGridLabel = ({ x, y, count, id }, _GRIDLABEL_INDEX_) => {
    if (!window.extraPrimitiveMap[_GRIDLABEL_INDEX_]) {
        window.extraPrimitiveMap[_GRIDLABEL_INDEX_] = window.earth.scene.primitives.add(new Cesium.LabelCollection())
    }
    window.extraPrimitiveMap[_GRIDLABEL_INDEX_].add({
        id: +new Date(),
        text: `${id ? `${id} ` : ``}${count}`,
        fillColor: ColorHash[Math.round((count / TOP_COUNT) * 10)] || DEFAULT_COLOR,
        position: Cesium.Cartesian3.fromDegrees(
            +x,
            +y,
            parseInt(+count / DENOMINATOR) + 10
        ),
        ...labelConfig,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    });
}