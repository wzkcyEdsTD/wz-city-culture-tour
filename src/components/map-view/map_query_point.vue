<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script>
/* eslint-disable */
import mapboxgl from 'mapbox-gl';
import { Logo, QueryByBoundsParameters, QueryService } from '@supermap/iclient-mapboxgl';

export default {
  name: 'HelloWorld',
  data() {
    return {}
  },
  mounted() {
    var host = 'http://localhost:8090';
    var url = 'http://localhost:8090/iserver/services/map-mvt-ChinaprovincialCapital/rest/maps/China_provincialCapital';

    var map = new mapboxgl.Map({
      container: 'map',
      attributionControl: false,
      style: 'http://localhost:8090/iserver/services/map-mvt-ChinaprovincialCapital/rest/maps/China_provincialCapital/tileFeature/vectorstyles.json?type=MapBox_GL&styleonly=true',
      center: [118.9, 31.8], // starting position
      zoom: 5 // starting zoom
    });
    // 右下方添加超图的图标
    map.addControl(new Logo(), 'bottom-right');
    // 添加放大、缩小、旋转地图按钮
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    // 添加比例尺
    map.addControl(new mapboxgl.ScaleControl({}));
    // 添加全屏按钮
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    // 添加定位按钮
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }), 'top-left');
    // 添加属性控制
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    // // 添加画图工具
    // var Draw = new MapboxDraw();
    // map.addControl(Draw,'top-left');

    var url2 = 'http://localhost:8090/iserver/services/data-China-3/rest/data';
    // 指定SQL查询服务参数
    var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
      queryParameter: {
        name: 'pt1@YJDB',
        // 查询出所有的点
        attributeFilter: 'SMID >= 1'
      },
      datasetNames: ['YJDB:pt1']
    });
    new mapboxgl.supermap.FeatureService(url2).getFeaturesBySQL(sqlParam, function(serviceResult) {
      // 获取服务器返回的结果
      var features = serviceResult.result.features;
      var res1 = {};
      var res2 = {};
      var city1 = [];
      var city2 = [];

      // console.log("返回结果：" + JSON.stringify(features));
      for (var i = 0; i < features.features.length; i++) {
        // var coordinates = features.features[i].geometry.coordinates;
        // var popup = new mapboxgl.Popup({ closeOnClick: true })
        //     .setHTML('<p>城市：' + features.features[i].properties.NAME + '</p>'
        //                + '<p>价格：' + features.features[i].properties.PRICE + '</p>')
        //     .setLngLat(coordinates)
        //     .addTo(map);

        if ('A' === features.features[i].properties.TYPE) {
          city1.push(features.features[i]);
        } else if ('B' === features.features[i].properties.TYPE) {
          city2.push(features.features[i]);
        }
      };
      res1.type = 'FeatureCollection';
      res1.features = city1;
      // console.log('city1: ' + JSON.stringify(city1));

      res2.type = 'FeatureCollection';
      res2.features = city2;

      // 添加要素数据图层
      map.addLayer({
        'id': 'city1',
        'type': 'circle',
        'paint': {
          'circle-radius': 8,
          'circle-color': '#FF0000',
          'circle-opacity': 0.5,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#007cbf',
          'circle-stroke-opacity': 0.5
        },
        'source': {
          'type': 'geojson',
          'data': res1
        }
      });
      map.addLayer({
        'id': 'city2',
        'type': 'circle',
        'paint': {
          'circle-radius': 6,
          'circle-color': '#00FF00',
          'circle-opacity': 0.5,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#007cbf',
          'circle-stroke-opacity': 0.5
        },
        'source': {
          'type': 'geojson',
          'data': res2
        }
      });

      var popup = new mapboxgl.Popup({
        anchor: 'bottom',
        closeOnClick: true
      });

      map.on('mouseenter', 'city1', function(e) {
        var properties = e.features[0].properties;
        var coordinates = e.features[0].geometry.coordinates;
        popup.remove();
        popup.setHTML('<p>城市：' + properties.NAME + '</p>' + '<p>价格：' + properties.PRICE + '</p>')
          .setLngLat(coordinates)
          .addTo(map);
      });
      map.on('mouseleave', 'city1', function(e) {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

      map.on('mouseenter', 'city2', function(e) {
        var properties = e.features[0].properties;
        var coordinates = e.features[0].geometry.coordinates;
        popup.remove();
        popup.setHTML('<p>城市：' + properties.NAME + '</p>' + '<p>价格：' + properties.PRICE + '</p>')
          .setLngLat(coordinates)
          .addTo(map);
      });
      map.on('mouseleave', 'city2', function(e) {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    })
  }
}
/* eslint-disable */
</script>

<style scoped>
  #map {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: white
  }
</style>

