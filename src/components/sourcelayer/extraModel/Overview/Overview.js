const CenterPoint = {
    destination: {
        x: -2875513.233796373,
        y: 4843811.440808885,
        z: 2993304.9641675064,
    },
    orientation: {
        heading: 6.274379450234763,
        pitch: -0.5186801226963254, roll: 0
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
        pitch: -0.4460898232723798, roll: 0
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
        pitch: -0.4813481016944854, roll: 0
    },
}
const interval = 40;
const xs = (LeftPoint.destination.x - RightPoint.destination.x) / interval;
const ys = (LeftPoint.destination.y - RightPoint.destination.y) / interval;
const zs = (LeftPoint.destination.z - RightPoint.destination.z) / interval;
const headings = (LeftPoint.orientation.heading - RightPoint.orientation.heading) / interval;
const pitchs = (LeftPoint.orientation.pitch - RightPoint.orientation.pitch) / interval;

export {
    CenterPoint, LeftPoint, RightPoint, xs, ys, zs, headings, pitchs
}