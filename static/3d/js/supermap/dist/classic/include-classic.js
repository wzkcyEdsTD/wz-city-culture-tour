(function () {
    var r = new RegExp("(^|(.*?\\/))(include-classic\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'), targetScript;
    for (var i = 0; i < s.length; i++) {
        var src = s[i].getAttribute('src');
        if (src) {
            var m = src.match(r);
            if (m) {
                targetScript = s[i];
                break;
            }
        }
    }

    function inputScript(url) {
        var script = '<script type="text/javascript" src="' + url + '"><' + '/script>';
        document.writeln(script);
    }

    function inputCSS(url) {
        var css = '<link rel="stylesheet" href="' + url + '">';
        document.writeln(css);
    }

    function inArray(arr, item) {
        for (i in arr) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    }

    function supportES6() {
        var code = "'use strict'; class Foo {}; class Bar extends Foo {};";
        try {
            (new Function(code))();
        } catch (err) {
            return false;
        }
        if (!Array.from) {
            return false;
        }
        return true;
    }


    //加载类库资源文件
    function load() {
        var includes = (targetScript.getAttribute('include') || "").split(",");
        var excludes = (targetScript.getAttribute('exclude') || "").split(",");
        if (!inArray(excludes, 'iclient8c')) {
            inputScript("../../web/libs/iclient8c/libs/SuperMap.Include.js");
        }
        if (inArray(includes, 'mapv')) {
            inputScript("../../web/libs/mapv/2.0.20/mapv.min.js");
        }
        if (inArray(includes, 'echarts')) {
            inputScript("../../web/libs/echarts/4.0.4/echarts.min.js");
        }
        if (inArray(includes, 'nanoscroller')) {
            inputCSS("../../web/libs/iclient8c/examples/css/nanoscroller.css");
            inputScript("../../web/libs/iclient8c/examples/js/jquery.nanoscroller.min.js");
        }
        if (inArray(includes, 'infoWindow')) {
            inputCSS("../../web/libs/iclient8c/examples/js/plugins/infoWindow/infoWindow.css");
            inputScript("../../web/libs/iclient8c/examples/js/plugins/infoWindow/InfoWindow.js");
        }
        if (inArray(includes, 'heatmapColorCSS')) {
            inputCSS("../../web/libs/iclient8c/examples/css/heatmap.css");
        }
        if (!inArray(excludes, 'iclient-classic')) {
            if (supportES6()) {
                inputScript("../../dist/classic/iclient-classic-es6.min.js");
            } else {
                inputScript("../../dist/classic/iclient-classic.min.js");
            }
        }
        if (inArray(includes, 'tianditu')) {
            inputScript("../../web/libs/iclient8c/examples/js/layer/Tianditu.js");
        }
        if (inArray(includes, 'echarts-all')) {
            inputScript("../../web/libs/iclient8c/examples/js/echarts-all.js");
        }
        if (inArray(includes, 'baidu')) {
            inputScript("../../web/libs/iclient8c/examples/js/layer/Baidu.js");
        }
        if (inArray(includes, 'OSMBuildings-SuperMap')) {
            inputScript("../../web/libs/iclient8c/examples/js/OSMBuildings-SuperMap.js");
        }
        if (inArray(includes, 'D3WindMap')) {
            inputScript("../../web/libs/iclient8c/examples/js/D3WindMap.js");
        }
        if (inArray(includes, 'd3')) {
            inputScript("../../web/libs/iclient8c/examples/js/d3.v3.min.js");
        }
        if (inArray(includes, 'three')) {
            inputScript("../../web/libs/iclient8c/examples/js/third-party/Three/ThreeWebGL.js");
            inputScript("../../web/libs/iclient8c/examples/js/third-party/Three/ThreeExtras.js");
            inputScript("../../web/libs/iclient8c/examples/js/third-party/Three/RequestAnimationFrame.js");
            inputScript("../../web/libs/iclient8c/examples/js/third-party/Three/Detector.js");
            inputScript("../../web/libs/iclient8c/examples/js/third-party/globe.js");
        }
        if (inArray(includes, 'MapToImg')) {
            inputScript("../../web/libs/iclient8c/examples/js/MapToImg.js");
        }
        if (inArray(includes, 'Bar')) {
            inputScript("../../web/libs/iclient8c/examples/js/graph/Bar.js");
        }
        if (inArray(includes, 'Bar3D')) {
            inputScript("../../web/libs/iclient8c/examples/js/graph/Bar3D.js");
        }
        if (inArray(includes, 'Circle')) {
            inputScript("../../web/libs/iclient8c/examples/js/graph/Circle.js");
        }
        if (inArray(includes, 'Line')) {
            inputScript("../../web/libs/iclient8c/examples/js/graph/Line.js");
        }
        if (inArray(includes, 'Pie')) {
            inputScript("../../web/libs/iclient8c/examples/js/graph/Pie.js");
        }
        if (inArray(includes, 'Point')) {
            inputScript("../../web/libs/iclient8c/examples/js/graph/Point.js");
        }
        if (inArray(includes, 'Ring')) {
            inputScript("../../web/libs/iclient8c/examples/js/graph/Ring.js");
        }
        if (inArray(includes, 'style')) {
            inputCSS("../../web/libs/iclient8c/theme/default/style.css");
        }
        if (inArray(includes, 'sm-doc')) {
            inputCSS("../../web/libs/iclient8c/examples/css/sm-doc.css");
        }
        if (inArray(includes, 'LargeFormatPrints')) {
            inputScript("../../web/libs/iclient8c/examples/js/LargeFormatPrints.js");
        }
        if (inArray(includes, 'PlottingPanel')) {
            inputScript("../../web/libs/iclient8c/examples/js/plottingPanel/PlottingPanel.Include.js");
        }
        if (inArray(includes, 'bevInclude')) {
            inputScript("../../web/libs/iclient8c/examples/js/bevInclude.js");
        }
        if (inArray(includes, 'DefaultStyleConfiguration')) {
            inputScript("../../web/libs/iclient8c/resource/Plugins/Plotting/DefaultStyleConfiguration.js");
        }
    }

    load();
    window.isLocal = true;
    window.server = document.location.toString().match(/file:\/\//) ? "http://localhost:8090" : document.location.protocol + "//" + document.location.host;
})();
