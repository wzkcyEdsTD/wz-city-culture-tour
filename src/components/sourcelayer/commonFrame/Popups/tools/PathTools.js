/**
 * 分析导航路径
 * @param {*} originResult 
 */
export const dealPathWithXhr = ({ originResult }) => {
    if (!originResult.pathList.length) return;
    const { line, length } = originResult.pathList[0].route;
    const { points, center } = line;
    drawPathWithLine(points);
    drawLabelWithCenter(center, length)
}

/**
 * 画导航路径
 * @param {*} points 
 */
const drawPathWithLine = (points) => {
    window.billboardMap["pathRoute_analyse_lines"] = window.earth.entities.add({
        name: "pathRoute_line",
        id: "pathRoute_line",
        polyline: new Cesium.PolylineGraphics({
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                points.map(({ x, y }) => [x, y, 2]).flat(2)
            ),
            width: 12,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            material: Cesium.Color.RED,
            material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED), //体会编码，下面的覆盖上面,material对应了一个实例
        }),
    });
    points.map(({ x, y }, i) => {
        const position = Cesium.Cartesian3.fromDegrees(
            parseFloat(x),
            parseFloat(y),
            2
        );
        i < points.length - 1 && window.billboardMap["pathRoute_analyse_points"].add({
            id: "pathRoute_points_" + i,
            pixelSize: 6,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 3,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            position,
        });
    });
}

/**
 * 画中心点
 * @param {*} center 
 * @param {*} length 
 */
const drawLabelWithCenter = ({ x, y }, length) => {
    const position = Cesium.Cartesian3.fromDegrees(
        parseFloat(x),
        parseFloat(y),
        2
    );
    window.labelMap["pathRoute_analyse_labels"].add({
        id: "pathRoute_analyse_center",
        text: length.toFixed(2) + ' 米',
        fillColor: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.BLACK,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        font: "10px",
        scale: 1.2,
        outlineWidth: 6,
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString("rgba(0,0,0,0.6)"),
        pixelOffset: new Cesium.Cartesian2(0, -30),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        position,
    });
}

/**
 * 清除导航路径
 */
export const clearPath = () => {
    window.billboardMap["pathRoute_analyse_points"].removeAll();
    window.labelMap["pathRoute_analyse_labels"].removeAll();
    window.earth.entities.remove(window.billboardMap["pathRoute_analyse_lines"]);
}