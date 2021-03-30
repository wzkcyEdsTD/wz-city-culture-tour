/**
 * 分析导航路径
 * @param {*} originResult 
 */
export const dealPathWithXhr = (result) => {
    const { line, length } = result.route;
    const { points, center } = line;
    drawPathWithLine(points);
    drawLabelWithCenter(center, length)
}

/**
 * 画导航路径
 * @param {*} points 
 */
const drawPathWithLine = (points) => {
    window.extraPrimitiveMap["pathRoute_analyse_lines"] = window.earth.entities.add({
        name: "pathRoute_line",
        id: "pathRoute_line",
        polyline: new Cesium.PolylineGraphics({
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                points.map(({ x, y }) => [x, y, 10]).flat(2)
            ),
            width: 10,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: .15, //一个数字属性，指定发光强度，占总线宽的百分比。
                color: Cesium.Color.LIGHTBLUE.withAlpha(.9)
            })
        }),
    });
    //  点 先不放
    // points.map(({ x, y }, i) => {
    //     const position = Cesium.Cartesian3.fromDegrees(
    //         parseFloat(x),
    //         parseFloat(y),
    //         10
    //     );
    //     i < points.length - 1 && window.extraPrimitiveMap["pathRoute_analyse_points"].add({
    //         id: "pathRoute_points_" + i,
    //         pixelSize: 6,
    //         color: Cesium.Color.RED,
    //         outlineColor: Cesium.Color.YELLOW,
    //         outlineWidth: 3,
    //         disableDepthTestDistance: Number.POSITIVE_INFINITY,
    //         position,
    //     });
    // });
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
        10
    );
    window.extraPrimitiveMap["pathRoute_analyse_labels"].add({
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
    // window.extraPrimitiveMap["pathRoute_analyse_points"].removeAll();
    window.extraPrimitiveMap["pathRoute_analyse_labels"].removeAll();
    window.earth.entities.remove(window.extraPrimitiveMap["pathRoute_analyse_lines"]);
}