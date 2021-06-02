const TOP_COUNT = 8000;
const DENOMINATOR = 100;
const DEFAULT_COLOR = Cesium.Color.fromCssColorString("rgba(166,0,21,0.4)")
const WITHOUT_COLOR = Cesium.Color.fromCssColorString("rgba(0,0,0,0.1)");
const WHITE_COLOR = Cesium.Color.fromCssColorString("rgba(255,255,255,0.8)");
const ColorHash = {
    0: Cesium.Color.fromCssColorString("rgba(77, 104, 239,1)"),
    1: Cesium.Color.fromCssColorString("rgba(77, 141, 255,1)"),
    2: Cesium.Color.fromCssColorString("rgba(98, 180, 250,1)"),
    3: Cesium.Color.fromCssColorString("rgba(145, 200, 203,1)"),
    4: Cesium.Color.fromCssColorString("rgba(203, 217, 141,1)"),
    5: Cesium.Color.fromCssColorString("rgba(246, 221, 91,1)"),
    6: Cesium.Color.fromCssColorString("rgba(253, 203, 70,1)"),
    7: Cesium.Color.fromCssColorString("rgba(253, 170, 65,1)"),
    8: Cesium.Color.fromCssColorString("rgba(253, 133, 60,1)"),
    9: Cesium.Color.fromCssColorString("rgba(242, 79, 32,1)"),
    10: Cesium.Color.fromCssColorString("rgba(211, 25, 0,1)"),
}
const FORCE_LEVEL_LIMIT = {
    area: 1500000,
    street: 150000,
    grid: 8000,
    estate: 8000,
};
const FORCE_LEVEL_DISTANCEC = {
    area: 1000000,
    street: 30000,
    grid: 1800,
    estate: 1800,
};
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
export const doGridMap = ({ id, list, center, count }, _GRIDMAP_INDEX_, BUS_EVENT_TAG_CLICK, forceLevel) => {
    /*count && window.extraPrimitiveMap[_GRIDMAP_INDEX_].add(new Cesium.Primitive({
        geometryInstances: [
            new Cesium.GeometryInstance({
                id: `${BUS_EVENT_TAG_CLICK}@${center.x}@${center.y}@${count}@${id}`,
                geometry: new Cesium.PolygonGeometry({
                    polygonHierarchy: new Cesium.PolygonHierarchy(
                        Cesium.Cartesian3.fromDegreesArray(list.flat(2))
                    ),
                    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                    height: 1,
                    // extrudedHeight: count / DENOMINATOR
                    extrudedHeight: 1,
                }),
                attributes: {
                    // color: Cesium.ColorGeometryInstanceAttribute.fromColor(ColorHash[Math.round((count / TOP_COUNT) * 10)] || DEFAULT_COLOR)
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(WITHOUT_COLOR)
                }
            })
        ],
        appearance: new Cesium.PerInstanceColorAppearance({
            translucent: true,
            closed: true
        })
    }))*/
    count && window.extraPrimitiveMap[_GRIDMAP_INDEX_].add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolylineGeometry({
                id: `${BUS_EVENT_TAG_CLICK}@${center.x}@${center.y}@${count}@${id}@line`,
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(list.map(v => [...v, 4]).flat(2)),
                width: 6,
                vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(ColorHash[Math.round((count / FORCE_LEVEL_LIMIT[forceLevel]) * 10)] || DEFAULT_COLOR)
            }
        }),
        appearance: new Cesium.PolylineColorAppearance({
            translucent: true,
            aboveGround: false,
        })
    }))
}

/**
 * 制造网格范围
 * @param {*} heatArr 
 * @param {*} _GRIDMAP_INDEX_ 
 */
export const doGridPolygon = ({ id, list, center, count }, _GRIDMAP_INDEX_, BUS_EVENT_TAG_CLICK) => {
    /*count && window.extraPrimitiveMap[_GRIDMAP_INDEX_].add(new Cesium.Primitive({
        geometryInstances: [
            new Cesium.GeometryInstance({
                id: `${BUS_EVENT_TAG_CLICK}@${center.x}@${center.y}@${count}@${id}`,
                geometry: new Cesium.PolygonGeometry({
                    polygonHierarchy: new Cesium.PolygonHierarchy(
                        Cesium.Cartesian3.fromDegreesArray(list.flat(2))
                    ),
                    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
                    height: 1,
                    extrudedHeight: 1,
                }),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(WITHOUT_COLOR)
                }
            })
        ],
        appearance: new Cesium.PerInstanceColorAppearance({
            translucent: true,
            closed: true
        })
    }))*/
    count && window.extraPrimitiveMap[_GRIDMAP_INDEX_].add(new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.PolylineGeometry({
                id: `${BUS_EVENT_TAG_CLICK}@${center.x}@${center.y}@${count}@${id}@line`,
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(list.map(v => [...v, 4]).flat(2)),
                width: 4,
                vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT
            }),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(WHITE_COLOR)
            }
        }),
        appearance: new Cesium.PolylineColorAppearance({
            translucent: true,
            aboveGround: false,
        })
    }))
}

/**
 * 画标签
 * @param {*} param0 
 * @param {*} _GRIDLABEL_INDEX_ 
 */
export const doGridLabel = ({ x, y, count, id }, _GRIDLABEL_INDEX_, forceLevel) => {
    if (!window.extraPrimitiveMap[_GRIDLABEL_INDEX_]) {
        window.extraPrimitiveMap[_GRIDLABEL_INDEX_] = window.earth.scene.primitives.add(new Cesium.LabelCollection())
    }
    //  draw label
    window.extraPrimitiveMap[_GRIDLABEL_INDEX_].add({
        id: +new Date(),
        text: `${id ? `[${id}] ` : ``}${count}人`,
        fillColor: ColorHash[Math.round((count / FORCE_LEVEL_LIMIT[forceLevel]) * 10)] || DEFAULT_COLOR,
        position: Cesium.Cartesian3.fromDegrees(
            +x,
            +y,
            // parseInt(+count / DENOMINATOR) + 10
            10
        ),
        ...labelConfig,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, FORCE_LEVEL_DISTANCEC[forceLevel]),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    });
}

/**
 * 画标签
 * @param {*} param0 
 * @param {*} _GRIDLABEL_INDEX_ 
 */
export const doGridLabelWithoutColor = ({ x, y, count, id }, _GRIDLABEL_INDEX_, withoutDistance = false) => {
    if (!window.extraPrimitiveMap[_GRIDLABEL_INDEX_]) {
        window.extraPrimitiveMap[_GRIDLABEL_INDEX_] = window.earth.scene.primitives.add(new Cesium.LabelCollection())
    }
    //  draw label
    window.extraPrimitiveMap[_GRIDLABEL_INDEX_].add({
        id: +new Date(),
        text: `${id ? `[${id}] ` : ``}${count}人`,
        fillColor: WHITE_COLOR,
        position: Cesium.Cartesian3.fromDegrees(
            +x,
            +y,
            // parseInt(+count / DENOMINATOR) + 10
            10
        ),
        ...labelConfig,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, withoutDistance ? 35000 : 1600),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    });
}

/**
 * 画呼吸壁
 * @param {*} param0 
 * @param {*} context 
 * @param {*} WALL_ID 
 */
export const doGridWall = ({ id }, context, WALL_ID) => {
    const geometry = context.gridHash[id].list;
    let alp = 1, num = 0;
    window.earth.entities.removeById(WALL_ID)
    window.earth.entities.add({
        name: WALL_ID,
        id: WALL_ID,
        wall: {
            show: true,
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                geometry.map((v) => [...v, 60]).flat(2)
            ),
            material: new Cesium.ImageMaterialProperty({
                image: "/static/images/area/1.png",
                transparent: true,
                color: new Cesium.CallbackProperty(() => {
                    num % 2 === 0 ? (alp -= 0.01) : (alp += 0.01);
                    alp <= 0.5 || alp >= 1 ? num++ : undefined;
                    return Cesium.Color.WHITE.withAlpha(alp);
                }, false),
            }),
        },
    });
}