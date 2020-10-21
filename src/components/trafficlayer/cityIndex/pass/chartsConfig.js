import echarts from "echarts";

// GDP
export const gdpOption = {
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
        },
    },
    legend: {
        show: true,
        top: 0,
        right: 0,
        icon: "path://M978.919,520.951a5,5,0,1,1,5-5A5.006,5.006,0,0,1,978.919,520.951Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,978.919,512.951Z",
        itemWidth: 11,
        itemHeight: 11,
        textStyle: {
            color: "#fff",
            fontSize: 11,
        },
    },
    grid: {
        top: "20%",
        right: "1%",
        left: "1%",
        bottom: "0%",
        containLabel: true,
    },
    xAxis: {
        type: "category",
        data: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
        axisLine: {
            lineStyle: {
                color: "rgba(255, 255, 255, 0.5)",
            },
        },
        axisLabel: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisTick: {
            show: false,
        },
    },
    yAxis: {
        name: "单位：亿元",
        nameTextStyle: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisLabel: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    },
    series: [{
        name: "GDP产值",
        type: "bar",
        data: [
            2943.71,
            3436.58,
            3706.52,
            4067.91,
            4350.6,
            4670.35,
            5125.01,
            5412.13,
            6039.77,
            6606.11,
        ],
        barWidth: "55%",
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#26bce5",
            },
            {
                offset: 1,
                color: "rgba(19, 94, 115, 0)",
            },
            ]),
        },
    }]
}


// 常住人口数
export const populationOption = {
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
        },
    },
    legend: {
        show: true,
        top: 0,
        right: 0,
        icon: "path://M978.919,520.951a5,5,0,1,1,5-5A5.006,5.006,0,0,1,978.919,520.951Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,978.919,512.951Z",
        itemWidth: 11,
        itemHeight: 11,
        textStyle: {
            color: "#fff",
            fontSize: 11,
        },
    },
    grid: {
        top: "20%",
        right: "1%",
        left: "1%",
        bottom: "0%",
        containLabel: true,
    },
    xAxis: {
        type: "category",
        data: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
        axisLine: {
            lineStyle: {
                color: "rgba(255, 255, 255, 0.5)",
            },
        },
        axisLabel: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisTick: {
            show: false,
        },
    },
    yAxis: {
        name: "单位：万人",
        min: (value) => value.min - 10,
        max: (value) => value.max + 10,
        nameTextStyle: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisLabel: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    },
    series: [{
        name: "常住人口数",
        type: "bar",
        data: [
            913.45,
            914.3,
            915.6,
            919.7,
            906.8,
            911.7,
            917.5,
            921.5,
            925.0,
            930.0,
        ],
        barWidth: "55%",
        itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#fc5453",
            },
            {
                offset: 1,
                color: "rgba(252, 84, 83, 0)",
            },
            ]),
        },
    }]
}

// 三次产业
export const threeIndustriesOption = {
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "line",
        },
    },
    legend: {
        show: true,
        top: 0,
        right: 0,
        icon: "path://M978.919,520.951a5,5,0,1,1,5-5A5.006,5.006,0,0,1,978.919,520.951Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,978.919,512.951Z",
        itemWidth: 11,
        itemHeight: 11,
        textStyle: {
            color: "#fff",
            fontSize: 11,
        },
        // data:[{}]
    },
    grid: {
        top: "20%",
        right: "4%",
        left: "1%",
        bottom: "0%",
        containLabel: true,
    },
    xAxis: {
        type: "category",
        boundaryGap: false,
        data: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
        axisLine: {
            lineStyle: {
                color: "rgba(255, 255, 255, 0.5)",
            },
        },
        axisLabel: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisTick: {
            show: false,
        },
    },
    yAxis: {
        name: "单位：亿元",
        nameTextStyle: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisLabel: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    },
    series: [{
        name: "第三产业",
        type: "line",
        data: [
            1333.07,
            1595.51,
            1768.9,
            1998.39,
            2115.56,
            2382.72,
            2758.36,
            2935.12,
            3259.49,
            3642.46,
        ],
        symbol: "none",
        label: {
            show: false,
        },
        itemStyle: {
            color: "#00ffeb",
        },
        lineStyle: {
            color: "#00ffeb",
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#00504a",
            },
            {
                offset: 1,
                color: "rgba(0, 128, 118, 0)",
            },
            ]),
        },
    }, {
        name: "第二产业",
        type: "line",
        data: [
            1519.1,
            1736.35,
            1827.23,
            1959.88,
            2122.11,
            2164.26,
            2234.36,
            2336.69,
            2638.06,
            2811.93,
        ],
        symbol: "none",
        label: {
            show: false,
        },
        itemStyle: {
            color: "#fc5453",
        },
        lineStyle: {
            color: "#fc5453",
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#fc5453",
            },
            {
                offset: 1,
                color: "rgba(0, 128, 118, 0)",
            },
            ]),
        },
    }, {
        name: "第一产业",
        type: "line",
        data: [
            91.55,
            104.72,
            110.39,
            109.63,
            112.93,
            123.38,
            132.29,
            140.33,
            142.22,
            151.72,
        ],
        symbol: "none",
        label: {
            show: false,
        },
        itemStyle: {
            color: "#fdcd2a",
        },
        lineStyle: {
            color: "#fdcd2a",
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#846600",
            },
            {
                offset: 1,
                color: "rgba(253, 205, 42, 0)",
            },
            ]),
        },
    }],
}


// 一般公共预算收入
export const revenuesOption = {
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "line",
        },
    },
    legend: {
        show: true,
        top: 0,
        right: 0,
        icon: "path://M978.919,520.951a5,5,0,1,1,5-5A5.006,5.006,0,0,1,978.919,520.951Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,978.919,512.951Z",
        itemWidth: 11,
        itemHeight: 11,
        textStyle: {
            color: "#fff",
            fontSize: 11,
        },
    },
    grid: {
        top: "20%",
        right: "4%",
        left: "1%",
        bottom: "0%",
        containLabel: true,
    },
    xAxis: {
        type: "category",
        boundaryGap: false,
        data: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
        axisLine: {
            lineStyle: {
                color: "rgba(255, 255, 255, 0.5)",
            },
        },
        axisLabel: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisTick: {
            show: false,
        },
    },
    yAxis: {
        name: "单位：亿元",
        nameTextStyle: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisLabel: {
            color: "#fff",
            fontFamily: "DIN",
            fontSize: 11,
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    },
    series: [{
        name: "一般公共预算收入",
        type: "line",
        data: [
            228.49,
            270.87,
            289.64,
            323.98,
            352.53,
            403.07,
            439.87,
            465.35,
            547.58,
            578.97,
        ],
        symbol: "none",
        label: {
            show: false,
        },
        itemStyle: {
            color: "#fdcd2a",
        },
        lineStyle: {
            color: "#fdcd2a",
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#846600",
            },
            {
                offset: 1,
                color: "rgba(253, 205, 42, 0)",
            },
            ]),
        },
    }],
}