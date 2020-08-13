<!--
 * Mapbox GL展示天地图数据
 * @Author: jiangbotao
 * @Date: 2019-12-09 23:17:48
 * @LastEditors: jiangbotao
 * @LastEditTime: 2019-12-18 00:17:04
 * @FilePath: \mymapbox\src\components\Map3857.vue
 -->
<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script>
/* eslint-disable */
// import $ from 'jquery';
// import { Logo, MapService } from '@supermap/iclient-mapboxgl';
import Vue from 'vue';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Logo, QueryByBoundsParameters, QueryService, FeatureService, MeasureService } from '@supermap/iclient-mapboxgl';
import CircularJSON from 'circular-json';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { message } from 'ant-design-vue';
Vue.prototype.$message = message;
message.config({
    duration: 2,
});

const colorAry = ['#FF0000', 'White', '#fbb03b', '#223b53', '#e55e5e', '#3bb2d0', '#cccccc', '#FFFAFA', '#F8F8FF', '#FFF8DC',
			 '#FFFFF0', '#00FF7F', '#00EE76', '#00CD66', '#008B45', '#00FF00', '#00EE00', '#FFFF00', '#EEEE00', '#FFD700',
			 '#FFFFE0', '#F0FFFF', '#FFF9DC', '#90EE90', '#ecf353', '#d7fb5b', '#b0fb5b', '#fdf0dd', '#f5bd70', '#e9f623',
			 '#fafcd9', '#edf236', '#cdf236', '#f3fdc9', '#f4f5ef', '#ebece9', '#b6d440', '#99f50f', '#f1fedc', '#b9f87c',
			 '#f3feeb', '#cbfdaa', '#a0fa66', '#77e133', '#5ff344', '#ddfefc', '#79f6f0', '#dfe0fb', '#00FF00', '#f2f736',
			 '#F0F8FF', '#FF4500', '#ADFF2F', '#FFFAF0', '#F5F5DC', '#EEE9E9', '#FFBBFF', '#EE0000', '#FF6347', '#FFA500',
			 '#98FB98', '#7CFC00', '#7FFF00', '#00FA9A', '#00FF01', '#00FF02', '#01FF00', '#02FF00', '#FBFBFB', '#FFFF01',
			 '#FFFF02', '#f3fdbf', '#f4fdbf', '#fafee7', '#eafa94', '#f7f9eb', '#f27e21', '#f9c471', '#f985d9', '#f8c3ea',
			 '#f8e7f3', '#fce3e3', '#e3f3fc', '#d8dff9', '#e5e6eb', '#fcfdfd', '#dbedf6', '#f5242e', '#f4ebec', '#f1f3f1'];

export default {
	name: 'HelloWorld',
	props: {
		data: {
			type: Object,
			defaule() {
				return {}
			}
		},
		onePoint: {
			type: Object,
			defaule() {
				return {}
			}
		}
	},
	watch:{
		'onePoint'(onePoint){
			var town = onePoint.TOWN;
			var name = onePoint.NAME;
			var longitude = onePoint.LGTD;
			var latitude = onePoint.LTTD;
			var lngLat = {"lng":Number(longitude), "lat":Number(latitude)};
			var html = "<p>区域：" + town + "</p><p>名称：" + name + "</p>";
			var popup = new mapboxgl.Popup({
				closeOnClick: true
			});
			popup.setLngLat(lngLat).setHTML(html).addTo(this.map);
			var mapCenter = this.map.getCenter().toArray();
			mapCenter[0] = Number(longitude);
			mapCenter[1] = Number(latitude);
			this.map.flyTo({
				center: mapCenter
			});
		},
		'data'(data){
			var level = data.level;
			// 勾选
			if(data.checked===true) {
				if("2"===level) {
					var children = data.children;
					for(var i=0;i<children.length;i++) {
						this.addLayer(children[i].url, children[i].alias, children[i].datasetname, children[i].sql, children[i].geotype, level);
					}
					// 层级为"2"时，给其它组件传数据
					this.send2LevelMenuData(data.url, data.alias, data.datasetname, data.sql);
				}
				if("3"===level) {
					var url = data.url;
					var alias = data.alias;
					var datasetname = data.datasetname;
					var sql = data.sql;
					var geotype = data.geotype;
					this.addLayer(url, alias, datasetname, sql, geotype, level);
				}
			}
			// 取消
			else {
				if("2"===level) {
					var children = data.children;
					for(var i=0;i<children.length;i++) {
						this.hideLayer(children[i].alias + "_layer");
					}
				}
				else if("3"===level) {
					var alias = data.alias;
					this.hideLayer(alias + "_layer");
				}
			}
		}
	},
    data() {
        return {
			map: null
        }
	},
    mounted(){
		this.createBaseMap();
	},
	methods: {
		createBaseMap() {
			var bounds = [
				[119.43, 27.10],
				[121.43, 28.62]
			];
			this.map = new mapboxgl.Map({
				container: "map",
				style: {
					"version": 8,
					"sources": {
						"baselayer-source": {
							"type": "raster",
							"tiles": ["https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"],
							"tileSize": 256
						},
						"wz_boundary": {
							"type": "geojson",
							"data": "./static/330300_full.json"
						}
					},
					"layers": [
						{
							"id": "base-layer",
							"type": "raster",
							"source": "baselayer-source",
							"minzoom": 0,
							"maxzoom": 22
						},{
							"id": "wz_boundary",
							"type": "fill",
							"source": "wz_boundary",
							"paint": {
								"fill-color": "#1e3e77",
								"fill-outline-color": "rgba(200, 100, 240, 1)",
								"fill-opacity": 0.1
							},
							"minzoom": 7,
							"maxzoom": 22
						},{
							"id": "wz_boundary_line",
							"type": "line",
							"source": "wz_boundary",
							"layout": {
								"line-cap": "round",
								"line-join": "round"
							},
							"paint": {
								"line-color": "#3e9ad3",
								"line-dasharray": [0.2, 2],
								"line-width": 2
							}
						}
					]
				},
				center: [120.7, 28.0], // starting position
				zoom: 10 // starting zoom
			});
			this.map.addControl(new mapboxgl.NavigationControl(), "top-left");
      		this.map.addControl(new mapboxgl.ScaleControl({}));
      		this.map.addControl(new mapboxgl.AttributionControl({compact: true}));
			var Draw = new MapboxDraw({
				displayControlsDefault: false,
				controls: {
					line_string: true,
					polygon: true,
					trash: true
				}
			});
			this.map.addControl(Draw,'top-left');
				this.map.easeTo({
					pitch: 30
			});
			this.map.on('draw.create', this.measure);
		},
		measure(e) {
			var __this = this;
			var url = "http://192.168.1.100:8090/iserver/services/map-world/rest/maps/World";
			const type = e.features[0].geometry.type;
            var param = new SuperMap.MeasureParameters(e.features[0]);
            if("LineString" === type){
                new MeasureService(url).measureDistance(param, function (serviceResult) {
                    var distance = serviceResult.result.distance;
					var unit = serviceResult.result.unit;
					// __this.$message.info("当前长度: " + distance + " " + unit);
					// console.log("当前长度: " + distance + " " + unit);
                });
            } else {
                new MeasureService(url).measureArea(param, function (serviceResult) {
                    var area = serviceResult.result.area;
                    var unit = serviceResult.result.unit;
                    var rounded_area = Math.round(area * 100) / 100;
					// __this.$message.info("当前面积: " + rounded_area + " 平方" + unit);
					// console.log("当前面积: " + rounded_area + " 平方" + unit);
                });
            }
		},
		// 添加要素数据图层
		addLayer(url, alias, datasetname, sql, geotype, level) {
			var __this = this;
			var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
				queryParameter: {
					name: alias,
					attributeFilter: sql
				},
				datasetNames: [datasetname],
				maxFeatures: 2000,
				toIndex: -1
			});
			new FeatureService(url).getFeaturesBySQL(sqlParam, function (serviceResult) {
				if(serviceResult && serviceResult.result) {
					var features = serviceResult.result.features;
					// console.log("features: " + JSON.stringify(features));
					// 层级为"3"时，给其它组件传数据
					if("3"===level) {
						features.alias = alias;
						__this.$emit('data', features);
					}
					if (!__this.map.getSource(alias + "_source")) {
						if("point"===geotype) {
							__this.map.addSource(alias + "_source", {
								"type": "geojson",
								"data": features,
								cluster: true,
								clusterMaxZoom: 8, // Max zoom to cluster points on
								clusterRadius: 50
							});
						} else if("line"===geotype) {
							__this.map.addSource(alias + "_source", {
								"type": "geojson",
								"data": features
							});
						} else if("ploygon"===geotype) {
							__this.map.addSource(alias + "_source", {
								"type": "geojson",
								"data": features
							});
						}
					} else {
						__this.map.getSource(alias + "_source").setData(features);
					}
					if(__this.map.getLayer(alias + "_layer")){
						__this.map.removeLayer(alias + "_layer");
					}

					var color16 = __this.createColor16();
					// 获取缩放级别zoomLevel，如果zoomLevel大于12，才弹出popup
					var popup = new mapboxgl.Popup({
						anchor: 'bottom',
						closeButton: false,
						offset: {
							'bottom': [0, 0],
						}
					});
					if("point"===geotype) {
						__this.map.addLayer({
							"id": alias + "_layer",
							"type": "circle",
							"source": alias + "_source",
							"paint": {
								"circle-radius": 8,
								"circle-color": color16,
								"circle-opacity": 1.0,
								"circle-stroke-width": 2,
								"circle-stroke-color": "#007cbf",
								"circle-stroke-opacity": 0.7
							}
						});
						// for(var i=0;i<features.features.length;i++) {
						// 	var coordinate = features.features[i].geometry.coordinates;
						// 	var marker = new mapboxgl.Marker()
						// 		.setLngLat(coordinate)
						// 		.addTo(__this.map);
						// }
						__this.map.on('mousemove', alias + "_layer", function (e) {
							var zoomLevel = __this.map.getZoom();
							if(zoomLevel && zoomLevel > 10) {
								var name = e.features[0].properties.NAME;
								popup.setLngLat(e.lngLat).setHTML(name).addTo(__this.map);
								__this.map.getCanvas().style.cursor = 'pointer';
							}
						});
						__this.map.on('mouseout', alias + "_layer", function () {
							__this.map.getCanvas().style.cursor = '';
							popup.remove();
						});
					}
					else if("line"==geotype) {
						__this.map.addLayer({
							"id": alias + "_layer",
							"type": "line",
							"source": alias + "_source",
							"paint": {
								"line-width": 3,
								"line-color": "#EEEE00"
							}
						});
						__this.map.on('mousemove', alias + "_layer", function (e) {
							var name = e.features[0].properties.NAME;
							popup.setLngLat(e.lngLat).setHTML(name).addTo(__this.map);
							__this.map.getCanvas().style.cursor = 'pointer';
						});
						__this.map.on('mouseout', alias + "_layer", function () {
							__this.map.getCanvas().style.cursor = '';
							popup.remove();
						});
					}
					else if("ploygon"==geotype) {
						__this.map.addLayer({
							"id": alias + "_layer",
							"type": "fill",
							"source": alias + "_source",
							"paint": {
								"fill-outline-color": "white",
								"fill-color": "rgba(50, 255, 50, 0.2)"
								// "fill-color": "#33ff33"
							}
						});
						__this.map.on('mousemove', alias + "_layer", function (e) {
							var name = e.features[0].properties.NAME;
							popup.setLngLat(e.lngLat).setHTML(name).addTo(__this.map);
							__this.map.getCanvas().style.cursor = 'pointer';
						});
						__this.map.on('mouseout', alias + "_layer", function () {
							__this.map.getCanvas().style.cursor = '';
							popup.remove();
						});
					}
				}
			});
		},
		// 添加要素数据图层
		send2LevelMenuData(url, alias, datasetname, sql) {
			var __this = this;
			var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
				queryParameter: {
					name: alias,
					attributeFilter: sql
				},
				datasetNames: [datasetname],
				maxFeatures: 2000,
				toIndex: -1
			});
			new FeatureService(url).getFeaturesBySQL(sqlParam, function (serviceResult) {
				if(serviceResult && serviceResult.result) {
					var features = serviceResult.result.features;
					// console.log("features: " + JSON.stringify(features));
					features.alias = alias;
					__this.$emit('data', features);
				}
			});
		},
		// 删除要素图层
		removeLayer(layname) {
			if(this.map.getLayer(layname)){
				this.map.removeLayer(layname);
			}
		},
        hideLayer(layname) {
			if(this.map.getLayer(layname)){
				this.map.setLayoutProperty(layname, 'visibility', 'none');
			}
        },
        showLayer(layname){
			this.map.setLayoutProperty(layname, 'visibility', 'visible');
		},
		createColor16() {
			var r = Math.floor(Math.random() * 256);
			var g = Math.floor(Math.random() * 256);
			var b = Math.floor(Math.random() * 256);
			var rStr = r.toString(16).length < 2 ? "1" + r.toString(16) : r.toString(16);
			var gStr = g.toString(16).length < 2 ? "1" + g.toString(16) : g.toString(16);
			var bStr = b.toString(16).length < 2 ? "1" + b.toString(16) : b.toString(16);
			var color = "#" + rStr + gStr + bStr;

			// var colorIndex = Math.floor(Math.random() * 100);
			// var color = colorAry[colorIndex];
			return color;
		}
	}
}
/* eslint-disable */
</script>
<style scoped>
	#map {
		position: absolute;
		height: 100%;
		width: 100%;
		background-color: white;
	}
	.mapboxgl-popup-content {
		position: relative;
		color: black;
		background: white;
		border-radius: 3px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		padding: 10px 10px 15px;
		pointer-events: auto;
	}
	/deep/ .mapboxgl-canvas {
		top: 0;
		left: 0;
    }
</style>
