const CenterPoint = {
    destination: {
        x: -2875827.430082672,
        y: 4844320.983825179,
        z: 2992854.7126022805
    },
    orientation: {
        heading: 0,
        pitch: -0.5125697843108981,
        roll: 0
    },
}
const LeftPoint = {
    destination: {
        x: -2874943.041406412,
        y: 4844009.229394455,
        z: 2993332.1415675106
    },
    orientation: {
        heading: 0.45427453971735154,
        pitch: -0.4460898232723798, roll: 0,
    },
}
const RightPoint = {
    destination: {
        x: -2876062.678304875,
        y: 4843333.622606689,
        z: 2993448.5168502606
    },
    orientation: {
        heading: 5.692002420971301,
        pitch: -0.4813481016944854, roll: 0,
    },
}
const interval = 40;
const xs = (LeftPoint.destination.x - RightPoint.destination.x) / interval;
const ys = (LeftPoint.destination.y - RightPoint.destination.y) / interval;
const zs = (LeftPoint.destination.z - RightPoint.destination.z) / interval;
const headings = (LeftPoint.orientation.heading - RightPoint.orientation.heading) / interval;
const pitchs = (LeftPoint.orientation.pitch - RightPoint.orientation.pitch) / interval;

/**
* 生成曲线来表达国家间的人口流动曲线
* @param startPoint 起点
* @param endPoint 终点
* @returns {Array}
*/
function generateCurve(startPoint, endPoint) {
    let addPointCartesian = new Cesium.Cartesian3();
    Cesium.Cartesian3.add(startPoint, endPoint, addPointCartesian);
    let midPointCartesian = new Cesium.Cartesian3();
    Cesium.Cartesian3.divideByScalar(addPointCartesian, 2, midPointCartesian);
    midPointCartesian.z = 400;
    let spline = new Cesium.CatmullRomSpline({
        times: [0.0, 0.5, 1.0],
        points: [startPoint, midPointCartesian, endPoint]
    });
    let curvePointsArr = [];
    for (let i = 0, len = 100; i < len; i++) {
        const p = spline.evaluate(i / len)
        curvePointsArr.push(p.x, p.y, p.z);
    }
    return curvePointsArr;
}

/**
 * 
 * @param {*} WzOverviewData 
 */
const getIndexPoints = (WzOverviewData) => {
    return [{
        geometry: {
            "x": 120.6923,
            "y": 27.9936
        },
        value: '394.4',
        unit: '亿元',
        label: "一般公共预算收入"
    }, {
        geometry: {
            "x": 120.6985,
            "y": 27.9939
        },
        value: WzOverviewData.规上工业 && WzOverviewData.规上工业.industryAddValue ? WzOverviewData.规上工业.industryAddValue : '368.02',
        unit: '亿元',
        label: "规上工业增加值"
    }, {
        geometry: {
            "x": 120.6953,
            "y": 27.9979
        },
        value: WzOverviewData.gdp || '3076',
        unit: '亿元',
        label: "地区GDP"
    }, {
        geometry: {
            "x": 120.6989,
            "y": 27.9985
        },
        value: WzOverviewData.people || '833.55',
        unit: '万人',
        label: "全市人口"
    }, {
        geometry: {
            "x": 120.6914,
            "y": 27.9982
        },
        value: '2.6',
        unit: 'CPI',
        label: "消费者物价指标"
    }]
}

const centerPosition = new Cesium.Cartesian3.fromDegrees(
    120.7312,
    28.0264,
    10
);

const dirPosition = new Cesium.Cartesian3.fromDegrees(
    120.6511,
    27.9660,
    10
);

export {
    generateCurve, getIndexPoints, CenterPoint, LeftPoint, RightPoint, centerPosition, dirPosition
}