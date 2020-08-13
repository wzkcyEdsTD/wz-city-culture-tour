<!--
 * Mapbox GL展示天地图数据
 * @Author: jiangbotao
 * @Date: 2019-12-09 23:17:48
 * @LastEditors: eds
 * @LastEditTime: 2020-08-06 14:53:35
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\base_map.vue
 -->
<template>
  <div>
    <div id="rightMap" v-if="isShwo">
      <!-- <SwitchBtn v-if="isShwo" class="switchBtn" @switchMap="switchMap"></SwitchBtn> -->
    </div>

    <SwitchBtn v-if="isShwo" v-bind:isShwo="isShwo" class="switchBtn" @switchMap="switchMap"></SwitchBtn>
    <!-- <div class="toCenterRight" v-if="isShwo" :class="{collapse: collapse1, active: centerShow}" title="">
      <p>wwo zao fdaf </p>
      <i style="width: 100%;height: 0.42rem;" @click="showTool" ></i>
      <div
        class="center-item"
        :class="'btn'+(index+1)"
        :key="index"
        :title="item.name"
        v-for="(item, index) in mapNew"
        @click="changeMapTollBarTop(item, index)">{{item.abbrev}}</div>
    </div>-->
    <div id="base-map">
      <InputSearch
        class="search"
        :class="this.collapse1?'collapse':''"
        :getBlurNames="getBlurNames"
        @chooseAddress="chooseAddress($event)"
        @searchFeatureNames="searchFeatureNames($event)"
      ></InputSearch>
      <MeterBox
        ref="meterBox"
        :data="measureMsg"
        class="meter-box"
        :class="this.collapse1?'collapse':''"
      ></MeterBox>
      <div class="legend-box" :class="{collapse:collapse2,splitScreen:splitScreen}">
        <Legend2 ref="legend2" :legendMsg2="legendMsg2"></Legend2>
        <Legend ref="legend" :legendMsg="legendMsg"></Legend>
      </div>
      <BaseMapMenu
        ref="baseMapMenu"
        @hideBasemapMenu="hideBasemapMenu"
        @checkValue="checkValue"
        :showSwicthMenu="showSwicthMenu"
        :currentCheck="currentCheck"
        class="basemap-menu"
      ></BaseMapMenu>
    </div>
    <div>
      <div id="map_line" class="mapQuart"></div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Vue from "vue";
import {
  Logo,
  QueryByBoundsParameters,
  QueryService,
  FeatureService,
  MeasureService
} from "@supermap/iclient-mapboxgl";
import CircularJSON from "circular-json";
import InputSearch from "components/map-view/input_search";
import MeterBox from "components/map-view/meter_box";
import Legend from "components/map-view/legend";
import Legend2 from "components/map-view/legend2";
import SwitchBtn from "components/map-view/switch_btn";
import $ from "jquery";
// import "./base_map.less";
import { mapGetters, mapActions } from "vuex";
import getDistrictData from "./wenzhou_district.json";
import getStreetData from "./wenzhou_street.json";
import standardVectortile from "../../../static/standard_vectortile.json";
import wenzhou_xz from "../../../static/wenzhou_xz.json";
import {
  getCategoryByPid,
  getPointTreeList,
  getSearchNameList,
  getTypeDetail,
  getPictureDistrictTypeNum,
  getNearAnalysisList
} from "api/map/map";

import {
  distance,
  point,
  circle,
  bboxPolygon,
  booleanPointInPolygon,
  polygon,
  pointsWithinPolygon
} from "@turf/turf";
import MAP_CONFIG from "./mapconfig";
import BaseMapMenu from "./basemap_menu.vue";

const colorAry = [
  "#FF0000",
  "White",
  "#fbb03b",
  "#223b53",
  "#e55e5e",
  "#3bb2d0",
  "#cccccc",
  "#FFFAFA",
  "#F8F8FF",
  "#FFF8DC",
  "#FFFFF0",
  "#00FF7F",
  "#00EE76",
  "#00CD66",
  "#008B45",
  "#00FF00",
  "#00EE00",
  "#FFFF00",
  "#EEEE00",
  "#FFD700",
  "#FFFFE0",
  "#F0FFFF",
  "#FFF9DC",
  "#90EE90",
  "#ecf353",
  "#d7fb5b",
  "#b0fb5b",
  "#fdf0dd",
  "#f5bd70",
  "#e9f623",
  "#fafcd9",
  "#edf236",
  "#cdf236",
  "#f3fdc9",
  "#f4f5ef",
  "#ebece9",
  "#b6d440",
  "#99f50f",
  "#f1fedc",
  "#b9f87c",
  "#f3feeb",
  "#cbfdaa",
  "#a0fa66",
  "#77e133",
  "#5ff344",
  "#ddfefc",
  "#79f6f0",
  "#dfe0fb",
  "#00FF00",
  "#f2f736",
  "#F0F8FF",
  "#FF4500",
  "#ADFF2F",
  "#FFFAF0",
  "#F5F5DC",
  "#EEE9E9",
  "#FFBBFF",
  "#EE0000",
  "#FF6347",
  "#FFA500",
  "#98FB98",
  "#7CFC00",
  "#7FFF00",
  "#00FA9A",
  "#00FF01",
  "#00FF02",
  "#01FF00",
  "#02FF00",
  "#FBFBFB",
  "#FFFF01",
  "#FFFF02",
  "#f3fdbf",
  "#f4fdbf",
  "#fafee7",
  "#eafa94",
  "#f7f9eb",
  "#f27e21",
  "#f9c471",
  "#f985d9",
  "#f8c3ea",
  "#f8e7f3",
  "#fce3e3",
  "#e3f3fc",
  "#d8dff9",
  "#e5e6eb",
  "#fcfdfd",
  "#dbedf6",
  "#f5242e",
  "#f4ebec",
  "#f1f3f1"
];

export default {
  name: "BaseMap",
  props: {
    getDistrict: {
      type: Object,
      defaule() {
        return {};
      }
    },
    isCloseSpace: {
      type: Object,
      defaule() {
        return {};
      }
    },
    kmAround: {
      type: Object,
      default() {
        return {
          km: 1000,
          data: "all"
        };
      }
    },
    data: {
      type: Object,
      defaule() {
        return {};
      }
    },
    onePoint: {
      type: Object,
      defaule() {
        return {};
      }
    },
    rClickMenu: {
      type: Object,
      defaule() {
        return {};
      }
    },
    mapTollBar: {
      type: Object,
      defaule() {
        return {};
      }
    }
  },
  components: {
    InputSearch,
    MeterBox,
    Legend,
    Legend2,
    BaseMapMenu,
    SwitchBtn
  },
  computed: {
    ...mapGetters("map", [
      "treeCheckedList",
      "currentMapType",
      "typeIndex",
      "collapse1",
      "collapse2",
      "collapse3",
      "splitScreen"
    ]),
    ...mapGetters(["userInfo"])
  },
  watch: {
    isCoverToolbarShow(bool) {
      this.$parent.$refs.mapCenterBtn.isCoverToolbarShow = bool;
    },
    getDistrict(data) {
      // console.log('data: ' + CircularJSON.stringify(data));
      if (!data.refresh) {
        return;
      }
      var userDistrict = this.userInfo.district;
      if ("3303" !== userDistrict) {
        this.selectedStreet = data.value;
        this.setStreetLayer(this.selectedStreet, userDistrict, true);
      } else {
        this.selectedDistrict = data.value;
        this.setDistrictLayer(this.selectedDistrict, true);
      }
    },
    isCloseSpace(data) {
      if (data.data === true) {
        // document.getElementsByClassName('mapbox-gl-draw_trash')[0].click();
        this.removeLayer("drawLine_layer");
        this.removeLayer("drawPolygon_layer");
      }
    },
    kmAround(data) {
      // 查询的情况
      if ("all" === data.data) {
        // 画缓冲区
        var circle = this.createCircle(
          this.showAroundRequestParam.center,
          data.km
        );
        // 查询
        if (data.km === 1000) {
          this.map.setZoom(14);
        }
        if (data.km === 3000) {
          this.map.setZoom(13);
        }
        if (data.km === 5000) {
          this.map.setZoom(12);
        }
        if (data.km === 10000) {
          this.map.setZoom(10);
        }
        this.map.flyTo({
          center: this.showAroundRequestParam.center
        });
        var queryCoordinates = circle.geometry.coordinates;
        this.queryAround(
          circle,
          this.showAroundRequestParam.center,
          queryCoordinates,
          data.km
        );
      }
      // 关闭的情况
      else if ("close" === data.data) {
        // console.log('data: ' + CircularJSON.stringify(data))
        for (var i = 0; i < this.aroundAliasAry.length; i++) {
          if (this.map.getLayer(this.aroundAliasAry[i] + "_layer")) {
            this.map.removeLayer(this.aroundAliasAry[i] + "_layer");
          }
        }
        for (var i = 0; i < this.nearAliasAry.length; i++) {
          if (this.map.getLayer(this.nearAliasAry[i] + "_layer")) {
            this.map.removeLayer(this.nearAliasAry[i] + "_layer");
          }
          if (this.map.getLayer(this.nearAliasAry[i] + "_gaoliang_layer")) {
            this.map.removeLayer(this.nearAliasAry[i] + "_gaoliang_layer");
          }
        }
        if (this.map.getLayer("showAround_layer")) {
          this.map.removeLayer("showAround_layer");
        }
      }
      // 勾选/取消图层的情况
      else {
        var alias = data.data.alias;
        // 勾选图层
        if (true === data.data.checked) {
          this.addAroundAnalysisLayer(alias);
        }
        // 取消图层
        else {
          this.removeLayer(alias + "_layer");
        }
      }
    },
    onePoint(data) {
      if (
        data.refresh === false ||
        data.goToCenter !== true ||
        !data.latitude
      ) {
        return;
      }
      const longitude = data.longitude;
      const latitude = data.latitude;
      const lngLat = { lng: Number(longitude), lat: Number(latitude) };
      const lngLatAry = [Number(longitude), Number(latitude)];
      // 拼接地图气泡
      var str = "";
      for (var i = 1; i < data._mappopfield.length; i++) {
        str += `<div class='pop-body'>
                  <span>${data._mappopname[i]}：</span>
                  <p>${
                    data[data._mappopfield[i].toLowerCase()] !== undefined &&
                    data[data._mappopfield[i].toLowerCase()] !== null &&
                    (data[data._mappopfield[i].toLowerCase()] + "").trim() !==
                      ""
                      ? data[data._mappopfield[i].toLowerCase()]
                      : "暂无数据"
                  }</p>
                </div>`;
      }
      this.showAroundRequestParam = { center: lngLatAry, distance: "1000" };
      this.areaQueryCenterCoordinates = lngLatAry;
      if (data.guid != "" && data.guid != null) {
        var html = `<div class="pop-tip">
            <p class="">${
              data[data._mappopfield[0].toLowerCase()] !== undefined &&
              data[data._mappopfield[0].toLowerCase()] !== null &&
              (data[data._mappopfield[0].toLowerCase()] + "").trim() !== ""
                ? data[data._mappopfield[0].toLowerCase()]
                : "暂无数据"
            }</p>
            ${str}
            <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
            <span class="pop-tip-list" onclick="showInfoCamera()"><img src="./static/gitimage/other/camera_white.png"></span>
            <span class="pop-tip-around" onclick="showAround()">周边分析</span>
            <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
          </div>`;
      } else {
        var html = `<div class="pop-tip">
            <p class="">${
              data[data._mappopfield[0].toLowerCase()] !== undefined &&
              data[data._mappopfield[0].toLowerCase()] !== null &&
              (data[data._mappopfield[0].toLowerCase()] + "").trim() !== ""
                ? data[data._mappopfield[0].toLowerCase()]
                : "暂无数据"
            }</p>
            ${str}
            <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
            <span class="pop-tip-around" onclick="showAround()">周边分析</span>
            <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
          </div>`;
      }

      var popup = new mapboxgl.Popup({
        closeOnClick: false
      });
      // 删除别的提示框
      $(".mapboxgl-popup-close-button").off("click");
      var tipElArr = document.getElementsByClassName(
        "mapboxgl-popup-close-button"
      );
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      popup
        .setLngLat(lngLat)
        .setHTML(html)
        .addTo(this.map);
      var mapCenter = this.map.getCenter().toArray();
      mapCenter[0] = Number(longitude);
      mapCenter[1] = Number(latitude);
      //如果是滑坡、崩塌、泥石流，则对地图进行放大到18级
      if (
        data.type === "滑坡" ||
        data.type === "崩塌" ||
        data.type === "泥石流"
      ) {
        this.map.setZoom(18);
      } else {
        this.map.setZoom(15);
      }
      this.map.flyTo({
        center: mapCenter
      });
      $(".mapboxgl-popup-close-button").on("click", () => {
        this.$emit("clearCurrentTableRow");
      });
    },
    // 左侧菜单的勾选、取消操作
    data(data) {
      // console.log('data:' + CircularJSON.stringify(data))
      // 点击一张图底部切换数据不刷新地图
      if (data.noAddMapPoint) {
        return;
      }

      //删除遮盖面
      var userDistrict = this.userInfo.district;
      if (userDistrict === "3303") {
        this.removeLayer("basemapDistrict_layer");
        this.removeLayer("districtBoundary_layer");
        this.isCoverToolbarShow = false;
      } else {
        this.removeLayer("basemapStreet_layer");
        this.removeLayer("streetBoundary_layer");
      }

      //删除highlight_layer
      this.removeLayer("highlight_layer");

      var level = data.level;
      if ("juhe" === this.currentMapType) {
        //加载线、面图层
        //勾选菜单
        if (data.checked) {
          // 二级菜单勾选情况
          if ("2" === level) {
            var children = data.children;
            for (var i = 0; i < children.length; i++) {
              if (
                children[i].geotype === "line" ||
                children[i].geotype === "polygon"
              ) {
                this.addLineOrPolygonFromServer(
                  children[i].url,
                  children[i].alias,
                  children[i].geotype
                );
              }
              // 有子菜单的情况
              if (children[i].children && children[i].children !== []) {
                for (var j = 0; j < children[i].children.length; j++) {
                  var childrenData = children[i].children[j];
                  if (
                    childrenData.geotype === "line" ||
                    childrenData.geotype === "polygon"
                  ) {
                    this.addLineOrPolygonFromServer(
                      childrenData.url,
                      childrenData.alias,
                      childrenData.geotype
                    );
                  }
                }
              }
            }
          } else if ("3" === level) {
            if (data.geotype === "line" || data.geotype === "polygon") {
              this.addLineOrPolygonFromServer(
                data.url,
                data.alias,
                data.geotype
              );
            }
            // 有子菜单的情况
            if (data.children && data.children !== []) {
              for (var i = 0; i < data.children.length; i++) {
                if (
                  data.children[i].geotype === "line" ||
                  data.children[i].geotype === "polygon"
                ) {
                  this.addLineOrPolygonFromServer(
                    data.children[i].url,
                    data.children[i].alias,
                    data.children[i].geotype
                  );
                }
              }
            }
          }
        } else {
          if ("2" === level) {
            var children = data.children;
            for (var i = 0; i < children.length; i++) {
              if (
                children[i].geotype === "line" ||
                children[i].geotype === "polygon"
              ) {
                this.removeLayer(children[i].alias + "_layer");
              }
              // 有子菜单的情况
              if (children[i].children && children[i].children !== []) {
                for (var j = 0; j < children[i].children.length; j++) {
                  if (
                    children[i].children[j].geotype === "line" ||
                    children[i].children[j].geotype === "polygon"
                  ) {
                    var childrenData = children[i].children[j];
                    this.removeLayer(childrenData.alias + "_layer");
                  }
                }
              }
            }
          } else if ("3" === level) {
            if (data.geotype === "line" || data.geotype === "polygon") {
              this.removeLayer(data.alias + "_layer");
            }
            // 有子菜单的情况
            if (data.children && data.children !== []) {
              for (var i = 0; i < data.children.length; i++) {
                if (
                  data.children[i].geotype === "line" ||
                  data.children[i].geotype === "polygon"
                ) {
                  var childrenData = data.children[i];
                  this.removeLayer(childrenData.alias + "_layer");
                }
              }
            }
          }
        }

        // 获取左侧所有选中的三级菜单
        var checkedMenu = this.data.allCheckData;
        // console.log("checkedMenu: " + JSON.stringify(checkedMenu));
        if (!checkedMenu) {
          return;
        }
        var datasetnames = [];
        for (var i = 0; i < checkedMenu.length; i++) {
          if ("point" === checkedMenu[i].geotype) {
            this.currentScatterLayers.push(checkedMenu[i].alias + "_layer");
            if (datasetnames.indexOf(checkedMenu[i].datasetname) < 0) {
              datasetnames.push(checkedMenu[i].datasetname);
            }
          }
        }

        // 根据当前地图的级别，选中添加对应的图层
        var zoomLevel = this.map.getZoom();
        // 6-11级，显示区县地图
        if (zoomLevel && zoomLevel <= 11) {
          this.addJuheLayer("district_layer");
          this.IsJuheScatterLayer = false;
        }
        // 12-14级，显示乡镇地图
        else if (zoomLevel && zoomLevel > 11 && zoomLevel <= 14) {
          this.addJuheLayer("street_layer");
          this.IsJuheScatterLayer = false;
        }
        // 14级以上，显示散点图、散点图图例
        else {
          if (data.checked === true) {
            if ("2" === level) {
              var children = data.children;
              for (var i = 0; i < children.length; i++) {
                this.addScatterLayerFromServer(
                  children[i].url,
                  children[i].alias,
                  children[i].icon,
                  children[i].datasetname,
                  children[i].sql,
                  children[i].geotype
                );
                // 有子菜单的情况
                if (children[i].children && children[i].children !== []) {
                  for (var j = 0; j < children[i].children.length; j++) {
                    var childrenData = children[i].children[j];
                    this.addScatterLayerFromServer(
                      childrenData.url,
                      childrenData.alias,
                      childrenData.icon,
                      childrenData.datasetname,
                      childrenData.sql,
                      childrenData.geotype
                    );
                  }
                }
              }
            } else if ("3" === level) {
              this.addScatterLayerFromServer(
                data.url,
                data.alias,
                data.icon,
                data.datasetname,
                data.sql,
                data.geotype
              );
              // 有子菜单的情况
              if (data.children && data.children !== []) {
                for (var i = 0; i < data.children.length; i++) {
                  var childrenData = data.children[i];
                  this.addScatterLayerFromServer(
                    childrenData.url,
                    childrenData.alias,
                    childrenData.icon,
                    childrenData.datasetname,
                    childrenData.sql,
                    childrenData.geotype
                  );
                }
              }
            }
          } else {
            if ("2" === level) {
              var children = data.children;
              for (var i = 0; i < children.length; i++) {
                this.removeLayer(children[i].alias + "_layer");
                this.removeLayer(children[i].alias + "_notelayer");
                // 有子菜单的情况
                if (children[i].children && children[i].children !== []) {
                  for (var j = 0; j < children[i].children.length; j++) {
                    var childrenData = children[i].children[j];
                    this.removeLayer(childrenData.alias + "_layer");
                  }
                }
              }
            } else if ("3" === level) {
              this.removeLayer(data.alias + "_layer");
              this.removeLayer(data.alias + "_notelayer");
              // 有子菜单的情况
              if (data.children && data.children !== []) {
                for (var i = 0; i < data.children.length; i++) {
                  var childrenData = data.children[i];
                  this.removeLayer(childrenData.alias + "_layer");
                }
              }
            }
            // 删除提示框
            var tipElArr = document.getElementsByClassName(
              "mapboxgl-popup-close-button"
            );
            for (var i = 0; i < tipElArr.length; i++) {
              tipElArr[i].click();
            }
          }
          this.IsJuheScatterLayer = true;
        }
        this.addScatterLegend();
        this.addLineOrPolygonLegend();
      }
      if ("sandian" === this.currentMapType) {
        if (data.checked === true) {
          if ("2" === level) {
            var children = data.children;
            for (var i = 0; i < children.length; i++) {
              this.addScatterLayerFromServer(
                children[i].url,
                children[i].alias,
                children[i].icon,
                children[i].datasetname,
                children[i].sql,
                children[i].geotype
              );
              // 有子菜单的情况
              if (children[i].children && children[i].children !== []) {
                for (var j = 0; j < children[i].children.length; j++) {
                  var childrenData = children[i].children[j];
                  this.addScatterLayerFromServer(
                    childrenData.url,
                    childrenData.alias,
                    childrenData.icon,
                    childrenData.datasetname,
                    childrenData.sql,
                    childrenData.geotype
                  );
                }
              }
            }
          } else if ("3" === level) {
            this.addScatterLayerFromServer(
              data.url,
              data.alias,
              data.icon,
              data.datasetname,
              data.sql,
              data.geotype
            );
            // 有子菜单的情况
            if (data.children && data.children !== []) {
              for (var i = 0; i < data.children.length; i++) {
                var childrenData = data.children[i];
                this.addScatterLayerFromServer(
                  childrenData.url,
                  childrenData.alias,
                  childrenData.icon,
                  childrenData.datasetname,
                  childrenData.sql,
                  childrenData.geotype
                );
              }
            }
          }
        } else {
          if ("2" === level) {
            var children = data.children;
            for (var i = 0; i < children.length; i++) {
              this.removeLayer(children[i].alias + "_layer");
              this.removeLayer(children[i].alias + "_notelayer");
              // 有子菜单的情况
              if (children[i].children && children[i].children !== []) {
                for (var j = 0; j < children[i].children.length; j++) {
                  var childrenData = children[i].children[j];
                  this.removeLayer(childrenData.alias + "_layer");
                }
              }
            }
          } else if ("3" === level) {
            this.removeLayer(data.alias + "_layer");
            this.removeLayer(data.alias + "_notelayer");
            // 有子菜单的情况
            if (data.children && data.children !== []) {
              for (var i = 0; i < data.children.length; i++) {
                var childrenData = data.children[i];
                this.removeLayer(childrenData.alias + "_layer");
              }
            }
          }
          // 删除提示框
          var tipElArr = document.getElementsByClassName(
            "mapboxgl-popup-close-button"
          );
          for (var i = 0; i < tipElArr.length; i++) {
            tipElArr[i].click();
          }
        }
        this.addScatterLegend();
        this.addLineOrPolygonLegend();
      }
      if ("fourColorMap" === this.currentMapType) {
        if (data.checked === true) {
          if ("2" === level) {
            var children = data.children;
            for (var i = 0; i < children.length; i++) {
              this.addFourcolorLayerFromServer(
                children[i].datasetname,
                children[i].alias,
                children[i].sql,
                children[i].url,
                children[i].geotype
              );
            }
          } else if ("3" === level) {
            this.addFourcolorLayerFromServer(
              data.datasetname,
              data.alias,
              data.sql,
              data.url,
              data.geotype
            );
          }
        } else {
          if ("2" === level) {
            var children = data.children;
            for (var i = 0; i < children.length; i++) {
              if ("point" == children[i].geotype) {
                this.removeFourcolorLayer(children[i].alias);
              } else if (
                "line" == children[i].geotype ||
                "polygon" == children[i].geotype
              ) {
                this.removeLayer(children[i].alias + "_layer");
              }
            }
          } else if ("3" === level) {
            if ("point" == data.geotype) {
              this.removeFourcolorLayer(data.alias);
            } else if ("line" == data.geotype || "polygon" == data.geotype) {
              this.removeLayer(data.alias + "_layer");
            }
          }
          // 删除提示框
          var tipElArr = document.getElementsByClassName(
            "mapboxgl-popup-close-button"
          );
          for (var i = 0; i < tipElArr.length; i++) {
            tipElArr[i].click();
          }
        }
        // this.addFourcolorLegend();
        // this.addLineOrPolygonLegend();
      }
      //重设选中的菜单的别名
      this.scatterLayerAliasAry = [];
      var checkedMenu = this.data.allCheckData;
      if (!checkedMenu) {
        return;
      }
      for (var i = 0; i < checkedMenu.length; i++) {
        if (
          "point" === checkedMenu[i].geotype &&
          "" !== checkedMenu[i].icon.trim() && checkedMenu[i].icon !== null
        ) {
          this.scatterLayerAliasAry.push(checkedMenu[i].alias);
        }
        // 有子菜单的情况
        if (checkedMenu[i].children && checkedMenu[i].children !== []) {
          for (var j = 0; j < checkedMenu[i].children.length; j++) {
            var childrenData = checkedMenu[i].children[j];
            if (
              "point" === childrenData.geotype &&
              "" !== childrenData.icon.trim() && childrenData.icon !== null
            ) {
              this.scatterLayerAliasAry.push(childrenData.alias);
            }
          }
        }
      }
    },
    // 切换四色、散点、聚合图层
    currentMapType(currentMapType) {
      this.changeCurrentMapType(currentMapType);
    },
    mapTollBar(data) {
      // 底图切换
      if (
        data.value === "standard-raster" ||
        data.value === "bigdata-raster" ||
        data.value === "ArcGIS-raster" ||
        data.value === "2012YX" ||
        data.value === "2014YX" ||
        data.value === "2017YX" ||
        data.value === "2018YX" ||
        data.value === "2019YX"
      ) {
        this.checkValue(data.value);
      } else {
        document.getElementsByClassName("mapbox-gl-draw_trash")[0].click();
        this.removeLayer("drawLine_layer");
        this.removeLayer("drawPolygon_layer");
        //删除别的提示框
        var tipElArr = document.getElementsByClassName(
          "mapboxgl-popup-close-button"
        );
        for (var i = 0; i < tipElArr.length; i++) {
          tipElArr[i].click();
        }

        this.measureMsg = "";
        if (data.value === "changeMap") {
          // 展示或隐藏切换底图弹框
          if (this.showSwicthMenu === true) {
            this.showSwicthMenu = false;
          } else {
            this.showSwicthMenu = true;
          }
        } else if (data.value === "line_string") {
          this.isSpatialQuery = false;
          // 画线操作
          document.getElementsByClassName("mapbox-gl-draw_line")[0].click();
        } else if (data.value === "polygon") {
          this.isSpatialQuery = false;
          // 画面操作
          document.getElementsByClassName("mapbox-gl-draw_polygon")[0].click();
        } else if (data.value === "spatialQuery") {
          this.isSpatialQuery = true;
          // $(".mapboxgl-ctrl-group").next().children(".mapbox-gl-draw_polygon").trigger("click");
          document.getElementsByClassName("mapbox-gl-draw_polygon")[0].click();
        } else if (data.value === "aroundAnalysis") {
          this.isSpatialQuery = false;
          this.analysisType = data.value;
          // 画点操作
          document.getElementsByClassName("mapbox-gl-draw_point")[0].click();
        } else if (data.value === "nearAnalysis") {
          this.isSpatialQuery = false;
          this.analysisType = data.value;
          // 画点操作
          document.getElementsByClassName("mapbox-gl-draw_point")[0].click();
        } else if (data.value === "clearMapFeature") {
          // // 一键清空
          // this.measureMsg = "";
          // var el = document.getElementsByClassName('mapboxgl-control-container')[0]
          // if (el) {
          //   el.remove()
          // }
          this.levelFeatures = [];
          this.getBlurNames = [];
          this.$emit("clearALL");
          this.data.allCheckData = [];

          // var style = this.map.getStyle();
          // console.log('style: ' + CircularJSON.stringify(style));

          //删除弹框
          var tipElArr = document.getElementsByClassName(
            "mapboxgl-popup-close-button"
          );
          for (var i = 0; i < tipElArr.length; i++) {
            tipElArr[i].click();
          }
          //重设图层
          var tiles = "";
          var basemapSourcesTiles = MAP_CONFIG.basemapSourcesTiles;
          for (var i = 0; i < basemapSourcesTiles.length; i++) {
            if (basemapSourcesTiles[i].name === this.basemapTiles) {
              tiles = basemapSourcesTiles[i].tiles;
              break;
            }
          }
          if ("standard-vectortile" === this.basemapTiles) {
            tiles = standardVectortile;
          }
          if (this.basemapTiles.indexOf("vectortile") >= 0) {
            this.map.setStyle(tiles);
          } else {
            this.map.setStyle({
              version: 8,
              sources: {
                "baselayer-source": {
                  type: "raster",
                  tiles: [tiles],
                  tileSize: 256,
                  rasterSource: "iserver"
                }
              },
              layers: [
                {
                  id: "base-layer",
                  type: "raster",
                  source: "baselayer-source",
                  minzoom: 8.8,
                  maxzoom: 21
                }
              ]
            });
          }
          if ("bigdata-raster" === this.basemapTiles) {
            $("#base-map").css({ "background-color": "#162445" });
          } else {
            $("#base-map").css({ "background-color": "#204f77" });
          }

          var userDistrict = this.userInfo.district;
          if (userDistrict === "3303") {
            this.selectedDistrict = "";
            this.setBoundryAndCover(false);
          } else {
            this.selectedStreet = "";
            this.setBoundryAndCover(true);
          }
        } else if (data.value === "map_init") {
          this.map.setPitch(0);
          this.map.setBearing(0);
          var userDistrict = this.userInfo.district;
          if ("3303" === userDistrict) {
            // 地图居中
            this.map.setZoom(8.8);
            this.map.flyTo({
              center: [120.662287, 27.9]
            });
          } else {
            // this.map.setZoom(10);
            var districtName = this.userInfo.districtName;
            if ("瑞安市" === districtName) {
              this.map.setZoom(10.2);
            } else if ("鹿城区" === districtName) {
              this.map.setZoom(10.8);
            } else if ("龙港市" === districtName) {
              this.map.setZoom(11);
            } else if ("龙湾区" === districtName) {
              this.map.setZoom(11.2);
            } else if ("经开区" === districtName) {
              this.map.setZoom(12);
            } else if ("瓯江口" === districtName) {
              this.map.setZoom(12.2);
            } else if ("永嘉县" === districtName) {
              this.map.setZoom(10.1);
            } else if (
              "瓯海区" === districtName ||
              "洞头区" === districtName ||
              "文成县" === districtName
            ) {
              this.map.setZoom(10.5);
            } else {
              this.map.setZoom(10);
            }
            for (var i = 0; i < getDistrictData.features.length; i++) {
              if (
                districtName === getDistrictData.features[i].properties.NAME
              ) {
                this.map.flyTo({
                  center: getDistrictData.features[i].geometry.coordinates
                });
                break;
              }
            }
          }
          // console.log('地图倾斜角度：' + this.map.getPitch());
          // console.log('地图偏移角度：' + this.map.getBearing());
        } else if (data.value === "split_screen") {
          // 分屏
          if (!this.splitScreen) {
            this.setSplitMap();
            this.$bus.emit("close_rightWrapper", -1);
            // this.$bus.emit('isClose', this.isClose)
          }
        }
      }
    }
  },
  data() {
    return {
      map: null,
      rightMap: null,
      measureMsg: "",
      legendMsg: {},
      legendMsg2: {},
      juheLayer: {},
      fourColorLayer: {},
      isSpatialQuery: false,
      analysisType: "",
      spatialQueryDataset: "",
      spatialQueryUrl: "",
      spatialQueryAlias: "",
      spatialQuerySql: "",
      dataUrl: "",
      getBlurNames: [],
      districtData: {},
      streetData: {},
      showAroundRequestParam: {},
      previousDrawEvents: {},
      currentScatterLayers: [],
      IsJuheScatterLayer: false,
      levelFeatures: [],
      t: null,
      districtFeaturesAry: [],
      streetFeaturesAry: [],
      baseMapDistrictFeatures: [],
      baseMapStreetFeatures: [],
      fourColorAry: ["#FF0000", "#FFA500", "#FFFF00", "#0000FF"], // 红、橙、黄、蓝
      // fourColorAry: ["#FF0000","#FFFF00","#008000","#0000FF"],// 红、黄、绿、蓝
      selectedDistrict: "",
      selectedStreet: "",
      showSwicthMenu: false,
      basemapTiles: "",
      isMapLoaded: false,
      streetJson: {},
      aroundAliasAry: [],
      nearAliasAry: [],
      scatterLayerAliasAry: [],
      lastMapType: "",
      isShwo: false,
      currentCheck: "standard-raster",
      loadedLayer: [],
      popupLayer: "",
      isLoadBoundryData: false,
      isClose: false,
      rightMapType: "",
      fourColorLevel1: [],
      fourColorLevel2: [],
      fourColorLevel3: [],
      fourColorLevel4: [],
      mapQueryTreeList: [],
      scaleControl: {},
      currentSearchFeature: "",
      searchFeatureCount: 1,
      nearestDistance: 0,
      nearAnalysisList: [],
      areaQueryCenterCoordinates: [],
      currentTowns: [],
      sliderValue: 0.8,
      isCoverToolbarShow: false
    };
  },
  mounted() {
    console.log("初始化");
    this.dataUrl = MAP_CONFIG.dataurl;
    this.basemapTiles = MAP_CONFIG.basemapTiles;
    this.createBaseMapAndLayer();

    var me = this;
    window.showInfo = function() {
      me.$emit("showInfo", true);
    };
    window.showInfoCamera = function() {
      me.$emit("showInfo2", true);
    };
    window.showAround = function() {
      // 画缓冲区
      var circle = me.createCircle(
        me.showAroundRequestParam.center,
        me.showAroundRequestParam.distance
      );
      // 查询
      me.map.setZoom(14);
      me.map.flyTo({
        center: me.showAroundRequestParam.center
      });
      me.$emit("clearAround");
      var queryCoordinates = circle.geometry.coordinates;
      me.queryAround(
        circle,
        me.showAroundRequestParam.center,
        queryCoordinates,
        1000
      );
      // 弹框切换到周边分析
      me.$parent.$refs.around.tabClick(0);
    };
    window.showNearby = function() {
      //平移
      me.map.flyTo({
        center: me.areaQueryCenterCoordinates
      });
      //清除周边、就近分析图层
      for (var i = 0; i < me.aroundAliasAry.length; i++) {
        if (me.map.getLayer(me.aroundAliasAry[i] + "_layer")) {
          me.map.removeLayer(me.aroundAliasAry[i] + "_layer");
        }
      }
      for (var i = 0; i < me.nearAliasAry.length; i++) {
        if (me.map.getLayer(me.nearAliasAry[i] + "_layer")) {
          me.map.removeLayer(me.nearAliasAry[i] + "_layer");
        }
        if (me.map.getLayer(me.nearAliasAry[i] + "_gaoliang_layer")) {
          me.map.removeLayer(me.nearAliasAry[i] + "_gaoliang_layer");
        }
      }
      if (me.map.getLayer("showAround_layer")) {
        me.map.removeLayer("showAround_layer");
      }
      //展示就近分析框
      me.$parent.$refs.around.showAnalyse();
      //查询
      var userDistrict = me.userInfo.district;
      if (me.nearAnalysisList === [] || me.nearAnalysisList.length === 0) {
        getNearAnalysisList().then(res => {
          if (res === null) {
            return;
          }
          // console.log('nearAnalysisList: ' + CircularJSON.stringify(res));
          me.nearAnalysisList = res;
          me.queryNearby(me.areaQueryCenterCoordinates, res, userDistrict, 3);
        });
      } else {
        me.queryNearby(
          me.areaQueryCenterCoordinates,
          me.nearAnalysisList,
          userDistrict,
          3
        );
      }
    };
  },
  methods: {
    longitudeSearch(val) {
      // console.log('longitudeSearch: ' + val);
      var coordinatesAry = val.split(",");
      //添加点
      var dataJson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { NAME: "搜索经纬度的点" },
            geometry: { type: "Point", coordinates: coordinatesAry },
            id: "0001"
          }
        ]
      };
      if (!this.map.getSource("searchObj_source")) {
        this.map.addSource("searchObj_source", {
          type: "geojson",
          data: dataJson
        });
      } else {
        this.map.getSource("searchObj_source").setData(dataJson);
      }
      if (this.map.getLayer("searchObj_layer")) {
        this.map.removeLayer("searchObj_layer");
      }
      this.map.addLayer(
        {
          id: "searchObj_layer",
          type: "symbol",
          source: "searchObj_source",
          layout: {
            "icon-image": "searchObj_Point",
            "icon-size": 0.8,
            "icon-allow-overlap": true
          }
        },
        "wz_boundary_layer"
      );
      //移动地图
      this.map.flyTo({
        center: coordinatesAry,
        zoom: 12,
        speed: 1.6
      });
    },
    changeSliderValue(val) {
      // console.log('val: ' + val)
      this.sliderValue = val;
      var userDistrict = this.userInfo.district;
      if (userDistrict === "3303") {
        this.map.setPaintProperty(
          "basemapDistrict_layer",
          "fill-color",
          "rgba(147,162,193," + val + ")"
        );
      } else {
        this.map.setPaintProperty(
          "basemapDistrict_layer",
          "fill-color",
          "rgba(32,79,119," + val + ")"
        );
        if (this.map.getLayer("basemapStreet_layer")) {
          this.map.setPaintProperty(
            "basemapStreet_layer",
            "fill-color",
            "rgba(147,162,193," + val + ")"
          );
        }
      }
    },
    ...mapActions("map", ["setSplitScreen"]),
    ...mapActions("map", ["SetMapLoaded"]),
    addScatterLegend() {
      var checkedMenu = this.data.allCheckData;
      if (!checkedMenu) {
        this.legendMsg = { legendAry: [] };
        return;
      }
      var legendAry = [];
      for (var i = 0; i < checkedMenu.length; i++) {
        if (
          "point" === checkedMenu[i].geotype &&
          "" !== checkedMenu[i].icon.trim() && checkedMenu[i].icon !== null
        ) {
          legendAry.push({
            icon: checkedMenu[i].icon,
            des: checkedMenu[i].name
          });
        }
        // 有子菜单的情况
        if (checkedMenu[i].children && checkedMenu[i].children !== []) {
          for (var j = 0; j < checkedMenu[i].children.length; j++) {
            var childrenData = checkedMenu[i].children[j];
            if (
              "point" === childrenData.geotype &&
              "" !== childrenData.icon.trim() && childrenData.icon !== null
            ) {
              legendAry.push({
                icon: childrenData.icon,
                des: childrenData.name
              });
            }
          }
        }
      }
      this.legendMsg = { legendAry: legendAry };
    },
    addFourcolorLegend() {
      var legendAry = [];
      legendAry.push({
        icon: "../../../static/image/level1.png",
        des: "一级(" + this.fourColorLevel1.length + ")"
      });
      legendAry.push({
        icon: "../../../static/image/level2.png",
        des: "二级(" + this.fourColorLevel2.length + ")"
      });
      legendAry.push({
        icon: "../../../static/image/level3.png",
        des: "三级(" + this.fourColorLevel3.length + ")"
      });
      legendAry.push({
        icon: "../../../static/image/level4.png",
        des: "四级(" + this.fourColorLevel4.length + ")"
      });
      this.legendMsg = { legendAry: legendAry };
    },
    addLineOrPolygonLegend() {
      var checkedMenu = this.data.allCheckData;
      if (!checkedMenu) {
        this.legendMsg2 = { legendAry: [] };
        return;
      }
      var legendAry = [];
      for (var i = 0; i < checkedMenu.length; i++) {
        if (
          ("line" === checkedMenu[i].geotype ||
            "polygon" === checkedMenu[i].geotype) &&
          "" !== checkedMenu[i].icon.trim() && checkedMenu[i].icon !== null
        ) {
          legendAry.push({
            icon: checkedMenu[i].icon,
            des: checkedMenu[i].name
          });
        }
        // 有子菜单的情况
        if (checkedMenu[i].children && checkedMenu[i].children !== []) {
          for (var j = 0; j < checkedMenu[i].children.length; j++) {
            var childrenData = checkedMenu[i].children[j];
            if (
              ("line" === childrenData.geotype ||
                "polygon" === childrenData.geotype) &&
              "" !== childrenData.icon.trim() && childrenData.icon !== null
            ) {
              legendAry.push({
                icon: childrenData.icon,
                des: childrenData.name
              });
            }
          }
        }
      }
      this.legendMsg2 = { legendAry: legendAry };
    },
    changeCurrentMapType(currentMapType) {
      this.levelFeatures = [];
      this.getBlurNames = [];
      this.measureMsg = "";
      // 需重新加载图层
      if (
        "fourColorMap" === currentMapType ||
        "fourColorMap" === this.lastMapType
      ) {
        this.fourColorLevel1 = [];
        this.fourColorLevel2 = [];
        this.fourColorLevel3 = [];
        this.fourColorLevel4 = [];
        this.map.remove();
        this.legendMsg = { legendAry: [] };
        this.legendMsg2 = { legendAry: [] };
        this.basemapTiles = MAP_CONFIG.basemapTiles;
        this.createBaseMapAndLayer();
      }
      // 无需重新加载图层
      else {
        var zoomLevel = this.map.getZoom();
        if (zoomLevel > 14) {
          this.lastMapType = currentMapType;
          return;
        }
        // "聚合"——>"散点"
        if ("sandian" === currentMapType) {
          // 6-11级，去除区县地图
          if (zoomLevel && zoomLevel <= 11) {
            this.removeLayer("district_layer");
          }
          // 12-14级，去除乡镇地图
          else if (zoomLevel && zoomLevel > 11 && zoomLevel <= 14) {
            this.removeLayer("street_layer");
          }
          // 添加散点图
          var checkedMenu = this.data.allCheckData;
          if (!checkedMenu) {
            return;
          }
          for (var i = 0; i < checkedMenu.length; i++) {
            this.addScatterLayerFromServer(
              checkedMenu[i].url,
              checkedMenu[i].alias,
              checkedMenu[i].icon,
              checkedMenu[i].datasetname,
              checkedMenu[i].sql,
              checkedMenu[i].geotype
            );
            // 有子菜单的情况
            if (checkedMenu[i].children && checkedMenu[i].children !== []) {
              for (var j = 0; j < checkedMenu[i].children.length; j++) {
                var childrenData = checkedMenu[i].children[j];
                this.addScatterLayerFromServer(
                  childrenData.url,
                  childrenData.alias,
                  childrenData.icon,
                  childrenData.datasetname,
                  childrenData.sql,
                  childrenData.geotype
                );
              }
            }
          }
        }
        // "散点"——>"聚合"
        else if ("juhe" === currentMapType) {
          // 移除散点图
          for (var i = 0; i < this.scatterLayerAliasAry.length; i++) {
            this.removeLayer(this.scatterLayerAliasAry[i] + "_layer");
          }
          // 6-11级，加载区县地图
          if (zoomLevel && zoomLevel <= 11) {
            this.addJuheLayer("district_layer");
            this.IsJuheScatterLayer = false;
          }
          // 12-14级，加载乡镇地图
          else if (zoomLevel && zoomLevel > 11 && zoomLevel <= 14) {
            this.addJuheLayer("street_layer");
            this.IsJuheScatterLayer = false;
          }
        }
        this.lastMapType = currentMapType;
      }
    },
    switchMap(x) {
      var basemapSourcesTiles = MAP_CONFIG.basemapSourcesTiles;
      var url = this.setMapList(basemapSourcesTiles, x);
      // if (this.rightMap.getLayer(x)) {
      //   this.rightMap.removeLayer(x);
      //   this.rightMap.removeSource(x);
      // }
      if (x === "closeMap") {
        this.isShwo = false;
        document.getElementById("base-map").style.width = "100%";
        this.map.resize();
      } else {
        this.switchLayer(url, x);
      }
    },
    setMapList(data, type) {
      var url = "";
      data.forEach(val => {
        if (val.name === type) {
          url = val.tiles;
        }
      });
      return url;
    },
    switchLayer(url, x) {
      this.rightMapType = x;
      if (x === "globe_3D") {
        // if (this.rightMap.getLayer("2012YX")) {
        //   this.rightMap.removeLayer("2012YX");
        //   this.rightMap.removeSource("2012YX");
        //   this.rightMap.remove();
        // }
        // 天地图
        var image_Source = new Cesium.WebMapTileServiceImageryProvider({
          url:
            "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=856886d7882dbcad0f73442fb277db3c",
          layer: "vec",
          style: "default",
          format: "tiles",
          tileMatrixSetID: "w",
          credit: new Cesium.Credit("天地图全球影像服务"),
          subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
          maximumLevel: 18,
          show: false
        });
        // 创建三维球
        this.rightMap = new Cesium.Viewer("rightMap", {
          imageryProvider: image_Source
        });
        // this.rightMap.imageryLayers.removeAll();//移除所有底图
        $(".cesium-widget-credits").hide(); //去除logo（jquery写法，也可以按类名找到元素隐藏即可）
        // 添加SuperMap三维白模以及
        var superMap3D =
          "http://10.36.234.83:8090/iserver/services/3D-dsjmap/rest/realspace";
        var superMap3Dbaimo =
          "http://10.36.234.83:8090/iserver/services/3D-RES_PY_LC_Z1-SW_BM/rest/realspace";
        var scene = this.rightMap.scene;
        scene.open(superMap3D);
        scene.open(superMap3Dbaimo);
        this.set3DView();
        // var __this = this;
        // Cesium.when.all([promise1, promise2], function(layers) {
        //   // 设置视角
        //   __this.set3DView();
        // });
      } else {
        document.getElementById("rightMap").innerHTML = "";
        this.rightMap = new mapboxgl.Map({
          container: "rightMap",
          style: {
            version: 8,
            sources: {
              "rightlayer-source": {
                type: "raster",
                tiles: [url],
                tileSize: 256,
                rasterSource: "iserver"
              }
            },
            layers: [
              {
                id: "right-layer",
                type: "raster",
                source: "rightlayer-source",
                minzoom: 8,
                maxzoom: 19
              }
            ]
          },
          crs: "EPSG:4490",
          zoom: 8.8,
          minZoom: 8.8,
          maxZoom: 18
        });
        this.rightMap.setCenter(this.map.getCenter());
        this.rightMap.setZoom(this.map.getZoom());
        // this.setCenter(this.map, this.rightMap);
        this.set2DView();
      }
      this.setRightMap();
    },
    getCurrentExtent() {
      var extent = {};
      var scene = this.rightMap.scene;
      var ellipsoid = scene.globe.ellipsoid;
      var canvas = scene.canvas;
      var car3_lt = this.rightMap.camera.pickEllipsoid(
        new Cesium.Cartesian2(0, 0),
        ellipsoid
      );
      var car3_rb = this.rightMap.camera.pickEllipsoid(
        new Cesium.Cartesian2(canvas.width, canvas.height),
        ellipsoid
      );
      // 当canvas左上角和右下角全部在椭球体上
      if (car3_lt && car3_rb) {
        var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
        var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
        extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
        extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
        extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
        extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
      } else if (!car3_lt && car3_rb) {
        // 当canvas左上角不在但右下角在椭球体上
        var car3_lt2 = null;
        var yIndex = 0;
        do {
          // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
          yIndex <= canvas.height ? (yIndex += 10) : canvas.height;
          car3_lt2 = this.rightMap.camera.pickEllipsoid(
            new Cesium.Cartesian2(0, yIndex),
            ellipsoid
          );
        } while (!car3_lt2);
        var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
        var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
        extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
        extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
        extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
        extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
      }
      return extent;
    },
    set3DView(e) {
      // 设置三维视角
      var thismapbounds = this.map.getBounds();
      var west = thismapbounds._sw.lng;
      var south = thismapbounds._sw.lat;
      var east = thismapbounds._ne.lng;
      var north = thismapbounds._ne.lat;
      var rec = new Cesium.Rectangle.fromDegrees(west, south, east, north);
      var pitch = -90;
      if (e) {
        pitch = this.map.getPitch() - 90;
      }
      this.rightMap.camera.setView({
        destination: rec,
        orientation: {
          heading: Cesium.Math.toRadians(0, 0), // // 指向
          pitch: Cesium.Math.toRadians(pitch), // 视角
          roll: 0
        }
      });
    },
    setRightMap() {
      var __this = this;
      // 左侧操作右侧
      // 平移
      this.map.on("drag", function(e) {
        if (__this.rightMapType === "globe_3D") {
          if (e.originalEvent) {
            __this.set3DView(e);
          }
        } else {
          __this.rightMap.setCenter(__this.map.getCenter());
          __this.rightMap.setZoom(__this.map.getZoom());
        }
      });
      // 缩放
      this.map.on("zoom", function(e) {
        if (__this.rightMapType === "globe_3D") {
          if (e.originalEvent) {
            __this.set3DView(e);
          }
        } else {
          __this.rightMap.setCenter(__this.map.getCenter());
          __this.rightMap.setZoom(__this.map.getZoom());
        }
      });
      // 调整视角
      this.map.on("pitch", function(e) {
        if (__this.rightMapType === "globe_3D") {
          __this.set3DView(e);
        } else {
          __this.rightMap.setPitch(__this.map.getPitch());
        }
      });

      // 右侧操作左侧
      if (this.rightMapType === "globe_3D") {
        __this.rightMap.screenSpaceEventHandler.setInputAction(function() {
          var tilesToRender =
            __this.rightMap.scene.globe._surface._tilesToRender;
          var leftzoom;
          if (tilesToRender.length > 0) {
            leftzoom = tilesToRender[0]._level;
            console.log(leftzoom);
          }
          var extent = __this.getCurrentExtent();
          var box = [
            [extent.xmin, extent.ymin],
            [extent.xmax, extent.ymax]
          ];
          __this.map.fitBounds(box);
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        var handler = new Cesium.ScreenSpaceEventHandler(
          __this.rightMap.scene.canvas
        );
        handler.setInputAction(function(movement) {
          var extent = __this.getCurrentExtent();
          var box = [
            [extent.xmin, extent.ymin],
            [extent.xmax, extent.ymax]
          ];
          __this.map.fitBounds(box);
        }, Cesium.ScreenSpaceEventType.WHEEL);

        // var handler = new Cesium.ScreenSpaceEventHandler(__this.rightMap.scene.canvas);
        // handler.setInputAction(function(movement) {
        //   var pitch1 = Cesium.Math.toDegrees(__this.rightMap.camera.pitch).toFixed(2);
        //   console.log(pitch1)
        //   if(pitch1 > -60) {
        //     __this.map.setPitch(60-(-pitch1));
        //   }
        // }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

        var handler = new Cesium.ScreenSpaceEventHandler(
          __this.rightMap.scene.canvas
        );
        handler.setInputAction(function(movement) {
          // var pitch1 = Cesium.Math.toDegrees(__this.rightMap.camera.pitch).toFixed(2);
          // console.log(pitch1)
          // if(pitch1 > -60) {
          //   __this.map.setPitch(60-(-pitch1));
          // }
        }, Cesium.ScreenSpaceEventType.MIDDLE_UP);

        // __this.rightMap.camera.changed.addEventListener(function() {
        //     var tilesToRender = __this.rightMap.scene.globe._surface._tilesToRender;
        //     var leftzoom;
        //     if(tilesToRender.length > 0) {
        //       leftzoom = tilesToRender[0]._level;
        //     }
        //     var extent = __this.rightMap.camera.computeViewRectangle();
        //     var west = (extent.west / Math.PI) * 180;
        //     var north = (extent.north / Math.PI) * 180;
        //     var east = (extent.east / Math.PI) * 180;
        //     var south = (extent.south / Math.PI) * 180;
        //     var box = [[west, south], [east, north]];
        //     __this.map.fitBounds(box);
        // });
      } else {
        this.rightMap.on("drag", function(e) {
          __this.map.setCenter(__this.rightMap.getCenter());
          __this.map.setZoom(__this.rightMap.getZoom());
        });
        this.rightMap.on("zoom", function(e) {
          __this.map.setCenter(__this.rightMap.getCenter());
          __this.map.setZoom(__this.rightMap.getZoom());
        });
      }
    },
    setSplitMap() {
      this.setSplitScreen(true);
      this.isShwo = true;
      document.getElementById("base-map").style.width = "50%";
      this.map.resize();

      var basemapSourcesTiles = MAP_CONFIG.basemapSourcesTiles;
      var tiles = {};
      for (var i = 0; i < basemapSourcesTiles.length; i++) {
        if (basemapSourcesTiles[i].name === "2012YX") {
          tiles = basemapSourcesTiles[i].tiles;
          break;
        }
      }
      setTimeout(() => {
        this.rightMap = new mapboxgl.Map({
          container: "rightMap",
          style: {
            version: 8,
            sources: {
              "baselayer-source": {
                type: "raster",
                tiles: [tiles],
                tileSize: 256,
                rasterSource: "iserver"
              }
            },
            layers: [
              {
                id: "base-layer",
                type: "raster",
                source: "baselayer-source",
                minzoom: 8.8,
                maxzoom: 19
              }
            ]
          },
          crs: "EPSG:4490",
          center: [120.662287, 27.9],
          zoom: 8.8,
          minZoom: 8.8,
          maxZoom: 18
        });
        this.rightMap.setCenter(this.map.getCenter());
        this.rightMap.setZoom(this.map.getZoom());
        this.rightMapType = "2012YX";
        this.setRightMap();
      }, 0);
    },
    set2DView() {
      var __this = this;
      this.map.on("dragend", function(e) {
        __this.rightMap.setCenter(__this.map.getCenter());
        __this.rightMap.setZoom(__this.map.getZoom());
      });
      this.map.on("zoomend", function(e) {
        __this.rightMap.setCenter(__this.map.getCenter());
        __this.rightMap.setZoom(__this.map.getZoom());
      });
      this.rightMap.on("dragend", function(e) {
        __this.map.setCenter(__this.rightMap.getCenter());
        __this.map.setZoom(__this.rightMap.getZoom());
      });
      this.rightMap.on("zoomend", function(e) {
        __this.map.setCenter(__this.rightMap.getCenter());
        __this.map.setZoom(__this.rightMap.getZoom());
      });
    },
    closeLegend() {
      this.$refs.legend.hide();
      this.$refs.legend2.hide();
    },
    smallLegend() {
      this.$refs.legend.small();
      this.$refs.legend2.small();
    },
    hideBasemapMenu(data) {
      if (data) {
        this.showSwicthMenu = false;
      }
    },
    checkValue(data) {
      this.basemapTiles = data;
      var tiles = "";
      var basemapSourcesTiles = MAP_CONFIG.basemapSourcesTiles;
      for (var i = 0; i < basemapSourcesTiles.length; i++) {
        if (basemapSourcesTiles[i].name === this.basemapTiles) {
          tiles = basemapSourcesTiles[i].tiles;
          break;
        }
      }
      //矢量
      if (this.basemapTiles.indexOf("vectortile") >= 0) {
        this.map.setStyle(tiles);
      }
      //栅格
      else {
        if ("2019YX" === this.basemapTiles) {
          var zjTiles = "";
          for (var i = 0; i < basemapSourcesTiles.length; i++) {
            if (basemapSourcesTiles[i].name === "2019YXZJ") {
              zjTiles = basemapSourcesTiles[i].tiles;
              break;
            }
          }
          this.map.setStyle({
            version: 8,
            sources: {
              "baselayer-source": {
                type: "raster",
                tiles: [tiles],
                tileSize: 256,
                rasterSource: "iserver"
              }
            },
            layers: [
              {
                id: "base-layer",
                type: "raster",
                source: "baselayer-source",
                minzoom: 8.8,
                maxzoom: 21
              }
            ]
          });

          if (this.map.getLayer("2019YXZJ_layer")) {
            this.map.removeLayer("2019YXZJ_layer");
          }
          if (this.map.getSource("2019YXZJ_source")) {
            this.map.removeSource("2019YXZJ_source");
          }
          this.map.addSource("2019YXZJ_source", {
            type: "raster",
            tiles: [zjTiles],
            tileSize: 256,
            rasterSource: "iserver"
          });
          this.map.addLayer({
            id: "2019YXZJ_layer",
            type: "raster",
            source: "2019YXZJ_source"
          });
        } else {
          if (this.map.getLayer("2019YXZJ_layer")) {
            this.map.removeLayer("2019YXZJ_layer");
          }
          this.map.setStyle({
            version: 8,
            sources: {
              "baselayer-source": {
                type: "raster",
                tiles: [tiles],
                tileSize: 256,
                rasterSource: "iserver"
              }
            },
            layers: [
              {
                id: "base-layer",
                type: "raster",
                source: "baselayer-source",
                minzoom: 8.8,
                maxzoom: 21
              }
            ]
          });
        }

        if (
          "2012YX" === this.basemapTiles ||
          "2014YX" === this.basemapTiles ||
          "2017YX" === this.basemapTiles ||
          "2018YX" === this.basemapTiles ||
          "2019YX" === this.basemapTiles
        ) {
          this.map.setMaxZoom(18);
        } else if ("standard-raster" === this.basemapTiles) {
          this.map.setMaxZoom(19);
        } else if ("bigdata-raster" === this.basemapTiles) {
          this.map.setMaxZoom(18);
        }
      }
      //加载边界线
      var WWW_MAP = document.location.protocol + "//" + window.location.host;
      var userDistrict = this.userInfo.district;
      if (userDistrict === "3303") {
        this.setBoundryAndCover(false);
      } else {
        this.setBoundryAndCover(true);
      }
      //设置比例尺
      this.map.removeControl(this.scaleControl);
      this.scaleControl = new mapboxgl.ScaleControl({});
      this.map.addControl(this.scaleControl);
      //底图加载完毕
      this.isMapLoaded = true;
      //加载图层
      this.addMenuData();
    },
    addMenuData() {
      var __this = this;
      this.t = setInterval(() => {
        if (__this.isMapLoaded) {
          clearInterval(__this.t);

          if ("juhe" === __this.currentMapType) {
            // 获取左侧所有选中的三级菜单
            var checkedMenu = __this.data.allCheckData;
            // console.log("checkedMenu: " + JSON.stringify(checkedMenu));
            if (!checkedMenu) {
              return;
            }
            var datasetnames = [];
            for (var i = 0; i < checkedMenu.length; i++) {
              if ("point" === checkedMenu[i].geotype) {
                __this.currentScatterLayers.push(
                  checkedMenu[i].alias + "_layer"
                );
                if (datasetnames.indexOf(checkedMenu[i].datasetname) < 0) {
                  datasetnames.push(checkedMenu[i].datasetname);
                }
              }
              if (
                "line" === checkedMenu[i].geotype ||
                "polygon" === checkedMenu[i].geotype
              ) {
                __this.addLineOrPolygonFromServer(
                  checkedMenu[i].url,
                  checkedMenu[i].alias,
                  checkedMenu[i].geotype
                );
              }
              // 有子菜单的情况
              if (checkedMenu[i].children && checkedMenu[i].children !== []) {
                for (var j = 0; j < checkedMenu[i].children.length; j++) {
                  var childrenData = checkedMenu[i].children[j];
                  if (
                    childrenData.geotype === "line" ||
                    childrenData.geotype === "polygon"
                  ) {
                    __this.addLineOrPolygonFromServer(
                      childrenData.url,
                      childrenData.alias,
                      childrenData.geotype
                    );
                  }
                }
              }
            }
            // 根据当前地图的级别，选中添加对应的图层
            var zoomLevel = __this.map.getZoom();
            // 6-11级，显示区县地图
            if (zoomLevel && zoomLevel <= 11) {
              __this.addJuheLayer("district_layer");
              __this.IsJuheScatterLayer = false;
            }
            // 12-14级，显示乡镇地图
            else if (zoomLevel && zoomLevel > 11 && zoomLevel <= 14) {
              __this.addJuheLayer("street_layer");
              __this.IsJuheScatterLayer = false;
            }
            // 14级以上，显示散点图、散点图图例
            else {
              var checkedMenu = __this.data.allCheckData;
              if (!checkedMenu) {
                return;
              }
              for (var i = 0; i < checkedMenu.length; i++) {
                __this.addScatterLayerFromServer(
                  checkedMenu[i].url,
                  checkedMenu[i].alias,
                  checkedMenu[i].icon,
                  checkedMenu[i].datasetname,
                  checkedMenu[i].sql,
                  checkedMenu[i].geotype
                );
                // 有子菜单的情况
                if (checkedMenu[i].children && checkedMenu[i].children !== []) {
                  for (var j = 0; j < checkedMenu[i].children.length; j++) {
                    var childrenData = checkedMenu[i].children[j];
                    __this.addScatterLayerFromServer(
                      childrenData.url,
                      childrenData.alias,
                      childrenData.icon,
                      childrenData.datasetname,
                      childrenData.sql,
                      childrenData.geotype
                    );
                  }
                }
              }
            }
            __this.addScatterLegend();
            __this.addLineOrPolygonLegend();
            __this.IsJuheScatterLayer = true;
          }
          if ("sandian" === __this.currentMapType) {
            var checkedMenu = __this.data.allCheckData;
            if (!checkedMenu) {
              return;
            }
            for (var i = 0; i < checkedMenu.length; i++) {
              __this.addScatterLayerFromServer(
                checkedMenu[i].url,
                checkedMenu[i].alias,
                checkedMenu[i].icon,
                checkedMenu[i].datasetname,
                checkedMenu[i].sql,
                checkedMenu[i].geotype
              );
              if (checkedMenu[i].children && checkedMenu[i].children !== []) {
                for (var j = 0; j < checkedMenu[i].children.length; j++) {
                  var childrenData = checkedMenu[i].children[j];
                  __this.addScatterLayerFromServer(
                    childrenData.url,
                    childrenData.alias,
                    childrenData.icon,
                    childrenData.datasetname,
                    childrenData.sql,
                    childrenData.geotype
                  );
                }
              }
            }
            __this.addScatterLegend();
            __this.addLineOrPolygonLegend();
          }
          if ("fourColorMap" === __this.currentMapType) {
            __this.fourColorLevel1 = [];
            __this.fourColorLevel2 = [];
            __this.fourColorLevel3 = [];
            __this.fourColorLevel4 = [];
            var checkedMenu = __this.data.allCheckData;
            if (!checkedMenu) {
              return;
            }
            for (var i = 0; i < checkedMenu.length; i++) {
              __this.addFourcolorLayerFromServer(
                checkedMenu[i].datasetname,
                checkedMenu[i].alias,
                checkedMenu[i].sql,
                checkedMenu[i].url,
                checkedMenu[i].geotype
              );
            }
          }
        }
      }, 200);
    },
    setStreetLayer(selectedStreet, userDistrict, isClick) {
      if (selectedStreet === "") {
        this.removeLayer("basemapStreet_layer");
        this.removeLayer("streetBoundary_layer");
        return;
      }

      if (isClick === true) {
        // 缩放到12级
        this.map.setZoom(12);
        // 计算中心点，并移动
        var centerAry = [];
        for (var i = 0; i < wenzhou_xz.features.length; i++) {
          if (selectedStreet === wenzhou_xz.features[i].properties.name) {
            centerAry[0] = wenzhou_xz.features[i].properties.x;
            centerAry[1] = wenzhou_xz.features[i].properties.y;
            this.map.flyTo({
              center: centerAry
            });
            break;
          }
        }
      }
      // 聚合图、散点图，给其他区县颜色加深
      if ("juhe" === this.currentMapType || "sandian" === this.currentMapType) {
        var otherStreetAry = [];
        var currentStreetAry = [];
        for (var i = 0; i < this.baseMapStreetFeatures.length; i++) {
          if (
            selectedStreet !== this.baseMapStreetFeatures[i].properties.TOWN
          ) {
            otherStreetAry.push(this.baseMapStreetFeatures[i]);
          } else {
            currentStreetAry.push(this.baseMapStreetFeatures[i]);
          }
        }
        if (!this.map.getSource("basemapStreet_source")) {
          this.map.addSource("basemapStreet_source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: otherStreetAry
            }
          });
        } else {
          this.map.getSource("basemapStreet_source").setData({
            type: "FeatureCollection",
            features: otherStreetAry
          });
        }
        this.removeLayer("basemapStreet_layer");
        this.map.addLayer({
          id: "basemapStreet_layer",
          type: "fill",
          source: "basemapStreet_source",
          paint: {
            "fill-color": "rgba(147,162,193," + this.sliderValue + ")",
            "fill-outline-color": "rgba(240, 240, 0, 0.3)"
          }
        });
        if (!this.map.getSource("streetBoundary_source")) {
          this.map.addSource("streetBoundary_source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: currentStreetAry
            }
          });
        } else {
          this.map.getSource("streetBoundary_source").setData({
            type: "FeatureCollection",
            features: currentStreetAry
          });
        }
        this.removeLayer("streetBoundary_layer");
        this.map.addLayer({
          id: "streetBoundary_layer",
          type: "line",
          source: "streetBoundary_source",
          paint: {
            "line-color": "rgba(0,169,230,0.5)",
            "line-width": 4
          }
        });
      }
    },
    setDistrictLayer(selectedDistrict, isClick) {
      if (selectedDistrict === "") {
        this.removeLayer("basemapDistrict_layer");
        this.removeLayer("districtBoundary_layer");
        this.isCoverToolbarShow = false;
        return;
      }
      if (isClick === true) {
        if ("瑞安市" === selectedDistrict) {
          this.map.setZoom(10.2);
        } else if ("鹿城区" === selectedDistrict) {
          this.map.setZoom(10.8);
        } else if ("龙港市" === selectedDistrict) {
          this.map.setZoom(11);
        } else if ("龙湾区" === selectedDistrict) {
          this.map.setZoom(11.2);
        } else if ("经开区" === selectedDistrict) {
          this.map.setZoom(12);
        } else if ("瓯江口" === selectedDistrict) {
          this.map.setZoom(12.2);
        } else if ("永嘉县" === selectedDistrict) {
          this.map.setZoom(10.1);
        } else if (
          "瓯海区" === selectedDistrict ||
          "洞头区" === selectedDistrict ||
          "文成县" === selectedDistrict
        ) {
          this.map.setZoom(10.5);
        } else {
          this.map.setZoom(10);
        }
        // 地图移动到对应区县的中心点
        for (var i = 0; i < getDistrictData.features.length; i++) {
          if (
            selectedDistrict === getDistrictData.features[i].properties.NAME
          ) {
            this.map.flyTo({
              center: getDistrictData.features[i].geometry.coordinates
            });
            break;
          }
        }
        this.isCoverToolbarShow = true;
      }

      // 散点图，给其他区县颜色加深
      if ("sandian" === this.currentMapType || "juhe" === this.currentMapType) {
        var otherDistrictAry = [];
        var currentDistrictAry = [];
        for (var i = 0; i < this.baseMapDistrictFeatures.length; i++) {
          if (
            selectedDistrict !==
            this.baseMapDistrictFeatures[i].properties.COUNTRY
          ) {
            otherDistrictAry.push(this.baseMapDistrictFeatures[i]);
          } else {
            currentDistrictAry.push(this.baseMapDistrictFeatures[i]);
          }
        }
        if (!this.map.getSource("basemapDistrict_source")) {
          this.map.addSource("basemapDistrict_source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: otherDistrictAry
            }
          });
        } else {
          this.map.getSource("basemapDistrict_source").setData({
            type: "FeatureCollection",
            features: otherDistrictAry
          });
        }
        this.removeLayer("basemapDistrict_layer");
        this.map.addLayer({
          id: "basemapDistrict_layer",
          type: "fill",
          source: "basemapDistrict_source",
          paint: {
            "fill-color": "rgba(147,162,193," + this.sliderValue + ")",
            "fill-outline-color": "rgba(240, 240, 0, 0.3)"
          }
        });
        if (!this.map.getSource("districtBoundary_source")) {
          this.map.addSource("districtBoundary_source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: currentDistrictAry
            }
          });
        } else {
          this.map.getSource("districtBoundary_source").setData({
            type: "FeatureCollection",
            features: currentDistrictAry
          });
        }
        this.removeLayer("districtBoundary_layer");
        this.map.addLayer({
          id: "districtBoundary_layer",
          type: "line",
          source: "districtBoundary_source",
          paint: {
            "line-color": "rgba(0,169,230,0.5)",
            "line-width": 4
          }
        });
      }
    },
    createFourColorLayer(layerFeatures, alias) {
      this.clearHeatPoints();
      this.clearFourColorLayer();
      var phvals = layerFeatures.features.map(f => f.properties.SMID);
      var min = Math.min(...phvals);
      var max = Math.max(...phvals);
      var range = max - min;
      var start2 = Math.round(min + (1 / 4) * range);
      var start3 = Math.round(min + (1 / 2) * range);
      var start4 = Math.round(min + (3 / 4) * range);

      var styleGroupsAry = [
        {
          start: min,
          end: start2,
          style: {
            color: "#00FF00"
          }
        },
        {
          start: start2,
          end: start3,
          style: {
            color: "#FFFF00"
          }
        },
        {
          start: start3,
          end: start4,
          style: {
            color: "#FFA500"
          }
        },
        {
          start: start4,
          end: max + 1,
          style: {
            color: "#FF0000"
          }
        }
      ];
      if (!this.map.getSource(alias + "_source")) {
        this.map.addSource(alias + "_source", {
          type: "geojson",
          data: layerFeatures
        });
      } else {
        this.map.getSource(alias + "_source").setData(layerFeatures);
      }
      this.fourColorLayer.alias = alias;
      this.fourColorLayer.addFeatures(layerFeatures);
      this.fourColorLayer.styleGroups = styleGroupsAry;
      this.map.addLayer(this.fourColorLayer);
    },
    clearFourColorLayer() {
      if (this.map.getLayer("fourColorLayer")) {
        this.map.removeLayer("fourColorLayer");
      }
    },
    createPloygonQueryLayer(queryPolygonGeometry, datasetname, dataUrl, alias) {
      this.clearPloygonQueryLayer();
      var geometryParam = new SuperMap.GetFeaturesByGeometryParameters({
        datasetNames: [datasetname],
        geometry: queryPolygonGeometry,
        spatialQueryMode: "INTERSECT",
        fromIndex: 0,
        toIndex: 99999,
        maxFeatures: 100000
      });
      new FeatureService(dataUrl).getFeaturesByGeometry(geometryParam, function(
        serviceResult
      ) {
        if (!this.map.getSource(alias + "_areaSource")) {
          this.map.addSource(alias + "_areaSource", {
            type: "geojson",
            data: serviceResult.result.features
          });
        } else {
          this.map
            .getSource(alias + "_areaSource")
            .setData(serviceResult.result.features);
        }
        map.addLayer({
          id: "polygonQueryLayer",
          type: "fill",
          source: alias + "_areaSource",
          paint: {
            "fill-color": "#FF3300",
            "fill-opacity": 0.6
          }
        });
      });
    },
    clearPloygonQueryLayer() {
      if (this.map.getLayer("polygonQueryLayer")) {
        this.map.removeLayer("polygonQueryLayer");
      }
    },
    searchFeatureNames(e) {
      var __this = this;
      getPointTreeList().then(res => {
        // console.log('res: ' + CircularJSON.stringify(res));
        if (res === null) {
          return;
        }

        __this.mapQueryTreeList = res;
        __this.getBlurNames = [];
        var searchName = e;
        var tablenames = [];
        for (var i = 0; i < res.length; i++) {
          // console.log('res[i].datasetname: ' + res[i].datasetname);
          if (
            res[i].datasetname !== null &&
            res[i].datasetname.indexOf(":") > 0
          ) {
            var tablename = res[i].datasetname.substring(
              res[i].datasetname.indexOf(":") + 1
            );
            if (tablenames.indexOf(tablename) < 0) {
              tablenames.push(tablename);
            }
          }
        }
        if (e === __this.currentSearchFeature) {
          __this.searchFeatureCount++;
        } else {
          __this.currentSearchFeature = e;
          __this.searchFeatureCount = 1;
        }
        // console.log('__this.searchFeatureCount: ' + __this.searchFeatureCount);

        getSearchNameList(
          searchName,
          __this.searchFeatureCount,
          50,
          tablenames
        ).then(data => {
          // console.log('data: ' + CircularJSON.stringify(data));
          // console.log('数据条数：' + data.length);
          var eachAliasBlurNames = { blurNames: [] };
          var blurNames = [];
          if (data === null) {
            return;
          }
          for (var i = 0; i < data.length; i++) {
            var eachBlurName = {};
            eachBlurName.SMID = data[i].smid;
            eachBlurName.NAME = data[i].name;
            eachBlurName.TABLENAME = data[i].table_name;
            __this.getBlurNames.push(eachBlurName);
          }
        });
      });
    },
    chooseAddress(e) {
      // 给其它组件传数据
      //   this.$emit('setonePoint', e.detail);
      var __this = this;
      let value = e.value.split(",");
      var smid = value[1];

      if (value[0] === "D_DMDZ") {
        getTypeDetail(smid, "D_DMDZ").then(data => {
          // console.log('data:' + CircularJSON.stringify(data));
          // 1.传数据
          __this.$emit("setonePoint", data);
          // 2.添加点
          var dataJson = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: data,
                geometry: {
                  type: "Point",
                  coordinates: [data.CENTERX, data.CENTERY]
                },
                id: data.smid
              }
            ]
          };
          if (!__this.map.getSource("searchObj_source")) {
            __this.map.addSource("searchObj_source", {
              type: "geojson",
              data: dataJson
            });
          } else {
            __this.map.getSource("searchObj_source").setData(dataJson);
          }
          if (__this.map.getLayer("searchObj_layer")) {
            __this.map.removeLayer("searchObj_layer");
          }
          __this.map.addLayer(
            {
              id: "searchObj_layer",
              type: "symbol",
              source: "searchObj_source",
              layout: {
                "icon-image": "searchObj_Point",
                "icon-size": 0.8,
                "icon-allow-overlap": true
              }
            },
            "wz_boundary_layer"
          );

          // 3.缩放移位
          var zoomLevel = __this.map.getZoom();
          if (zoomLevel && zoomLevel < 12) {
            __this.map.setZoom(12);
          }
          var lngLat = [data.CENTERX, data.CENTERY];
          __this.map.flyTo({
            center: lngLat
          });
          // 4.弹框
          var str = "";
          str += `<p><span>区域：</span><p>${
            data.TOWN ? data.TOWN : "暂无数据"
          }</p></p><p><span>地址：</span><p>${
            data.ADDRESS ? data.ADDRESS : "暂无数据"
          }</p></p>`;
          __this.showAroundRequestParam = { center: lngLat, distance: "1000" };
          __this.areaQueryCenterCoordinates = lngLat;
          if (data.GUID != "" && data.GUID != null) {
            var html = `<div class="pop-tip">
                              <p class="">${data.NAME}</p>
                              ${str}
                              <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                              <span class="pop-tip-list" onclick="showInfoCamera()"><img src="./static/gitimage/other/camera_white.png"></span>
                              <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                              <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                            </div>`;
          } else {
            var html = `<div class="pop-tip">
                              <p class="">${data.NAME}</p>
                              ${str}
                              <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                              <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                              <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                            </div>`;
          }
          var tipElArr = document.getElementsByClassName(
            "mapboxgl-popup-close-button"
          );
          for (var i = 0; i < tipElArr.length; i++) {
            tipElArr[i].click();
          }
          var popup = new mapboxgl.Popup({
            closeOnClick: true
          });
          popup
            .setLngLat(lngLat)
            .setHTML(html)
            .addTo(__this.map);
        });
      } else {
        var mapPopName = [];
        var mapPopField = [];
        var datasetname = "pg_wzyjdb:" + value[0];
        for (var i = 0; i < __this.mapQueryTreeList.length; i++) {
          if (__this.mapQueryTreeList[i].datasetname === datasetname) {
            mapPopName = __this.mapQueryTreeList[i].mapPopName.split(",");
            mapPopField = __this.mapQueryTreeList[i].mapPopField.split(",");
            break;
          }
        }
        var sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            attributeFilter: "SMID=" + smid
          },
          datasetNames: [datasetname],
          fromIndex: 0,
          toIndex: 99999,
          maxFeatures: 100000
        });
        new FeatureService(__this.dataUrl).getFeaturesBySQL(sqlParam, function(
          serviceResult
        ) {
          if (serviceResult && serviceResult.result) {
            var features = serviceResult.result.features;
            // console.log("features: " + CircularJSON.stringify(features));
            // 1.传数据
            __this.$emit("setonePoint", features.features[0].properties);
            // 2.添加点
            if (!__this.map.getSource("searchObj_source")) {
              __this.map.addSource("searchObj_source", {
                type: "geojson",
                data: features
              });
            } else {
              __this.map.getSource("searchObj_source").setData(features);
            }
            if (__this.map.getLayer("searchObj_layer")) {
              __this.map.removeLayer("searchObj_layer");
            }
            __this.map.addLayer(
              {
                id: "searchObj_layer",
                type: "symbol",
                source: "searchObj_source",
                layout: {
                  "icon-image": "searchObj_Point",
                  "icon-size": 0.8,
                  "icon-allow-overlap": true
                }
              },
              "wz_boundary_layer"
            );

            // 3.缩放移位
            var zoomLevel = __this.map.getZoom();
            if (zoomLevel && zoomLevel < 12) {
              __this.map.setZoom(12);
            }
            var lngLat = features.features[0].geometry.coordinates;
            __this.map.flyTo({
              center: lngLat
            });
            // 4.弹框
            var feature = features.features[0];
            var str = "";
            for (var i = 1; i < mapPopField.length; i++) {
              if (mapPopField[i] === "FIND_TIME") {
                feature.properties[mapPopField[i]] = feature.properties[
                  mapPopField[i]
                ].replace(/\//g, "-");
              }
              str += `<div><span>${mapPopName[i]}：</span><p>${
                feature.properties[mapPopField[i]] != undefined &&
                feature.properties[mapPopField[i]].trim() != ""
                  ? feature.properties[mapPopField[i]]
                  : "暂无数据"
              }</p></div>`;
            }
            __this.showAroundRequestParam = {
              center: feature.geometry.coordinates,
              distance: "1000"
            };
            __this.areaQueryCenterCoordinates = feature.geometry.coordinates;

            if (
              feature.properties.GUID != "" &&
              feature.properties.GUID != null
            ) {
              var html = `<div class="pop-tip">
                                <p class="">${
                                  feature.properties[mapPopField[0]]
                                    ? feature.properties[mapPopField[0]]
                                    : "暂无数据"
                                }</p>
                                ${str}
                                <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                                <span class="pop-tip-list" onclick="showInfoCamera()"><img src="./static/gitimage/other/camera_white.png"></span>
                                <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                                <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                            </div>`;
            } else {
              var html = `<div class="pop-tip">
                                <p class="">${
                                  feature.properties[mapPopField[0]]
                                    ? feature.properties[mapPopField[0]]
                                    : "暂无数据"
                                }</p>
                                ${str}
                                <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                                <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                                <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                            </div>`;
            }
            var tipElArr = document.getElementsByClassName(
              "mapboxgl-popup-close-button"
            );
            for (var i = 0; i < tipElArr.length; i++) {
              tipElArr[i].click();
            }
            var popup = new mapboxgl.Popup({
              closeOnClick: true
            });
            popup
              .setLngLat(lngLat)
              .setHTML(html)
              .addTo(__this.map);
          }
        });
      }
    },
    createBaseMap() {
      console.log("createBaseMap");
      var tiles = {};
      var basemapSourcesTiles = MAP_CONFIG.basemapSourcesTiles;
      var WWW_MAP = document.location.protocol + "//" + window.location.host;
      if (
        WWW_MAP.indexOf("http://pshyz.f3322.net:9000") < 0 &&
        WWW_MAP.indexOf("http://localhost") < 0
      ) {
        // 如果是四色图，采用大数据底图
        if ("fourColorMap" === this.currentMapType) {
          this.basemapTiles = "bigdata-raster";
        }
      }
      for (var i = 0; i < basemapSourcesTiles.length; i++) {
        if (basemapSourcesTiles[i].name === this.basemapTiles) {
          tiles = basemapSourcesTiles[i].tiles;
          break;
        }
      }
      //选中
      this.$emit("baseMapType", this.basemapTiles);

      if ("bigdata-raster" === this.basemapTiles) {
        $("#base-map").css({ "background-color": "#162445" });
      } else {
        $("#base-map").css({ "background-color": "#204f77" });
      }
      var bounds = [
        [119.43, 27.1],
        [121.43, 28.62]
      ];
      if (this.basemapTiles.indexOf("vectortile") >= 0) {
        var attribution =
          "<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox </a>" +
          " with <span>© <a href='https://iclient.supermap.io' target='_blank'>SuperMap iClient</a> | </span>" +
          " Map Data <span>© <a href='http://support.supermap.com.cn/product/iServer.aspx' target='_blank'>SuperMap iServer</a></span> ";
        var __this = this;
        this.map = new mapboxgl.Map({
          style: tiles,
          center: [120.662287, 27.9],
          zoom: 8.8,
          minZoom: 8.8,
          maxZoom: 18,
          crs: "EPSG:4490"
          // scrollZoom: false
        });
      } else if (
        "2012YX" === this.basemapTiles ||
        "2014YX" === this.basemapTiles ||
        "2017YX" === this.basemapTiles ||
        "2018YX" === this.basemapTiles ||
        "2019YX" === this.basemapTiles
      ) {
        this.map = new mapboxgl.Map({
          container: "base-map",
          style: {
            version: 8,
            sources: {
              "baselayer-source": {
                type: "raster",
                tiles: [tiles],
                tileSize: 256,
                rasterSource: "iserver"
              }
            },
            layers: [
              {
                id: "base-layer",
                type: "raster",
                source: "baselayer-source",
                minzoom: 8.8,
                maxzoom: 19
              }
            ]
          },
          crs: "EPSG:4490",
          // scrollZoom: false,
          center: [120.662287, 27.9],
          zoom: 8.8,
          minZoom: 8.8,
          maxZoom: 18
        });
      } else if (
        "standard-raster" === this.basemapTiles ||
        "bigdata-raster" === this.basemapTiles
      ) {
        this.map = new mapboxgl.Map({
          container: "base-map",
          style: {
            version: 8,
            sources: {
              "baselayer-source": {
                type: "raster",
                tiles: [tiles],
                tileSize: 256,
                rasterSource: "iserver"
              }
            },
            layers: [
              {
                id: "base-layer",
                type: "raster",
                source: "baselayer-source",
                minzoom: 8.8,
                maxzoom: 21
              }
            ]
          },
          crs: "EPSG:4490",
          // scrollZoom: false,
          center: [120.662287, 27.9],
          zoom: 8.8,
          minZoom: 8.8
        });
        if ("standard-raster" === this.basemapTiles) {
          this.map.setMaxZoom(19);
        } else if ("bigdata-raster" === this.basemapTiles) {
          this.map.setMaxZoom(18);
        }
      } else if ("ArcGIS-raster" === this.basemapTiles) {
        this.map = new mapboxgl.Map({
          container: "base-map",
          style: {
            version: 8,
            sources: {
              "baselayer-source": {
                type: "raster",
                tiles: [tiles],
                tileSize: 256
              }
            },
            layers: [
              {
                id: "base-layer",
                type: "raster",
                source: "baselayer-source",
                minzoom: 8.8,
                maxzoom: 19
              }
            ]
          },
          crs: "EPSG:3857",
          center: [120.662287, 27.9],
          zoom: 8.8,
          minZoom: 8.8,
          maxZoom: 18
        });
      }

      var __this = this;
      // this.map.on('wheel', ({originalEvent:{wheelDelta}})=> {
      //   __this.map.setZoom(__this.map.getZoom() + Math.sign(wheelDelta));
      // });
      // 加载行政区划区域、边界
      this.map.on("load", function() {
        var userDistrict = __this.userInfo.district;
        if (userDistrict === "3303") {
          var districtDataServer = MAP_CONFIG.districtDataServer;
          __this.addDistrictStreetFromServer(
            districtDataServer.url,
            districtDataServer.alias,
            districtDataServer.datasetname,
            districtDataServer.sql
          );
          __this.setBoundryAndCover(false);
        } else {
          var streetDataServer = MAP_CONFIG.streetDataServer;
          __this.addDistrictStreetFromServer(
            streetDataServer.url,
            streetDataServer.alias,
            streetDataServer.datasetname,
            streetDataServer.sql
          );
          __this.setBoundryAndCover(true);
        }
      });
      var userDistrict = this.userInfo.district;
      if ("3303" !== userDistrict) {
        var districtName = this.userInfo.districtName;
        if ("瑞安市" === districtName) {
          this.map.setZoom(10.2);
        } else if ("鹿城区" === districtName) {
          this.map.setZoom(10.8);
        } else if ("龙港市" === districtName) {
          this.map.setZoom(11);
        } else if ("龙湾区" === districtName) {
          this.map.setZoom(11.2);
        } else if ("经开区" === districtName) {
          this.map.setZoom(12);
        } else if ("瓯江口" === districtName) {
          this.map.setZoom(12.2);
        } else if ("永嘉县" === districtName) {
          this.map.setZoom(10.1);
        } else if (
          "瓯海区" === districtName ||
          "洞头区" === districtName ||
          "文成县" === districtName
        ) {
          this.map.setZoom(10.5);
        } else {
          this.map.setZoom(10);
        }
        for (var i = 0; i < getDistrictData.features.length; i++) {
          if (districtName === getDistrictData.features[i].properties.NAME) {
            this.map.flyTo({
              center: getDistrictData.features[i].geometry.coordinates
            });
            break;
          }
        }
      }
      this.scaleControl = new mapboxgl.ScaleControl({});
      this.map.addControl(this.scaleControl);
      this.map.addControl(new mapboxgl.AttributionControl({ compact: true }));
      var Draw = new MapboxDraw({
        controls: {
          line_string: true,
          polygon: true,
          trash: true
        }
      });
      this.map.addControl(Draw, "top-left");
      this.map.on("draw.create", this.measure);

      var __this = this;
      this.map.loadImage("./static/image/level1.png", function(error, image) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("level1_Point")) {
          __this.map.addImage("level1_Point", image);
        }
      });
      this.map.loadImage("./static/image/level2.png", function(error, image) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("level2_Point")) {
          __this.map.addImage("level2_Point", image);
        }
      });
      this.map.loadImage("./static/image/level3.png", function(error, image) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("level3_Point")) {
          __this.map.addImage("level3_Point", image);
        }
      });
      this.map.loadImage("./static/image/level4.png", function(error, image) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("level4_Point")) {
          __this.map.addImage("level4_Point", image);
        }
      });
      this.map.loadImage("./static/gitimage/ditusousuo/searchObj.png", function(
        error,
        image
      ) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("searchObj_Point")) {
          __this.map.addImage("searchObj_Point", image);
        }
      });
      this.map.loadImage("./static/gitimage/other/gaoliang.png", function(
        error,
        image
      ) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("gaoliang_Point")) {
          __this.map.addImage("gaoliang_Point", image);
        }
      });
      this.map.loadImage(
        "./static/gitimage/shantangshuiku/shantang_1.png",
        function(error, image) {
          if (error) {
            console.log("error: " + error);
          }
          if (!__this.map.hasImage("STSK/YLJSD_ST_Point_1")) {
            __this.map.addImage("STSK/YLJSD_ST_Point_1", image);
          }
        }
      );
      this.map.loadImage(
        "./static/gitimage/shantangshuiku/shuiku_1.png",
        function(error, image) {
          if (error) {
            console.log("error: " + error);
          }
          if (!__this.map.hasImage("STSK/YLJSD_SK_Point_1")) {
            __this.map.addImage("STSK/YLJSD_SK_Point_1", image);
          }
        }
      );
      this.map.loadImage(
        "./static/gitimage/cityjichu/jishuidian_1.png",
        function(error, image) {
          if (error) {
            console.log("error: " + error);
          }
          if (!__this.map.hasImage("STSK/YLJSD_JSD_Point_1")) {
            __this.map.addImage("STSK/YLJSD_JSD_Point_1", image);
          }
        }
      );
      this.map.loadImage(
        "./static/gitimage/yingjiduiwu/guganjiuyuanduiwu_1.png",
        function(error, image) {
          if (error) {
            console.log("error: " + error);
          }
          if (!__this.map.hasImage("YJDW_GGJYDW_Point_1")) {
            __this.map.addImage("YJDW_GGJYDW_Point_1", image);
          }
        }
      );
      this.map.loadImage("./static/gitimage/ziranzaihai/huapo_1.png", function(
        error,
        image
      ) {
        if (error) {
          console.log("error: " + error);
        }
        if (!__this.map.hasImage("ZRZH_DZZHYHD_Point_1")) {
          __this.map.addImage("ZRZH_DZZHYHD_Point_1", image);
        }
      });

      this.map.on("click", "searchObj_layer", function(e) {
        // console.log('e:' + CircularJSON.stringify(e));
        // 详细信息处理
        e.features[0].properties.refresh = false;
        __this.$emit("setonePoint", e.features[0].properties);
        // console.log("feature: " + CircularJSON.stringify(e.features[0]));
        var feature = e.features[0];
        // console.log('table_name: ' + feature.properties.table_name);
        var tablename = "";
        if (feature.properties.table_name !== undefined) {
          tablename = feature.properties.table_name;
        } else if (feature.properties.TABLE_NAME !== undefined) {
          tablename = feature.properties.TABLE_NAME;
        }

        var str = "";
        var lngLat = feature.geometry.coordinates;
        if (tablename === "D_DMDZ") {
          str += `<p><span>区域：</span><p>${
            feature.properties.TOWN ? feature.properties.TOWN : "暂无数据"
          }</p></p><p><span>地址：</span><p>${
            feature.properties.ADDRESS ? feature.properties.ADDRESS : "暂无数据"
          }</p></p>`;
          __this.showAroundRequestParam = { center: lngLat, distance: "1000" };
          __this.areaQueryCenterCoordinates = lngLat;
          if (
            feature.properties.GUID != "" &&
            feature.properties.GUID != null
          ) {
            var html = `<div class="pop-tip">
                            <p class="">${feature.properties.NAME}</p>
                            ${str}
                            <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                            <span class="pop-tip-list" onclick="showInfoCamera()"><img src="./static/gitimage/other/camera_white.png"></span>
                            <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                            <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                          </div>`;
          } else {
            var html = `<div class="pop-tip">
                            <p class="">${feature.properties.NAME}</p>
                            ${str}
                            <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                            <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                            <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                          </div>`;
          }

          var tipElArr = document.getElementsByClassName(
            "mapboxgl-popup-close-button"
          );
          for (var i = 0; i < tipElArr.length; i++) {
            tipElArr[i].click();
          }
          var popup = new mapboxgl.Popup({
            closeOnClick: true
          });
          popup
            .setLngLat(lngLat)
            .setHTML(html)
            .addTo(__this.map);
        } else {
          //获取弹框字段
          var mapPopName = [];
          var mapPopField = [];
          var datasetname = "pg_wzyjdb:" + tablename;
          for (var i = 0; i < __this.mapQueryTreeList.length; i++) {
            if (__this.mapQueryTreeList[i].datasetname === datasetname) {
              mapPopName = __this.mapQueryTreeList[i].mapPopName.split(",");
              mapPopField = __this.mapQueryTreeList[i].mapPopField.split(",");
              break;
            }
          }
          //弹框
          for (var i = 1; i < mapPopField.length; i++) {
            if (mapPopField[i] === "FIND_TIME") {
              feature.properties[mapPopField[i]] = feature.properties[
                mapPopField[i]
              ].replace(/\//g, "-");
            }
            str += `<div><span>${mapPopName[i]}：</span><p>${
              feature.properties[mapPopField[i]] != undefined &&
              feature.properties[mapPopField[i]].trim() != ""
                ? feature.properties[mapPopField[i]]
                : "暂无数据"
            }</p></div>`;
          }
          __this.showAroundRequestParam = { center: lngLat, distance: "1000" };
          __this.areaQueryCenterCoordinates = lngLat;
          if (
            feature.properties.GUID != "" &&
            feature.properties.GUID != null
          ) {
            var html = `<div class="pop-tip">
                              <p class="">${
                                feature.properties[mapPopField[0]]
                                  ? feature.properties[mapPopField[0]]
                                  : "暂无数据"
                              }</p>
                              ${str}
                              <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                              <span class="pop-tip-list" onclick="showInfoCamera()"><img src="./static/gitimage/other/camera_white.png"></span>
                              <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                              <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                          </div>`;
          } else {
            var html = `<div class="pop-tip">
                              <p class="">${
                                feature.properties[mapPopField[0]]
                                  ? feature.properties[mapPopField[0]]
                                  : "暂无数据"
                              }</p>
                              ${str}
                              <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                              <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                              <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                          </div>`;
          }
          var tipElArr = document.getElementsByClassName(
            "mapboxgl-popup-close-button"
          );
          for (var i = 0; i < tipElArr.length; i++) {
            tipElArr[i].click();
          }
          var popup = new mapboxgl.Popup({
            closeOnClick: true
          });
          popup
            .setLngLat(lngLat)
            .setHTML(html)
            .addTo(__this.map);
        }
      });
      this.map.on("click", function(e) {
        // console.log('e: ' + CircularJSON.stringify(e));
        var lngLat = e.lngLat;
        // console.log('lngLat: ' + CircularJSON.stringify(lngLat));
        var coordinatesAry = [];
        coordinatesAry[0] = lngLat.lng;
        coordinatesAry[1] = lngLat.lat;
        var checkedMenu = __this.data.allCheckData;
        if (!checkedMenu) {
          return;
        }
        for (var i = 0; i < checkedMenu.length; i++) {
          if (checkedMenu[i].geotype === "polygon") {
            __this.queryPolygonDataServer(
              coordinatesAry,
              checkedMenu[i].url,
              checkedMenu[i].alias,
              checkedMenu[i].icon,
              checkedMenu[i].datasetname,
              checkedMenu[i].sql,
              checkedMenu[i].mapPopName,
              checkedMenu[i].mapPopField
            );
          }
          if (checkedMenu[i].children && checkedMenu[i].children.length > 0) {
            for (var j = 0; j < checkedMenu[i].children.length; j++) {
              var childrenData = checkedMenu[i].children[j];
              if (childrenData.geotype === "polygon") {
                __this.queryPolygonDataServer(
                  coordinatesAry,
                  childrenData.url,
                  childrenData.alias,
                  childrenData.icon,
                  childrenData.datasetname,
                  childrenData.sql,
                  childrenData.mapPopName,
                  childrenData.mapPopField
                );
              }
            }
          }
        }
      });

      this.map.on("zoomend", function(e) {
        if ("juhe" === __this.currentMapType) {
          var zoomLevel = __this.map.getZoom();
          // 6-11级，显示区县地图
          if (zoomLevel && zoomLevel <= 11) {
            __this.removeLayer("street_layer");
            for (var i = 0; i < __this.scatterLayerAliasAry.length; i++) {
              __this.removeLayer(__this.scatterLayerAliasAry[i] + "_layer");
            }
            __this.addJuheLayer("district_layer");
            __this.IsJuheScatterLayer = false;
          }
          // 12-14级，显示乡镇地图
          else if (zoomLevel && zoomLevel > 11 && zoomLevel <= 14) {
            __this.removeLayer("district_layer");
            for (var i = 0; i < __this.scatterLayerAliasAry.length; i++) {
              __this.removeLayer(__this.scatterLayerAliasAry[i] + "_layer");
            }
            __this.addJuheLayer("street_layer");
            __this.IsJuheScatterLayer = false;
          }
          // 14级以上，显示散点图
          else {
            __this.removeLayer("street_layer");
            __this.removeLayer("district_layer");
            var checkedMenu = __this.data.allCheckData;
            if (!checkedMenu) {
              return;
            }
            for (var i = 0; i < checkedMenu.length; i++) {
              __this.addScatterLayerFromServer(
                checkedMenu[i].url,
                checkedMenu[i].alias,
                checkedMenu[i].icon,
                checkedMenu[i].datasetname,
                checkedMenu[i].sql,
                checkedMenu[i].geotype
              );
              // 有子菜单的情况
              if (checkedMenu[i].children && checkedMenu[i].children !== []) {
                for (var j = 0; j < checkedMenu[i].children.length; j++) {
                  var childrenData = checkedMenu[i].children[j];
                  __this.addScatterLayerFromServer(
                    childrenData.url,
                    childrenData.alias,
                    childrenData.icon,
                    childrenData.datasetname,
                    childrenData.sql,
                    childrenData.geotype
                  );
                }
              }
            }
          }

          __this.addScatterLegend();
          __this.addLineOrPolygonLegend();
          __this.IsJuheScatterLayer = true;
        }
      });
      this.map.on("mouseenter", "district_layer", function(e) {
        var currentDistrict = e.features[0].properties.NAME;
        var checkedMenu = __this.data.allCheckData;
        var juheDetail = [];
        for (var i = 0; i < checkedMenu.length; i++) {
          var featurename = checkedMenu[i].name;
          var featureunit = checkedMenu[i].unit;
          // console.log('featureunit: ' + featureunit);
          var count = 0;
          for (var j = 0; j < __this.districtFeaturesAry.length; j++) {
            if (
              __this.districtFeaturesAry[j].belong === currentDistrict &&
              __this.districtFeaturesAry[j].layername === featurename
            ) {
              count = __this.districtFeaturesAry[j].count;
            }
          }
          if (count > 0) {
            juheDetail.push({
              featurename: featurename,
              count: count,
              featureunit: featureunit
            });
          }
        }
        // console.log("juheDetail: " + CircularJSON.stringify(juheDetail));

        // 拼接地图气泡
        var longitude = e.features[0].geometry.coordinates[0];
        var latitude = e.features[0].geometry.coordinates[1];
        var lngLat = { lng: Number(longitude), lat: Number(latitude) };
        var str = "";
        for (var i = 0; i < juheDetail.length; i++) {
          if (
            juheDetail[i].featureunit === null ||
            juheDetail[i].featureunit.trim() === ""
          ) {
            str += `<div><span>${juheDetail[i].featurename}：</span><b>${juheDetail[i].count}</b></div>`;
          } else {
            str += `<div><span>${juheDetail[i].featurename}：</span><b>${juheDetail[i].count}(${juheDetail[i].featureunit})</b></div>`;
          }
        }
        var html = `<div class="pop-tip-juhe">
                        <p class="">${currentDistrict}</p>
                        <div class="pop-top-box">${str}</div>
                    </div>`;
        // 删除别的提示框
        var tipElArr = document.getElementsByClassName(
          "mapboxgl-popup-close-button"
        );
        for (var i = 0; i < tipElArr.length; i++) {
          tipElArr[i].click();
        }
        // 弹出提示框
        var popup = new mapboxgl.Popup({
          closeOnClick: true
        });
        // console.log('lngLat: ' + CircularJSON.stringify(lngLat));
        popup
          .setLngLat(lngLat)
          .setHTML(html)
          .addTo(__this.map);
        $(".mapboxgl-popup-content .mapboxgl-popup-close-button").hide();
        // 删除事件
        var popupDiv = document.getElementsByClassName(
          "mapboxgl-popup mapboxgl-popup-anchor-bottom"
        )[0];
        popupDiv.addEventListener("mouseleave", function() {
          var tipEl = document.getElementsByClassName(
            "mapboxgl-popup-close-button"
          )[0];
          tipEl.click();
        });
      });
      this.map.on("mouseenter", "street_layer", function(e) {
        // console.log("e: " + CircularJSON.stringify(e.features));
        var currentStreet = e.features[0].properties.NAME;
        var checkedMenu = __this.data.allCheckData;
        var juheDetail = [];
        for (var i = 0; i < checkedMenu.length; i++) {
          var featurename = checkedMenu[i].name;
          var featureunit = checkedMenu[i].unit;
          var count = 0;
          for (var j = 0; j < __this.streetFeaturesAry.length; j++) {
            if (
              __this.streetFeaturesAry[j].belong === currentStreet &&
              __this.streetFeaturesAry[j].layername === featurename
            ) {
              count = __this.streetFeaturesAry[j].count;
            }
          }
          if (count > 0) {
            juheDetail.push({
              featurename: featurename,
              count: count,
              featureunit: featureunit
            });
          }
        }
        // 拼接地图气泡
        var longitude = e.features[0].geometry.coordinates[0];
        var latitude = e.features[0].geometry.coordinates[1];
        var lngLat = { lng: Number(longitude), lat: Number(latitude) };
        var str = "";
        for (var i = 0; i < juheDetail.length; i++) {
          if (
            juheDetail[i].featureunit === null ||
            juheDetail[i].featureunit.trim() === ""
          ) {
            str += `<div><span>${juheDetail[i].featurename}:</span><b>${juheDetail[i].count}</b></div>`;
          } else {
            str += `<div><span>${juheDetail[i].featurename}:</span><b>${juheDetail[i].count}(${juheDetail[i].featureunit})</b></div>`;
          }
        }
        var html = `<div class="pop-tip-juhe">
                        <p class="">${currentStreet}</p>
                        <div class="pop-top-box">${str}</div>
                    </div>`;
        // 删除别的提示框
        var tipElArr = document.getElementsByClassName(
          "mapboxgl-popup-close-button"
        );
        for (var i = 0; i < tipElArr.length; i++) {
          tipElArr[i].click();
        }
        // 弹出提示框
        var popup = new mapboxgl.Popup({
          closeOnClick: true
        });
        popup
          .setLngLat(lngLat)
          .setHTML(html)
          .addTo(__this.map);
        $(".mapboxgl-popup-content .mapboxgl-popup-close-button").hide();
        // 删除事件
        var popupDiv = document.getElementsByClassName(
          "mapboxgl-popup mapboxgl-popup-anchor-bottom"
        )[0];
        popupDiv.addEventListener("mouseleave", function() {
          var tipEl = document.getElementsByClassName(
            "mapboxgl-popup-close-button"
          )[0];
          tipEl.click();
        });
      });
      this.map.on("mousemove", function(e) {
        // console.log('e: ' + CircularJSON.stringify(e));
        $(".mapboxgl-ctrl-lngLat").remove();
        // var lngLat = e.lngLat;
        var lng = Math.round(e.lngLat.lng * 10000) / 10000;
        var lat = Math.round(e.lngLat.lat * 10000) / 10000;
        $(".mapboxgl-ctrl-scale").after(
          '<div class="mapboxgl-ctrl mapboxgl-ctrl-lngLat">经度：' +
            lng +
            "，纬度：" +
            lat +
            "</div>"
        );
      });
    },
    createBaseMapAndLayer() {
      this.loadedLayer = [];
      var __this = this;
      var userDistrict = __this.userInfo.district;
      if (userDistrict === "3303") {
        let p = new Promise((resolve, reject) => {
          resolve("success");
          reject("failed");
        });
        // 创建底图
        var p1 = p.then(function(value) {
          console.log("value: " + value);
          __this.isMapLoaded = false;
          __this.createBaseMap();
          __this.lastMapType = __this.currentMapType;
        });
        // 告诉前端底图加载完毕
        var p2 = p1.then(function(value) {
          __this.map.on("load", function() {
            __this.SetMapLoaded(true);
            __this.isMapLoaded = true;
            __this.$store.dispatch("changeLoad", false);
          });
        });
      } else {
        //查询区县数据
        this.isLoadBoundryData = false;
        var zgmDataServer = MAP_CONFIG.zgmDataServer;
        var districtName = this.userInfo.districtName;
        var sql = "COUNTRY='" + districtName + "遮盖面'";
        this.addDistrictStreetFromServer(
          zgmDataServer.url,
          zgmDataServer.alias,
          zgmDataServer.datasetname,
          sql
        );
        //创建底图及通知左侧菜单
        this.t = setInterval(() => {
          if (__this.isLoadBoundryData) {
            clearInterval(__this.t);

            let p = new Promise((resolve, reject) => {
              resolve("success");
              reject("failed");
            });
            // 创建底图
            var p1 = p.then(function(value) {
              console.log("value: " + value);
              __this.isMapLoaded = false;
              __this.createBaseMap();
              __this.lastMapType = __this.currentMapType;
            });
            // 告诉前端底图加载完毕
            var p2 = p1.then(function(value) {
              __this.map.on("load", function() {
                __this.SetMapLoaded(true);
                __this.isMapLoaded = true;
                __this.$store.dispatch("changeLoad", false);
              });
            });
          }
        });
      }
    },
    setBoundryAndCover(setCover) {
      var WWW_MAP = document.location.protocol + "//" + window.location.host;
      // if (WWW_MAP.indexOf('http://pshyz.f3322.net:9000') >= 0 || WWW_MAP.indexOf('http://localhost') === 0) {
      //   this.removeLayer("wz_boundary_layer");
      //   this.map.addLayer({
      //     "id": "wz_boundary_layer",
      //     "type": "line",
      //     "source": {
      //       "type": "geojson",
      //       "data": "./static/wenzhou.json"
      //     },
      //     "layout": {
      //       "line-cap": "round",
      //       "line-join": "round"
      //     },
      //     "paint": {
      //       "line-color": "#FFA500",
      //       "line-dasharray": [0.2, 2],
      //       "line-width": 2
      //     }
      //   });
      //   if (setCover === true) {
      //     this.isCoverToolbarShow = true;
      //   }
      // } else {
      //需要设置这该图层
      if (setCover === true) {
        //增加遮盖图层
        // var districtName = this.userInfo.districtName;
        var otherDistrictAry = [];
        for (var i = 0; i < this.baseMapDistrictFeatures.length; i++) {
          otherDistrictAry.push(this.baseMapDistrictFeatures[i]);
        }
        if (!this.map.getSource("basemapDistrict_source")) {
          this.map.addSource("basemapDistrict_source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: otherDistrictAry
            }
          });
        } else {
          this.map.getSource("basemapDistrict_source").setData({
            type: "FeatureCollection",
            features: otherDistrictAry
          });
        }
        this.removeLayer("basemapDistrict_layer");
        this.map.addLayer({
          id: "basemapDistrict_layer",
          type: "fill",
          source: "basemapDistrict_source",
          paint: {
            "fill-color": "rgba(32,79,119," + this.sliderValue + ")"
          }
        });

        //增加乡镇街道分界线
        var xzqhxzjd = MAP_CONFIG.xzqhxzjd;
        if (this.map.getLayer("wz_boundary_layer")) {
          this.removeLayer("wz_boundary_layer");
        }
        if (this.map.getSource("qx_boundary_source")) {
          this.map.removeSource("qx_boundary_source");
        }
        this.map.addSource("qx_boundary_source", {
          type: "raster",
          tiles: [xzqhxzjd],
          tileSize: 256,
          rasterSource: "iserver"
        });
        this.map.addLayer(
          {
            id: "wz_boundary_layer",
            type: "raster",
            source: "qx_boundary_source"
          },
          "basemapDistrict_layer"
        );
        this.isCoverToolbarShow = true;
      } else {
        //增加乡镇街道分界线
        var xzqhxzjd = MAP_CONFIG.xzqhxzjd;
        if (this.map.getLayer("qx_boundary_layer")) {
          this.removeLayer("qx_boundary_layer");
        }
        if (this.map.getSource("qx_boundary_source")) {
          this.map.removeSource("qx_boundary_source");
        }
        this.map.addSource("qx_boundary_source", {
          type: "raster",
          tiles: [xzqhxzjd],
          tileSize: 256,
          rasterSource: "iserver"
        });
        this.map.addLayer({
          id: "qx_boundary_layer",
          type: "raster",
          source: "qx_boundary_source"
        });

        //增加区县分界线
        var xzqhxs = MAP_CONFIG.xzqhxs;
        if (this.map.getLayer("wz_boundary_layer")) {
          this.removeLayer("wz_boundary_layer");
        }
        if (this.map.getSource("wz_boundary_source")) {
          this.map.removeSource("wz_boundary_source");
        }
        this.map.addSource("wz_boundary_source", {
          type: "raster",
          tiles: [xzqhxs],
          tileSize: 256,
          rasterSource: "iserver"
        });
        this.map.addLayer(
          {
            id: "wz_boundary_layer",
            type: "raster",
            source: "wz_boundary_source"
          },
          "qx_boundary_layer"
        );
      }
      // }

      var userDistrict = this.userInfo.district;
      if (userDistrict === "3303") {
        this.setDistrictLayer(this.selectedDistrict, false);
      } else {
        this.setStreetLayer(this.selectedStreet, userDistrict, false);
      }
    },
    addJuheLayer(layername) {
      var checkedMenu = this.data.allCheckData;
      // console.log('checkedMenu: ' + CircularJSON.stringify(checkedMenu));
      if (!checkedMenu || checkedMenu.length === 0) {
        this.removeLayer("district_layer");
        this.removeLayer("street_layer");
        return;
      }

      var layerList = [];
      var requestUrl = "";
      var sqlAry = [];
      for (var i = 0; i < checkedMenu.length; i++) {
        if ("point" === checkedMenu[i].geotype) {
          layerList.push({
            datasetname: checkedMenu[i].datasetname,
            datatype: checkedMenu[i].sql
          });
          requestUrl = checkedMenu[i].url;
        }
        if (
          checkedMenu[i].sql !== "" &&
          sqlAry.indexOf(checkedMenu[i].sql) < 0
        ) {
          sqlAry.push(checkedMenu[i].sql);
        }
      }

      var sqls = "";
      if (sqlAry && sqlAry.length > 0) {
        if (sqlAry.length === 1) {
          sqls = sqlAry[0];
        } else {
          sqls = sqlAry[0];
          for (var i = 1; i < sqlAry.length; i++) {
            sqls = "(" + sqls + ")" + " OR " + "(" + sqlAry[i] + ")";
          }
        }
      } else {
        sqls = "SMID >= 0";
      }

      var queryType = "";
      var userDistrict = this.userInfo.district;
      if ("district_layer" === layername) {
        if (this.map.getLayer("district_layer")) {
          this.map.removeLayer("district_layer");
        }

        var __this = this;
        queryType = "district";
        getPictureDistrictTypeNum(layerList, queryType).then(data => {
          // console.log('data: ' + CircularJSON.stringify(data));
          __this.districtFeaturesAry = data;
          // 添加数据源
          if (userDistrict === "3303") {
            __this.districtData = getDistrictData;
          } else {
            __this.districtData = { type: "FeatureCollection", features: [] };
            var districtName = this.userInfo.districtName;
            for (var i = 0; i < getDistrictData.features.length; i++) {
              if (
                getDistrictData.features[i].properties.NAME === districtName
              ) {
                __this.districtData.features.push(getDistrictData.features[i]);
              }
            }
          }

          for (var i = 0; i < __this.districtData.features.length; i++) {
            var districtName = __this.districtData.features[i].properties.NAME;
            var featureCount = 0;
            for (var j = 0; j < data.length; j++) {
              if (data[j].belong === districtName) {
                featureCount = featureCount + data[j].count;
              }
            }
            // if (featureCount == 0) {
            //   __this.districtData.features[i].properties.FEATURECOUNT = __this.districtData.features[i].properties.NAME;
            // } else {
            __this.districtData.features[i].properties.FEATURECOUNT =
              __this.districtData.features[i].properties.NAME +
              "(" +
              featureCount +
              ")";
            // }
            // console.log("districtData: " + CircularJSON.stringify(__this.districtData.features[i]));
          }
          if (!__this.map.getSource("district_source")) {
            __this.map.addSource("district_source", {
              type: "geojson",
              data: __this.districtData
            });
          } else {
            __this.map
              .getSource("district_source")
              .setData(__this.districtData);
          }
          // console.log("districtData: " + JSON.stringify(__this.districtData));
          // 设置图层
          if (__this.map.getLayer("district_layer")) {
            __this.map.removeLayer("district_layer");
          }
          __this.map.addLayer(
            {
              id: "district_layer",
              source: "district_source",
              type: "symbol",
              layout: {
                "text-letter-spacing": 0,
                "text-field": "{FEATURECOUNT}",
                "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
                "text-size": 15,
                "text-allow-overlap": true
              },
              paint: {
                "text-color": "#ffbe32",
                "text-halo-width": 2,
                "text-halo-color": "rgba(0, 0, 0, 0.5)"
              }
            },
            "wz_boundary_layer"
          );
          var zoomLevel = __this.map.getZoom();
          if (
            __this.currentMapType !== "juhe" ||
            (__this.currentMapType === "juhe" && zoomLevel > 11)
          ) {
            __this.removeLayer("district_layer");
          }
        });
      } else if ("street_layer" === layername) {
        if (this.map.getLayer("street_layer")) {
          this.map.removeLayer("street_layer");
        }

        var __this = this;
        queryType = "street";
        getPictureDistrictTypeNum(layerList, queryType).then(data => {
          // console.log('data: ' + CircularJSON.stringify(data));
          __this.streetFeaturesAry = data;
          // 添加数据源
          if (userDistrict === "3303") {
            __this.streetData = getStreetData;
          } else {
            __this.streetData = { type: "FeatureCollection", features: [] };
            for (var i = 0; i < getStreetData.features.length; i++) {
              if (
                getStreetData.features[i].properties.code.indexOf(
                  userDistrict
                ) === 0
              ) {
                __this.streetData.features.push(getStreetData.features[i]);
              }
            }
          }

          for (var i = 0; i < __this.streetData.features.length; i++) {
            var streetName = __this.streetData.features[i].properties.NAME;
            var featureCount = 0;
            for (var j = 0; j < data.length; j++) {
              if (data[j].belong === streetName) {
                featureCount = featureCount + data[j].count;
              }
            }
            // if (featureCount == 0) {
            //   __this.streetData.features[i].properties.FEATURECOUNT = __this.streetData.features[i].properties.NAME;
            // } else {
            __this.streetData.features[i].properties.FEATURECOUNT =
              __this.streetData.features[i].properties.NAME +
              "(" +
              featureCount +
              ")";
            // }
          }
          if (!__this.map.getSource("street_source")) {
            __this.map.addSource("street_source", {
              type: "geojson",
              data: __this.streetData
            });
          } else {
            __this.map.getSource("street_source").setData(__this.streetData);
          }
          // 设置图层
          if (__this.map.getLayer("street_layer")) {
            __this.map.removeLayer("street_layer");
          }
          __this.map.addLayer(
            {
              id: "street_layer",
              source: "street_source",
              type: "symbol",
              layout: {
                "text-letter-spacing": 0,
                "text-field": "{FEATURECOUNT}",
                "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
                "text-size": 15,
                "text-allow-overlap": true
              },
              paint: {
                "text-color": "#ffbe32" /* 文本颜色 */,
                "text-halo-width": 2 /* 字体光晕宽度 */,
                "text-halo-color": "rgba(0, 0, 0, 0.5)" /* 字体光晕颜色 */
              }
            },
            "wz_boundary_layer"
          );
          var zoomLevel = __this.map.getZoom();
          if (
            __this.currentMapType !== "juhe" ||
            (__this.currentMapType === "juhe" &&
              (zoomLevel <= 11 || zoomLevel > 14))
          ) {
            __this.removeLayer("street_layer");
          }
        });
      }
    },
    measure(e) {
      // 用于空间查询，不做测量
      if (this.isSpatialQuery === true) {
        // 添加面图层
        var coordinatesAry = e.features[0].geometry.coordinates;
        // console.log("coordinatesAry: " + CircularJSON.stringify(coordinatesAry));
        this.addDrawPolygonLayer(coordinatesAry);

        // console.log("e: " + CircularJSON.stringify(e));
        var checkedMenu = this.data.allCheckData;

        // var datasetnames = [];
        // var sqlAry = [];
        // for (var i = 0; i < checkedMenu.length; i++) {
        //   if (datasetnames.indexOf(checkedMenu[i].datasetname) < 0 && "point" === checkedMenu[i].geotype && (''!==checkedMenu[i].icon.trim() && checkedMenu[i].icon!==null)) {
        //     datasetnames.push(checkedMenu[i].datasetname);
        //   }
        //   if (checkedMenu[i].sql !== "" && sqlAry.indexOf(checkedMenu[i].sql) < 0) {
        //     sqlAry.push(checkedMenu[i].sql);
        //   }
        // }
        // var sqls = "";
        // if (sqlAry && sqlAry.length > 0) {
        //   if (sqlAry.length === 1) {
        //     sqls = sqlAry[0];
        //   } else {
        //     sqls = sqlAry[0];
        //     for (var i = 1; i < sqlAry.length; i++) {
        //       sqls += " OR " + sqlAry[i];
        //     }
        //   }
        // } else {
        //   sqls = "SMID >= 0";
        // }
        this.$parent.$refs.space.allData = [];

        // 设置几何查询范围
        var queryPolygonGeometry = {
          type: "Polygon",
          coordinates: coordinatesAry
        };
        var userDistrict = this.userInfo.district;
        for (var i = 0; i < checkedMenu.length; i++) {
          if (
            "point" === checkedMenu[i].geotype &&
            "" !== checkedMenu[i].icon.trim() && checkedMenu[i].icon !== null
          ) {
            this.addSpatialQueryResultSet(
              queryPolygonGeometry,
              checkedMenu[i].alias,
              checkedMenu[i].datasetname,
              checkedMenu[i].sql,
              checkedMenu[i].icon,
              checkedMenu[i].mapPopField,
              checkedMenu[i].mapPopName,
              userDistrict
            );
          }
          if (checkedMenu[i].children && checkedMenu[i].children !== []) {
            for (var j = 0; j < checkedMenu[i].children.length; j++) {
              if (
                "point" === checkedMenu[i].children[j].geotype &&
                "" !== checkedMenu[i].children[j].icon.trim() &&
                  checkedMenu[i].children[j].icon !== null
              ) {
                this.addSpatialQueryResultSet(
                  queryPolygonGeometry,
                  checkedMenu[i].children[j].alias,
                  checkedMenu[i].children[j].datasetname,
                  checkedMenu[i].children[j].sql,
                  checkedMenu[i].children[j].icon,
                  checkedMenu[i].children[j].mapPopField,
                  checkedMenu[i].children[j].mapPopName,
                  userDistrict
                );
              }
            }
          }
        }
      } else {
        // var url = "http://192.168.1.100:8090/iserver/services/map-world/rest/maps/World";
        // var url = MAP_CONFIG.measureurl;
        const type = e.features[0].geometry.type;
        var param = new SuperMap.MeasureParameters(e.features[0]);

        if ("LineString" === type) {
          // 添加线图层
          var coordinatesAry = e.features[0].geometry.coordinates;
          this.addDrawLineLayer(coordinatesAry);

          // console.log("e: " + CircularJSON.stringify(e));
          var __this = this;
          new MeasureService(MAP_CONFIG.measureurl).measureDistance(
            param,
            serviceResult => {
              var distance = serviceResult.result.distance;
              var unit = serviceResult.result.unit;
              if (distance > 10000) {
                distance = distance / 1000;
                if ("METER" === unit) {
                  unit = "千米";
                }
              } else {
                if ("METER" === unit) {
                  unit = "米";
                }
              }
              // 保留2位小数
              distance = Math.round(distance * 100) / 100;
              __this.measureMsg = "当前长度: " + distance + " " + unit;

              var x = 0;
              var y = 0;
              var coordinatesAry = e.features[0].geometry.coordinates;
              if (coordinatesAry.length > 0) {
                // for(var i=0;i<coordinatesAry.length;i++) {
                //   x += coordinatesAry[i][0];
                //   y += coordinatesAry[i][1];
                // }
                x = coordinatesAry[0][0];
                y = coordinatesAry[0][1];
                var lngLat = [];
                lngLat[0] = x;
                lngLat[1] = y;
                // $(".meter").css("transform", "translate(" + x + "px, " + y + "px)");

                var html =
                  '<div class="pop-measure">' + __this.measureMsg + "</div>";
                // 删除别的提示框
                var tipElArr = document.getElementsByClassName(
                  "mapboxgl-popup-close-button"
                );
                for (var i = 0; i < tipElArr.length; i++) {
                  tipElArr[i].click();
                }
                // 弹出提示框
                var popup = new mapboxgl.Popup({
                  closeOnClick: true
                });
                popup
                  .setLngLat(lngLat)
                  .setHTML(html)
                  .addTo(__this.map);
                this.map.setCenter([x, y]);
                $(".mapboxgl-popup").css({
                  "min-width": "1rem",
                  width: "1.2rem",
                  height: "0.6rem"
                });
                $(".pop-measure").css({
                  "padding-bottom": "0rem",
                  "line-height": "0.25rem"
                });
                $(".mapboxgl-popup-content").css({
                  "background-color": "rgba(0,47,87,0.9)",
                  "box-shadow": "rgb(46, 208, 255,0.4) 0px 0px 18px inset"
                });
              }
              // console.log("distance: " + distance);
              __this.previousDrawEvents = e;
            }
          );
        } else if ("Polygon" === type) {
          // 添加面图层
          var coordinatesAry = e.features[0].geometry.coordinates;
          this.addDrawPolygonLayer(coordinatesAry);

          // console.log("e: " + CircularJSON.stringify(e));
          var __this = this;
          new MeasureService(MAP_CONFIG.measureurl).measureArea(
            param,
            serviceResult => {
              // console.log(serviceResult)
              var area = serviceResult.result.area;
              var unit = serviceResult.result.unit;
              if (area > 100000000) {
                area = area / 1000000;
                if ("METER" === unit) {
                  unit = "平方千米";
                }
              } else if (area > 1000000) {
                area = area / 10000;
                if ("METER" === unit) {
                  unit = "公顷";
                }
              } else {
                if ("METER" === unit) {
                  unit = "平方米";
                }
              }
              // 保留2位小数
              var rounded_area = Math.round(area * 100) / 100;
              __this.measureMsg = "当前面积: " + rounded_area + " " + unit;

              var x = 0;
              var y = 0;
              var coordinatesAry = e.features[0].geometry.coordinates;
              if (coordinatesAry.length > 0) {
                let totalX = coordinatesAry[0].reduce((total, val) => {
                  console.log(val);
                  return (total += val[0]);
                }, 0);
                let totalY = coordinatesAry[0].reduce((total, val) => {
                  return (total += val[1]);
                }, 0);
                x = totalX / coordinatesAry[0].length;
                y = totalY / coordinatesAry[0].length;
                var lngLat = [];
                lngLat[0] = x;
                lngLat[1] = y;
                // $(".meter").css("transform", "translate(" + x + "px, " + y + "px)");

                var html =
                  '<div class="pop-measure">' + __this.measureMsg + "</div>";
                // 删除别的提示框
                var tipElArr = document.getElementsByClassName(
                  "mapboxgl-popup-close-button"
                );
                for (var i = 0; i < tipElArr.length; i++) {
                  tipElArr[i].click();
                }
                // 弹出提示框
                var popup = new mapboxgl.Popup({
                  closeOnClick: true
                });
                popup
                  .setLngLat(lngLat)
                  .setHTML(html)
                  .addTo(__this.map);
                this.map.setCenter([x, y]);
                $(".mapboxgl-popup").css({
                  "min-width": "1rem",
                  width: "1.2rem",
                  height: "0.6rem"
                });
                $(".pop-measure").css({
                  "padding-bottom": "0rem",
                  "line-height": "0.25rem"
                });
                $(".mapboxgl-popup-content").css({
                  "background-color": "rgba(0,47,87,0.9)",
                  "box-shadow": "rgb(46, 208, 255,0.4) 0px 0px 18px inset"
                });
              }
              __this.previousDrawEvents = e;
            }
          );
        } else if ("Point" === type) {
          if (this.analysisType === "aroundAnalysis") {
            // 获取圆心坐标，并记录
            var centerCoordinates = e.features[0].geometry.coordinates;
            // __this.showAroundRequestParam.center = centerCoordinates;
            this.showAroundRequestParam = {
              center: centerCoordinates,
              distance: "1000"
            };
            // console.log("centerCoordinates: " + CircularJSON.stringify(centerCoordinates));
            // 创建圆
            var circle = this.createCircle(centerCoordinates, 1000);
            // 查询
            this.map.setZoom(14);
            this.map.flyTo({
              center: centerCoordinates
            });
            var queryCoordinates = circle.geometry.coordinates;
            this.queryAround(circle, centerCoordinates, queryCoordinates, 1000);
            // 弹框切换到周边分析
            this.$parent.$refs.around.tabClick(0);
          } else if (this.analysisType === "nearAnalysis") {
            // 获取圆心坐标，并记录
            var centerCoordinates = e.features[0].geometry.coordinates;
            this.areaQueryCenterCoordinates = centerCoordinates;
            this.map.flyTo({
              center: this.areaQueryCenterCoordinates
            });
            if (this.map.getLayer("showAround_layer")) {
              this.map.removeLayer("showAround_layer");
            }

            this.$parent.$refs.around.showAnalyse();
            var userDistrict = this.userInfo.district;
            if (
              this.nearAnalysisList === [] ||
              this.nearAnalysisList.length === 0
            ) {
              var __this = this;
              getNearAnalysisList().then(res => {
                if (res === null) {
                  return;
                }
                // console.log('nearAnalysisList: ' + CircularJSON.stringify(res));
                __this.nearAnalysisList = res;
                __this.queryNearby(centerCoordinates, res, userDistrict, 3);
              });
            } else {
              // console.log('this.nearAnalysisList: ' + CircularJSON.stringify(this.nearAnalysisList));
              this.queryNearby(
                centerCoordinates,
                this.nearAnalysisList,
                userDistrict,
                3
              );
            }
          }
        }
      }
    },
    clearAroundAnalysisLayer() {
      //清除周边分析图层
      for (var i = 0; i < this.aroundAliasAry.length; i++) {
        if (this.map.getLayer(this.aroundAliasAry[i] + "_layer")) {
          this.map.removeLayer(this.aroundAliasAry[i] + "_layer");
        }
      }
      if (this.map.getLayer("showAround_layer")) {
        this.map.removeLayer("showAround_layer");
      }
      //清除数据
      this.$parent.$refs.around.selectValue = 1000;
      this.$parent.$refs.around.treeData = [];
      this.$parent.$refs.around.spaceTableData = {};
      this.$parent.$refs.around.closeTable();
    },
    clearNearbyAnalysisLayer() {
      //清除就近分析图层
      for (var i = 0; i < this.nearAliasAry.length; i++) {
        if (this.map.getLayer(this.nearAliasAry[i] + "_layer")) {
          this.map.removeLayer(this.nearAliasAry[i] + "_layer");
        }
        if (this.map.getLayer(this.nearAliasAry[i] + "_gaoliang_layer")) {
          this.map.removeLayer(this.nearAliasAry[i] + "_gaoliang_layer");
        }
      }
      //清除数据
      this.$parent.$refs.around.$refs.aroundAnalyse.inputValue = 3;
      this.$parent.$refs.around.$refs.aroundAnalyse.treeData = [];
      this.$parent.$refs.around.$refs.aroundAnalyse.spaceTableData = {};
      this.$parent.$refs.around.$refs.aroundAnalyse.closeTable();
    },
    //就近查询，外部组件调用
    queryNearbyBase(centerCoordinates, count) {
      //清除周边分析图层
      for (var i = 0; i < this.aroundAliasAry.length; i++) {
        if (this.map.getLayer(this.aroundAliasAry[i] + "_layer")) {
          this.map.removeLayer(this.aroundAliasAry[i] + "_layer");
        }
      }
      if (this.map.getLayer("showAround_layer")) {
        this.map.removeLayer("showAround_layer");
      }
      if (centerCoordinates === null || centerCoordinates.length === 0) {
        this.map.flyTo({
          center: this.areaQueryCenterCoordinates
        });
        //查询
        // console.log('centerCoordinates: ' + CircularJSON.stringify(this.areaQueryCenterCoordinates));
        var userDistrict = this.userInfo.district;
        if (
          this.nearAnalysisList === [] ||
          this.nearAnalysisList.length === 0
        ) {
          var __this = this;
          getNearAnalysisList().then(res => {
            if (res === null) {
              return;
            }
            // console.log('nearAnalysisList: ' + CircularJSON.stringify(res));
            __this.nearAnalysisList = res;
            __this.queryNearby(
              __this.areaQueryCenterCoordinates,
              res,
              userDistrict,
              count
            );
          });
        } else {
          // console.log('this.nearAnalysisList: ' + CircularJSON.stringify(this.nearAnalysisList));
          this.queryNearby(
            this.areaQueryCenterCoordinates,
            this.nearAnalysisList,
            userDistrict,
            count
          );
        }
      } else {
        this.map.flyTo({
          center: centerCoordinates
        });
        //查询
        // console.log('centerCoordinates: ' + CircularJSON.stringify(centerCoordinates));
        var userDistrict = this.userInfo.district;
        if (
          this.nearAnalysisList === [] ||
          this.nearAnalysisList.length === 0
        ) {
          var __this = this;
          getNearAnalysisList().then(res => {
            if (res === null) {
              return;
            }
            // console.log('nearAnalysisList: ' + CircularJSON.stringify(res));
            __this.nearAnalysisList = res;
            __this.queryNearby(centerCoordinates, res, userDistrict, count);
          });
        } else {
          // console.log('this.nearAnalysisList: ' + CircularJSON.stringify(this.nearAnalysisList));
          this.queryNearby(
            centerCoordinates,
            this.nearAnalysisList,
            userDistrict,
            count
          );
        }
      }
    },
    queryNearby(centerCoordinates, nearAnalysisLayers, userDistrict, count) {
      if (nearAnalysisLayers === null || nearAnalysisLayers.length === 0) {
        return;
      }
      // //清空数据集
      this.$parent.$refs.around.$refs.aroundAnalyse.allData = [];
      //查询
      this.nearestDistance = 0;
      for (var i = 0; i < nearAnalysisLayers.length; i++) {
        if (this.nearAliasAry.indexOf(nearAnalysisLayers[i].alias) < 0) {
          this.nearAliasAry.push(nearAnalysisLayers[i].alias);
        }
        this.addNearAnalysisResultSet(
          centerCoordinates,
          nearAnalysisLayers[i],
          userDistrict,
          count
        );
      }
    },
    addQueryCircleAreaLayer(circle) {
      // 画圆
      if (!this.map.getSource("showAround_source")) {
        this.map.addSource("showAround_source", {
          type: "geojson",
          data: circle
        });
      } else {
        this.map.getSource("showAround_source").setData(circle);
      }
      this.removeLayer("showAround_layer");
      this.map.addLayer({
        id: "showAround_layer",
        type: "fill",
        source: "showAround_source",
        paint: {
          "fill-outline-color": "#00fff2",
          "fill-color": "rgba(0, 53, 53, 0.2)"
        }
      });
    },
    addNearAnalysisResultSet(
      centerCoordinates,
      nearAnalysisLayer,
      userDistrict,
      count
    ) {
      var options = { units: "meters" };
      var fromPoint = point(centerCoordinates);
      var sqlParam = {};
      if ("3303" === userDistrict) {
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: nearAnalysisLayer.alias,
            attributeFilter: "SHARED is null AND " + nearAnalysisLayer.sqlText
          },
          datasetNames: [nearAnalysisLayer.datasetname],
          fromIndex: 0,
          toIndex: 99999,
          maxFeatures: 100000
        });
      } else {
        var attributeFilterSql =
          "DISTRICT_CODE='" +
          userDistrict +
          "' AND (" +
          nearAnalysisLayer.sqlText +
          ")";
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: nearAnalysisLayer.alias,
            attributeFilter: attributeFilterSql
          },
          datasetNames: [nearAnalysisLayer.datasetname],
          fromIndex: 0,
          toIndex: 99999,
          maxFeatures: 100000
        });
      }

      var __this = this;
      // 创建任意几何范围查询实例
      new FeatureService(nearAnalysisLayer.url).getFeaturesBySQL(
        sqlParam,
        function(serviceResult) {
          if (serviceResult && serviceResult.result) {
            //获取服务器返回的结果
            var features = serviceResult.result.features;
            //设置总数据源
            if (
              !__this.map.getSource(nearAnalysisLayer.alias + "_all_source")
            ) {
              __this.map.addSource(nearAnalysisLayer.alias + "_all_source", {
                type: "geojson",
                data: features
              });
            } else {
              __this.map
                .getSource(nearAnalysisLayer.alias + "_all_source")
                .setData(features);
            }
            //计算距离
            for (var i = 0; i < features.features.length; i++) {
              var eachCoordinates = features.features[i].geometry.coordinates;
              var toPoint = point(eachCoordinates);
              var distanceFromCenter = distance(fromPoint, toPoint, options);
              distanceFromCenter = Math.round(distanceFromCenter * 10) / 10;
              features.features[
                i
              ].properties.distanceFromCenter = distanceFromCenter;
              features.features[i].properties.alias = nearAnalysisLayer.alias;
              features.features[i].properties.icon = nearAnalysisLayer.iconUrl;
              features.features[
                i
              ].properties._mapPopField = nearAnalysisLayer.mapPopField.split(
                ","
              );
              features.features[
                i
              ].properties._mapPopName = nearAnalysisLayer.mapPopName.split(
                ","
              );
            }
            //排序
            var temp = {};
            for (var i = 0; i < features.features.length - 1; i++) {
              for (var j = 0; j < features.features.length - i - 1; j++) {
                if (
                  features.features[j].properties.distanceFromCenter >
                  features.features[j + 1].properties.distanceFromCenter
                ) {
                  temp = features.features[j];
                  features.features[j] = features.features[j + 1];
                  features.features[j + 1] = temp;
                }
              }
            }
            // console.log('features:' + CircularJSON.stringify(features));
            //设置查询的数据源、图层
            var featureAry = [];
            for (var i = 0; i < count; i++) {
              if (i === features.features.length) {
                break;
              }
              featureAry.push(features.features[i]);
              if (
                features.features[i].properties.distanceFromCenter >
                __this.nearestDistance
              ) {
                __this.nearestDistance =
                  features.features[i].properties.distanceFromCenter;
              }
            }
            var features2 = { type: "FeatureCollection", features: featureAry };
            if (!__this.map.getSource(nearAnalysisLayer.alias + "_source")) {
              __this.map.addSource(nearAnalysisLayer.alias + "_source", {
                type: "geojson",
                data: features2
              });
            } else {
              __this.map
                .getSource(nearAnalysisLayer.alias + "_source")
                .setData(features2);
            }
            //给选择框组件传数据
            let eachData = {};
            eachData.count = count;
            eachData.mapData = features2;
            // console.log('eachData1: ' + CircularJSON.stringify(eachData));
            __this.$parent.$refs.around.$refs.aroundAnalyse.data = eachData;
            // __this.$emit("nearData", eachData);

            if (
              __this.loadedLayer.indexOf(nearAnalysisLayer.alias + "_layer") >=
              0
            ) {
              if (__this.map.getLayer(nearAnalysisLayer.alias + "_layer")) {
                __this.map.removeLayer(nearAnalysisLayer.alias + "_layer");
              }
              if (
                __this.map.getLayer(nearAnalysisLayer.alias + "_gaoliang_layer")
              ) {
                __this.map.removeLayer(
                  nearAnalysisLayer.alias + "_gaoliang_layer"
                );
              }
              __this.map.addLayer(
                {
                  id: nearAnalysisLayer.alias + "_layer",
                  type: "symbol",
                  source: nearAnalysisLayer.alias + "_source",
                  layout: {
                    "icon-image": nearAnalysisLayer.alias + "_Point",
                    "icon-size": 0.8,
                    "icon-allow-overlap": true
                  }
                },
                "wz_boundary_layer"
              );
              __this.map.addLayer(
                {
                  id: nearAnalysisLayer.alias + "_gaoliang_layer",
                  type: "symbol",
                  source: nearAnalysisLayer.alias + "_source",
                  layout: {
                    "icon-image": "gaoliang_Point",
                    "icon-size": 0.8,
                    "icon-allow-overlap": true
                  }
                },
                "wz_boundary_layer"
              );
              // __this.nearestDistance = Math.round(__this.nearestDistance) + 1;
              // var circle = __this.createCircle(centerCoordinates, __this.nearestDistance);
              // __this.addQueryCircleAreaLayer(circle);
            } else {
              __this.loadedLayer.push(nearAnalysisLayer.alias + "_layer");

              __this.map.loadImage(nearAnalysisLayer.iconUrl, function(
                error,
                image
              ) {
                if (error) {
                  console.log("error: " + error);
                }
                if (!__this.map.hasImage(nearAnalysisLayer.alias + "_Point")) {
                  __this.map.addImage(
                    nearAnalysisLayer.alias + "_Point",
                    image
                  );
                }
                if (__this.map.getLayer(nearAnalysisLayer.alias + "_layer")) {
                  __this.map.removeLayer(nearAnalysisLayer.alias + "_layer");
                }
                if (
                  __this.map.getLayer(
                    nearAnalysisLayer.alias + "_gaoliang_layer"
                  )
                ) {
                  __this.map.removeLayer(
                    nearAnalysisLayer.alias + "_gaoliang_layer"
                  );
                }
                __this.map.addLayer(
                  {
                    id: nearAnalysisLayer.alias + "_layer",
                    type: "symbol",
                    source: nearAnalysisLayer.alias + "_source",
                    layout: {
                      "icon-image": nearAnalysisLayer.alias + "_Point",
                      "icon-size": 0.8,
                      "icon-allow-overlap": true
                    }
                  },
                  "wz_boundary_layer"
                );
                __this.map.addLayer(
                  {
                    id: nearAnalysisLayer.alias + "_gaoliang_layer",
                    type: "symbol",
                    source: nearAnalysisLayer.alias + "_source",
                    layout: {
                      "icon-image": "gaoliang_Point",
                      "icon-size": 0.8,
                      "icon-allow-overlap": true
                    }
                  },
                  "wz_boundary_layer"
                );
                // __this.nearestDistance = Math.round(__this.nearestDistance) + 1;
                // var circle = __this.createCircle(centerCoordinates, __this.nearestDistance);
                // __this.addQueryCircleAreaLayer(circle);
              });
              __this.map.on(
                "click",
                nearAnalysisLayer.alias + "_layer",
                function(e) {
                  // 详细信息处理
                  e.features[0].properties.refresh = false;
                  __this.$emit("setonePoint", e.features[0].properties);
                  var feature = e.features[0];
                  // console.log("feature: " + CircularJSON.stringify(feature));
                  var mapPopName = nearAnalysisLayer.mapPopName.split(",");
                  var mapPopField = nearAnalysisLayer.mapPopField.split(",");
                  var longitude = feature.geometry.coordinates[0];
                  var latitude = feature.geometry.coordinates[1];
                  var lngLat = {
                    lng: Number(longitude),
                    lat: Number(latitude)
                  };
                  //处理大小写情况
                  for (var i = 0; i < mapPopField.length; i++) {
                    mapPopField[i] = mapPopField[i].toUpperCase();
                  }
                  // 拼接地图气泡
                  var str = "";
                  for (var i = 1; i < mapPopField.length; i++) {
                    str += `<div><span>${mapPopName[i]}：</span><p>${
                      feature.properties[mapPopField[i]] != undefined &&
                      feature.properties[mapPopField[i]].trim() != ""
                        ? feature.properties[mapPopField[i]]
                        : "暂无数据"
                    }</p></div>`;
                  }
                  __this.areaQueryCenterCoordinates =
                    feature.geometry.coordinates;

                  if (
                    feature.properties.GUID != "" &&
                    feature.properties.GUID != null
                  ) {
                    var html = `<div class="pop-tip">
                                    <p class="">${
                                      feature.properties[mapPopField[0]]
                                        ? feature.properties[mapPopField[0]]
                                        : "暂无数据"
                                    }</p>
                                    ${str}
                                    <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                                    <span class="pop-tip-list" onclick="showInfoCamera()"><img src="./static/gitimage/other/camera_white.png"></span>
                                    <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                                    <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                                </div>`;
                  } else {
                    var html = `<div class="pop-tip">
                                    <p class="">${
                                      feature.properties[mapPopField[0]]
                                        ? feature.properties[mapPopField[0]]
                                        : "暂无数据"
                                    }</p>
                                    ${str}
                                    <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                                    <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                                    <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                                </div>`;
                  }
                  // 删除别的提示框
                  var tipElArr = document.getElementsByClassName(
                    "mapboxgl-popup-close-button"
                  );
                  for (var i = 0; i < tipElArr.length; i++) {
                    tipElArr[i].click();
                  }
                  // 弹出提示框
                  var popup = new mapboxgl.Popup({
                    closeOnClick: true
                  });
                  popup
                    .setLngLat(lngLat)
                    .setHTML(html)
                    .addTo(__this.map);
                }
              );
            }
          }
        }
      );
    },
    addSpatialQueryResultSet(
      queryPolygonGeometry,
      alias,
      datasetname,
      sql,
      icon,
      mapPopField,
      mapPopName,
      userDistrict
    ) {
      var coordinatesAry = queryPolygonGeometry.coordinates;
      var searchWithin = polygon(coordinatesAry);

      var sqlParam = {};
      if ("3303" === userDistrict) {
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: alias,
            attributeFilter: "SHARED is null AND " + sql
          },
          datasetNames: [datasetname],
          fromIndex: 0,
          toIndex: 99999,
          maxFeatures: 100000
        });
      } else {
        var attributeFilterSql =
          "DISTRICT_CODE='" + userDistrict + "' AND (" + sql + ")";
        // geometryParam = new SuperMap.GetFeaturesByGeometryParameters({
        //     attributeFilter: attributeFilterSql,
        //     datasetNames: [datasetname],
        //     geometry: queryPolygonGeometry,
        //     spatialQueryMode: "INTERSECT",
        //     fromIndex: 0,
        //     toIndex: 99999,
        //     maxFeatures: 100000
        // });
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: alias,
            attributeFilter: attributeFilterSql
          },
          datasetNames: [datasetname],
          fromIndex: 0,
          toIndex: 99999,
          maxFeatures: 100000
        });
      }

      var __this = this;
      // 创建任意几何范围查询实例
      new FeatureService(this.dataUrl).getFeaturesBySQL(sqlParam, function(
        serviceResult
      ) {
        if (serviceResult && serviceResult.result) {
          // 获取服务器返回的结果
          var features = serviceResult.result.features;
          var featuresAry = [];
          // 筛选出在多边形区域内的点
          for (var i = 0; i < features.features.length; i++) {
            var currentPoint = point(features.features[i].geometry.coordinates);
            var ptsWithin = pointsWithinPolygon(currentPoint, searchWithin);
            if (ptsWithin.features.length > 0) {
              featuresAry.push(features.features[i]);
            }
          }
          features = { type: "FeatureCollection", features: featuresAry };

          for (var i = 0; i < features.features.length; i++) {
            features.features[i].properties.icon = icon;
            features.features[i].properties._mapPopField = mapPopField;
            features.features[i].properties._mapPopName = mapPopName;
          }
          // console.log('features:' + CircularJSON.stringify(features));
          let eachData = {};
          eachData.menuData = __this.data;
          eachData.mapData = features;
          __this.$emit("spaceData", eachData);
          // __this.previousDrawEvents = e;
        }
      });
    },
    addDrawLineLayer(coordinatesAry) {
      document.getElementsByClassName("mapbox-gl-draw_trash")[0].click();
      var dataFeature = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coordinatesAry
        }
      };
      if (!this.map.getSource("drawLine_source")) {
        this.map.addSource("drawLine_source", {
          type: "geojson",
          data: dataFeature
        });
      } else {
        this.map.getSource("drawLine_source").setData(dataFeature);
      }
      this.removeLayer("drawLine_layer");
      this.map.addLayer({
        id: "drawLine_layer",
        type: "line",
        source: "drawLine_source",
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "#0066e1",
          "line-width": 3
        }
      });
    },
    addDrawPolygonLayer(coordinatesAry) {
      document.getElementsByClassName("mapbox-gl-draw_trash")[0].click();
      var dataFeature = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: coordinatesAry
        }
      };
      if (!this.map.getSource("drawPolygon_source")) {
        this.map.addSource("drawPolygon_source", {
          type: "geojson",
          data: dataFeature
        });
      } else {
        this.map.getSource("drawPolygon_source").setData(dataFeature);
      }
      this.removeLayer("drawPolygon_layer");
      this.map.addLayer({
        id: "drawPolygon_layer",
        type: "line",
        source: "drawPolygon_source",
        // 'paint': {
        //     'fill-outline-color': 'blue'
        // }
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "#0066e1",
          "line-width": 3
        }
      });
    },
    addDistrictStreetFromServer(url, alias, datasetname, sql) {
      var __this = this;
      var sqlParam = {};
      if (alias === "district") {
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: alias,
            attributeFilter: sql
          },
          datasetNames: [datasetname],
          fromIndex: 0,
          toIndex: 999,
          maxFeatures: 1000
        });
      } else if (alias === "street") {
        var userDistrict = this.userInfo.district;
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: alias,
            attributeFilter: sql + " AND DISTRICT_CODE='" + userDistrict + "'"
          },
          datasetNames: [datasetname],
          fromIndex: 0,
          toIndex: 999,
          maxFeatures: 1000
        });
      }

      new FeatureService(url).getFeaturesBySQL(sqlParam, function(
        serviceResult
      ) {
        if (serviceResult && serviceResult.result) {
          var features = serviceResult.result.features;
          if ("district" === alias) {
            __this.baseMapDistrictFeatures = features.features;
            __this.isLoadBoundryData = true;
          } else if ("street" === alias) {
            __this.baseMapStreetFeatures = features.features;
            for (var i = 0; i < __this.baseMapStreetFeatures.length; i++) {
              __this.currentTowns.push(
                __this.baseMapStreetFeatures[i].properties.TOWN
              );
            }
          }
        }
      });
    },
    // 添加点要素数据图层 散点图
    addScatterLayerFromServer(url, alias, icon, datasetname, sql, geotype) {
      if ("point" === geotype) {
        if ("" === icon || "" === icon.trim() || icon === null) {
          return;
        }
        var __this = this;
        var userDistrict = __this.userInfo.district;
        var sqlParam = {};
        if ("3303" === userDistrict) {
          sqlParam = new SuperMap.GetFeaturesBySQLParameters({
            queryParameter: {
              name: alias,
              attributeFilter: "SHARED is null AND " + sql
            },
            datasetNames: [datasetname],
            fromIndex: 0,
            toIndex: 99999,
            maxFeatures: 100000
          });
        } else {
          var attributeFilterSql = "";
          if ("" === sql) {
            attributeFilterSql = "DISTRICT_CODE='" + userDistrict + "'";
          } else {
            attributeFilterSql =
              "DISTRICT_CODE='" + userDistrict + "' AND " + sql;
          }
          sqlParam = new SuperMap.GetFeaturesBySQLParameters({
            queryParameter: {
              name: alias,
              attributeFilter: attributeFilterSql
            },
            datasetNames: [datasetname],
            fromIndex: 0,
            toIndex: 99999,
            maxFeatures: 100000
          });
        }

        new FeatureService(url).getFeaturesBySQL(sqlParam, function(
          serviceResult
        ) {
          // console.log("serviceResult: " + CircularJSON.stringify(serviceResult));
          if (serviceResult && serviceResult.result) {
            var features = serviceResult.result.features;
            // console.log("features: " + CircularJSON.stringify(features));

            if (!__this.map.getSource(alias + "_source")) {
              __this.map.addSource(alias + "_source", {
                type: "geojson",
                data: features
                // cluster: true,
                // clusterMaxZoom: 8, // Max zoom to cluster points on
                // clusterRadius: 50
              });
            } else {
              __this.map.getSource(alias + "_source").setData(features);
            }

            if (__this.loadedLayer.indexOf(alias + "_layer") >= 0) {
              if (__this.map.getLayer(alias + "_layer")) {
                __this.map.removeLayer(alias + "_layer");
              }
              __this.map.addLayer(
                {
                  id: alias + "_layer",
                  type: "symbol",
                  source: alias + "_source",
                  layout: {
                    "icon-image": alias + "_Point",
                    "icon-size": 0.6,
                    "icon-allow-overlap": true
                  }
                },
                "wz_boundary_layer"
              );
              // 判断当前图层是否还是散点图，或者是聚合图的15级及以上
              var zoomLevel = __this.map.getZoom();
              if (
                __this.currentMapType === "fourcolorMap" ||
                (__this.currentMapType === "juhe" && zoomLevel <= 14)
              ) {
                __this.removeLayer(alias + "_layer");
                return;
              }

              // 判断菜单是否还勾选，若没勾选则去除图层
              var isChecked = false;
              var checkedMenu = __this.data.allCheckData;
              // console.log('checkedMenu:' + CircularJSON.stringify(checkedMenu));
              for (var i = 0; i < checkedMenu.length; i++) {
                if (checkedMenu[i].alias === alias) {
                  isChecked = true;
                  break;
                }
                //有子菜单的情况
                if (checkedMenu[i].children && checkedMenu[i].children !== []) {
                  for (var j = 0; j < checkedMenu[i].children.length; j++) {
                    if (checkedMenu[i].children[j].alias === alias) {
                      isChecked = true;
                      break;
                    }
                  }
                }
              }
              if (!isChecked) {
                __this.removeLayer(alias + "_layer");
              }
            } else {
              __this.loadedLayer.push(alias + "_layer");

              __this.map.loadImage(icon, function(error, image) {
                if (error) {
                  console.log("error: " + error);
                }
                if (!__this.map.hasImage(alias + "_Point")) {
                  __this.map.addImage(alias + "_Point", image);
                }
                if (__this.map.getLayer(alias + "_layer")) {
                  __this.map.removeLayer(alias + "_layer");
                }
                __this.map.addLayer(
                  {
                    id: alias + "_layer",
                    type: "symbol",
                    source: alias + "_source",
                    layout: {
                      "icon-image": alias + "_Point",
                      "icon-size": 0.6,
                      "icon-allow-overlap": true
                    }
                  },
                  "wz_boundary_layer"
                );
                // 判断当前图层是否还是散点图，或者是聚合图的15级及以上
                var zoomLevel = __this.map.getZoom();
                if (
                  __this.currentMapType === "fourcolorMap" ||
                  (__this.currentMapType === "juhe" && zoomLevel <= 14)
                ) {
                  __this.removeLayer(alias + "_layer");
                  return;
                }

                // 判断菜单是否还勾选，若没勾选则去除图层
                var isChecked = false;
                var checkedMenu = __this.data.allCheckData;
                // console.log('checkedMenu:' + CircularJSON.stringify(checkedMenu));
                for (var i = 0; i < checkedMenu.length; i++) {
                  if (checkedMenu[i].alias === alias) {
                    isChecked = true;
                    break;
                  }
                  //有子菜单的情况
                  if (
                    checkedMenu[i].children &&
                    checkedMenu[i].children !== []
                  ) {
                    for (var j = 0; j < checkedMenu[i].children.length; j++) {
                      if (checkedMenu[i].children[j].alias === alias) {
                        isChecked = true;
                        break;
                      }
                    }
                  }
                }
                if (!isChecked) {
                  __this.removeLayer(alias + "_layer");
                }
              });
              __this.map.on("click", alias + "_layer", function(e) {
                // console.log('alias: ' + alias);
                // 详细信息处理
                e.features[0].properties.refresh = false;
                __this.$emit("setonePoint", e.features[0].properties);
                var feature = e.features[0];
                // console.log("feature: " + CircularJSON.stringify(feature));
                var layname = feature.layer.id;
                layname = layname.substring(0, layname.length - 6);

                if (
                  alias === "STSK/YLJSD_ST" ||
                  alias === "STSK/YLJSD_SK" ||
                  alias === "STSK/YLJSD_JSD" ||
                  alias === "YJDW_GGJYDW" ||
                  alias === "ZRZH_DZZHYHD"
                ) {
                  if (!__this.map.getSource(alias + "_source_1")) {
                    __this.map.addSource(alias + "_source_1", {
                      type: "geojson",
                      data: feature
                    });
                  } else {
                    __this.map.getSource(alias + "_source_1").setData(feature);
                  }
                  if (__this.map.getLayer("highlight_layer")) {
                    __this.map.removeLayer("highlight_layer");
                  }
                  __this.map.addLayer({
                    id: "highlight_layer",
                    type: "symbol",
                    source: alias + "_source_1",
                    layout: {
                      "icon-image": alias + "_Point_1",
                      "icon-size": 0.8,
                      "icon-allow-overlap": true
                    }
                  });
                }

                var showField = [];
                var mapPopName = [];
                var mapPopField = [];
                var checkedMenu = __this.data.allCheckData;
                for (var i = 0; i < checkedMenu.length; i++) {
                  if (
                    "point" === checkedMenu[i].geotype &&
                    "" !== checkedMenu[i].icon.trim() &&
                      checkedMenu[i].icon !== null
                  ) {
                    if (layname === checkedMenu[i].alias) {
                      showField = checkedMenu[i].showField;
                      mapPopName = checkedMenu[i].mapPopName;
                      mapPopField = checkedMenu[i].mapPopField;
                      break;
                    }
                  }
                  // 有子菜单的情况
                  if (
                    checkedMenu[i].children &&
                    checkedMenu[i].children !== []
                  ) {
                    for (var j = 0; j < checkedMenu[i].children.length; j++) {
                      var childrenData = checkedMenu[i].children[j];
                      if (
                        "point" === childrenData.geotype &&
                        "" !== childrenData.icon.trim() &&
                          childrenData.icon !== null
                      ) {
                        if (layname === childrenData.alias) {
                          showField = childrenData.showField;
                          mapPopName = childrenData.mapPopName;
                          mapPopField = childrenData.mapPopField;
                          break;
                        }
                      }
                    }
                  }
                }
                //处理大小写情况
                for (var i = 0; i < mapPopField.length; i++) {
                  mapPopField[i] = mapPopField[i].toUpperCase();
                }

                var longitude = feature.geometry.coordinates[0];
                var latitude = feature.geometry.coordinates[1];
                var lngLat = { lng: Number(longitude), lat: Number(latitude) };
                // 拼接地图气泡
                var str = "";
                for (var i = 1; i < mapPopField.length; i++) {
                  if (mapPopField[i] === "FIND_TIME") {
                    feature.properties[mapPopField[i]] = feature.properties[
                      mapPopField[i]
                    ].replace(/\//g, "-");
                  }
                  str += `<div><span>${mapPopName[i]}：</span><p>${
                    feature.properties[mapPopField[i]] != undefined &&
                    feature.properties[mapPopField[i]].trim() != ""
                      ? feature.properties[mapPopField[i]]
                      : "暂无数据"
                  }</p></div>`;
                }

                __this.showAroundRequestParam = {
                  center: feature.geometry.coordinates,
                  distance: "1000"
                };
                __this.areaQueryCenterCoordinates =
                  feature.geometry.coordinates;

                if (
                  e.features[0].properties.GUID != "" &&
                  e.features[0].properties.GUID != null
                ) {
                  var html = `<div class="pop-tip">
                                <p class="">${
                                  feature.properties[mapPopField[0]]
                                    ? feature.properties[mapPopField[0]]
                                    : "暂无数据"
                                }</p>
                                ${str}
                                <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                                <span class="pop-tip-list" onclick="showInfoCamera()"><img src="./static/gitimage/other/camera_white.png"></span>
                                <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                                <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                            </div>`;
                } else {
                  var html = `<div class="pop-tip">
                                <p class="">${
                                  feature.properties[mapPopField[0]]
                                    ? feature.properties[mapPopField[0]]
                                    : "暂无数据"
                                }</p>
                                ${str}
                                <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                                <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                                <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                            </div>`;
                }
                // 删除别的提示框
                var tipElArr = document.getElementsByClassName(
                  "mapboxgl-popup-close-button"
                );
                for (var i = 0; i < tipElArr.length; i++) {
                  tipElArr[i].click();
                }
                // 弹出提示框
                var popup = new mapboxgl.Popup({
                  closeOnClick: true
                });
                popup
                  .setLngLat(lngLat)
                  .setHTML(html)
                  .addTo(__this.map);
              });
            }

            __this.map.on("zoomend", function(e) {
              var zoomLevel = __this.map.getZoom();
              // 15级及以上，显示注记图层
              if (zoomLevel && zoomLevel >= 15) {
                // 如果图层不存在，则直接返回
                if (!__this.map.getLayer(alias + "_layer")) {
                  return;
                }

                if (!__this.map.getSource(alias + "_notesource")) {
                  __this.map.addSource(alias + "_notesource", {
                    type: "geojson",
                    data: features
                  });
                } else {
                  __this.map.getSource(alias + "_notesource").setData(features);
                }

                __this.removeLayer(alias + "_notelayer");
                var currentBaseMap = __this.basemapTiles;
                switch (currentBaseMap) {
                  case "standard-raster":
                    __this.map.addLayer({
                      id: alias + "_notelayer",
                      type: "symbol",
                      source: alias + "_notesource",
                      layout: {
                        "text-field": "{NAME}",
                        "text-font": [
                          "DIN Offc Pro Bold",
                          "Arial Unicode MS Bold"
                        ],
                        "text-offset": [0, 2],
                        "text-size": 15,
                        "text-max-width": 18
                      },
                      paint: {
                        "text-color": "#00d8ff",
                        "text-halo-width": 1,
                        "text-halo-color": "rgba(0, 0, 0, 1)"
                      }
                    });
                    break;
                  case "bigdata-vectortile":
                    __this.map.addLayer({
                      id: alias + "_notelayer",
                      type: "symbol",
                      source: alias + "_notesource",
                      layout: {
                        "text-field": "{NAME}",
                        "text-font": [
                          "DIN Offc Pro Bold",
                          "Arial Unicode MS Bold"
                        ],
                        "text-offset": [0, 2],
                        "text-size": 15,
                        "text-max-width": 18
                      },
                      paint: {
                        // "text-color": "#FFFAFA"
                        "text-color": "#00d8ff",
                        "text-halo-width": 1,
                        "text-halo-color": "rgba(0, 0, 0, 1)"
                      }
                    });
                    break;
                  default:
                    __this.map.addLayer({
                      id: alias + "_notelayer",
                      type: "symbol",
                      source: alias + "_notesource",
                      layout: {
                        "text-field": "{NAME}",
                        "text-font": [
                          "DIN Offc Pro Bold",
                          "Arial Unicode MS Bold"
                        ],
                        "text-offset": [0, 2],
                        "text-size": 15,
                        "text-max-width": 18
                      },
                      paint: {
                        "text-color": "#00d8ff",
                        "text-halo-width": 1,
                        "text-halo-color": "rgba(0, 0, 0, 1)"
                      }
                    });
                    break;
                }
              } else {
                __this.removeLayer(alias + "_notelayer");
              }
            });
          }
        });
      } else if ("line" == geotype || "polygon" == geotype) {
        this.addLineOrPolygonFromServer(url, alias, geotype);
      }
    },
    queryPolygonDataServer(
      coordinatesAry,
      url,
      alias,
      icon,
      datasetname,
      sql,
      mapPopName,
      mapPopField
    ) {
      var currentPoint = point(coordinatesAry);
      var __this = this;
      var userDistrict = __this.userInfo.district;
      var sqlParam = {};
      if ("3303" === userDistrict) {
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: alias,
            attributeFilter: sql
          },
          datasetNames: [datasetname],
          fromIndex: 0,
          toIndex: 99999,
          maxFeatures: 100000
        });
      } else {
        var attributeFilterSql = "";
        if ("" === sql) {
          attributeFilterSql = "DISTRICT_CODE='" + userDistrict + "'";
        } else {
          attributeFilterSql =
            "DISTRICT_CODE='" + userDistrict + "' AND " + sql;
        }
        sqlParam = new SuperMap.GetFeaturesBySQLParameters({
          queryParameter: {
            name: alias,
            attributeFilter: attributeFilterSql
          },
          datasetNames: [datasetname],
          fromIndex: 0,
          toIndex: 99999,
          maxFeatures: 100000
        });
      }

      new FeatureService(this.dataUrl).getFeaturesBySQL(sqlParam, function(
        serviceResult
      ) {
        // console.log("serviceResult: " + CircularJSON.stringify(serviceResult));
        if (serviceResult && serviceResult.result) {
          var features = serviceResult.result.features;
          // console.log("features: " + CircularJSON.stringify(features));
          for (var i = 0; i < features.features.length; i++) {
            var eachCoordinatesAry =
              features.features[i].geometry.coordinates[0];
            var searchWithin = polygon(eachCoordinatesAry);
            var ptsWithin = pointsWithinPolygon(currentPoint, searchWithin);
            if (ptsWithin.features.length > 0) {
              //信息详情
              features.features[i].properties.refresh = false;
              __this.$emit("setonePoint", features.features[i].properties);
              // console.log('在面内')
              var feature = features.features[i];
              //处理大小写情况
              for (var j = 0; j < mapPopField.length; j++) {
                mapPopField[j] = mapPopField[j].toUpperCase();
              }

              var coordinates = feature.geometry.coordinates[0][0];
              var count = coordinates.length;
              var longitude = 0;
              var latitude = 0;
              for (var j = 0; j < count; j++) {
                longitude += coordinates[j][0];
                latitude += coordinates[j][1];
              }
              longitude = longitude / count;
              latitude = latitude / count;
              var lngLat = { lng: longitude, lat: latitude };
              // 拼接地图气泡
              var str = "";
              for (var j = 1; j < mapPopField.length; j++) {
                if (mapPopField[j] === "FIND_TIME") {
                  feature.properties[mapPopField[j]] = feature.properties[
                    mapPopField[j]
                  ].replace(/\//g, "-");
                }
                str += `<div><span>${mapPopName[j]}：</span><p>${
                  feature.properties[mapPopField[j]] != undefined &&
                  feature.properties[mapPopField[j]].trim() != ""
                    ? feature.properties[mapPopField[j]]
                    : "暂无数据"
                }</p></div>`;
              }

              __this.showAroundRequestParam = {
                center: [longitude, latitude],
                distance: "1000"
              };
              __this.areaQueryCenterCoordinates = [longitude, latitude];
              var html = `<div class="pop-tip">
                                <p class="">${
                                  feature.properties[mapPopField[0]]
                                    ? feature.properties[mapPopField[0]]
                                    : "暂无数据"
                                }</p>
                                ${str}
                                <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                                <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                                <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                            </div>`;
              // 弹出提示框
              var popup = new mapboxgl.Popup({
                closeOnClick: true
              });
              popup
                .setLngLat(lngLat)
                .setHTML(html)
                .addTo(__this.map);
            }
          }
        }
      });
    },
    // 添加线、面要素图层
    addLineOrPolygonFromServer(url, alias, geotype) {
      if (this.map.getLayer(alias + "_layer")) {
        this.map.removeLayer(alias + "_layer");
      }
      if (this.map.getSource(alias + "_source")) {
        this.map.removeSource(alias + "_source");
      }
      this.map.addSource(alias + "_source", {
        type: "raster",
        tiles: [url],
        tileSize: 256,
        rasterSource: "iserver"
      });
      this.map.addLayer(
        {
          id: alias + "_layer",
          type: "raster",
          source: alias + "_source"
        },
        "wz_boundary_layer"
      );
      // 判断当前图层是否还是散点图，或者是聚合图的15级及以上
      var zoomLevel = this.map.getZoom();
      if (this.currentMapType === "fourcolorMap") {
        this.removeLayer(alias + "_layer");
        return;
      }
      this.addLineOrPolygonLegend();
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
        fromIndex: 0,
        toIndex: 99999,
        maxFeatures: 100000
      });
      new FeatureService(url).getFeaturesBySQL(sqlParam, function(
        serviceResult
      ) {
        if (serviceResult && serviceResult.result) {
          var features = serviceResult.result.features;
          let emitData = JSON.parse(JSON.stringify(__this.data));
          emitData.mapData = features;
          __this.$emit("data", emitData);
        }
      });
    },
    // 删除要素图层
    removeLayer(layname) {
      if (this.map.getLayer(layname)) {
        this.map.removeLayer(layname);
      }
    },
    // 删除四色图层
    removeFourcolorLayer(alias) {
      // 删除数据源
      if (!this.map.getSource(alias + "_level1" + "_source")) {
        this.map.removeSource(alias + "_level1" + "_source");
      }
      if (!this.map.getSource(alias + "_level2" + "_source")) {
        this.map.removeSource(alias + "_level2" + "_source");
      }
      if (!this.map.getSource(alias + "_level3" + "_source")) {
        this.map.removeSource(alias + "_level3" + "_source");
      }
      if (!this.map.getSource(alias + "_level4" + "_source")) {
        this.map.removeSource(alias + "_level4" + "_source");
      }

      // 删除图层
      if (this.map.getLayer(alias + "_level1" + "_layer")) {
        this.map.removeLayer(alias + "_level1" + "_layer");
      }
      if (this.map.getLayer(alias + "_level2" + "_layer")) {
        this.map.removeLayer(alias + "_level2" + "_layer");
      }
      if (this.map.getLayer(alias + "_level3" + "_layer")) {
        this.map.removeLayer(alias + "_level3" + "_layer");
      }
      if (this.map.getLayer(alias + "_level4" + "_layer")) {
        this.map.removeLayer(alias + "_level4" + "_layer");
      }

      // 设置四色图图例
      for (var i = 0; i < this.fourColorLevel1.length; i++) {
        // console.log('this.fourColorLevel1: ' + CircularJSON.stringify(this.fourColorLevel1));
        if (this.fourColorLevel1[i].properties.ALIAS === alias) {
          this.fourColorLevel1.splice(i, 1);
          i--;
        }
      }
      for (var i = 0; i < this.fourColorLevel2.length; i++) {
        if (this.fourColorLevel2[i].properties.ALIAS === alias) {
          this.fourColorLevel2.splice(i, 1);
          i--;
        }
      }
      for (var i = 0; i < this.fourColorLevel3.length; i++) {
        if (this.fourColorLevel3[i].properties.ALIAS === alias) {
          this.fourColorLevel3.splice(i, 1);
          i--;
        }
      }
      for (var i = 0; i < this.fourColorLevel4.length; i++) {
        if (this.fourColorLevel4[i].properties.ALIAS === alias) {
          this.fourColorLevel4.splice(i, 1);
          i--;
        }
      }
    },
    hideLayer(layname) {
      if (this.map.getLayer(layname)) {
        this.map.setLayoutProperty(layname, "visibility", "none");
      }
    },
    showLayer(layname) {
      this.map.setLayoutProperty(layname, "visibility", "visible");
    },
    createColor16() {
      var r = Math.floor(Math.random() * 256);
      var g = Math.floor(Math.random() * 256);
      var b = Math.floor(Math.random() * 256);
      var rStr =
        r.toString(16).length < 2 ? "1" + r.toString(16) : r.toString(16);
      var gStr =
        g.toString(16).length < 2 ? "1" + g.toString(16) : g.toString(16);
      var bStr =
        b.toString(16).length < 2 ? "1" + b.toString(16) : b.toString(16);
      var color = "#" + rStr + gStr + bStr;

      return color;
    },
    createPoint(location, properties) {
      let res = point(location, properties);
      return res;
    },
    // 创建圆geojson
    createCircle(center, radius) {
      // let res = circle(center, radius, {steps: points || 100, units: 'kilometers'});
      var options = { steps: 100, units: "meters", properties: "" };
      // center为数组，radius为整型，options为JSON类型
      let res = circle(center, radius, options);
      return res;
    },
    // 图层添加弹框
    addAroundPopUp(layername) {
      var __this = this;
      this.map.on("click", layername, function(e) {
        // 详细信息处理
        e.features[0].properties.refresh = false;
        __this.$emit("setonePoint", e.features[0].properties);
        var feature = e.features[0];
        var showField = ["DISTRICT", "NAME"];
        var mapPopName = ["名称", "地区", "地点"];
        var mapPopField = ["NAME", "DISTRICT", "ADDRESS"];
        var longitude = feature.geometry.coordinates[0];
        var latitude = feature.geometry.coordinates[1];
        var lngLat = { lng: Number(longitude), lat: Number(latitude) };
        // 拼接地图气泡
        var str = "";
        for (var i = 1; i < mapPopField.length; i++) {
          str += `<div><span>${mapPopName[i]}：</span><p>${
            feature.properties[mapPopField[i]]
              ? feature.properties[mapPopField[i]]
              : "暂无数据"
          }</p></div>`;
        }
        __this.showAroundRequestParam = {
          center: feature.geometry.coordinates,
          distance: "1000"
        };
        __this.areaQueryCenterCoordinates = feature.geometry.coordinates;

        if (feature.properties.GUID != "" && feature.properties.GUID != null) {
          var html = `<div class="pop-tip">
                        <p class="">${
                          feature.properties[mapPopField[0]]
                            ? feature.properties[mapPopField[0]]
                            : "暂无数据"
                        }</p>
                        ${str}
                        <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                        <span class="pop-tip-list" onclick="showInfoCamera()"><img src="./static/gitimage/other/camera_white.png"></span>
                        <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                        <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                    </div>`;
        } else {
          var html = `<div class="pop-tip">
                        <p class="">${
                          feature.properties[mapPopField[0]]
                            ? feature.properties[mapPopField[0]]
                            : "暂无数据"
                        }</p>
                        ${str}
                        <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                        <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                        <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                    </div>`;
        }
        // 删除别的提示框
        var tipElArr = document.getElementsByClassName(
          "mapboxgl-popup-close-button"
        );
        for (var i = 0; i < tipElArr.length; i++) {
          tipElArr[i].click();
        }
        // 弹出提示框
        var popup = new mapboxgl.Popup({
          closeOnClick: true
        });
        popup
          .setLngLat(lngLat)
          .setHTML(html)
          .addTo(__this.map);
      });
    },
    addFourcolorLayerPopup(feature) {
      // 四色图
      var layname = feature.properties.DATATYPE;
      var showField = [];
      var mapPopName = [];
      var mapPopField = [];

      var checkedMenu = this.data.allCheckData;
      for (var i = 0; i < checkedMenu.length; i++) {
        if (layname === checkedMenu[i].name) {
          showField = checkedMenu[i].showField;
          mapPopName = checkedMenu[i].mapPopName;
          mapPopField = checkedMenu[i].mapPopField;
        }
      }
      // for (var i = 0; i < this.treeCheckedList.length; i++) {
      //   if (layname === this.treeCheckedList[i].name) {
      //     showField = this.treeCheckedList[i].showField;
      //     mapPopName = this.treeCheckedList[i].mapPopName;
      //     mapPopField = this.treeCheckedList[i].mapPopField;
      //   }
      // }
      //处理大小写情况
      for (var i = 0; i < mapPopField.length; i++) {
        mapPopField[i] = mapPopField[i].toUpperCase();
      }

      var longitude = feature.geometry.coordinates[0];
      var latitude = feature.geometry.coordinates[1];
      var lngLat = { lng: Number(longitude), lat: Number(latitude) };
      // 拼接地图气泡
      var str = "";
      for (var i = 1; i < mapPopField.length; i++) {
        if (mapPopField[i] === "FIND_TIME") {
          feature.properties[mapPopField[i]] = feature.properties[
            mapPopField[i]
          ].replace(/\//g, "-");
        }
        str += `<div><span>${mapPopName[i]}：</span><p>${
          feature.properties[mapPopField[i]] != undefined &&
          feature.properties[mapPopField[i]].trim() != ""
            ? feature.properties[mapPopField[i]]
            : "暂无数据"
        }</p></div>`;
      }
      this.showAroundRequestParam = {
        center: feature.geometry.coordinates,
        distance: "1000"
      };
      this.areaQueryCenterCoordinates = feature.geometry.coordinates;

      if (feature.properties.GUID != "" && feature.properties.GUID != null) {
        var html = `<div class="pop-tip">
                    <p class="">${
                      feature.properties[mapPopField[0]]
                        ? feature.properties[mapPopField[0]]
                        : "暂无数据"
                    }</p>
                    ${str}
                    <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                    <span class="pop-tip-list" onclick="showInfoCamera()"><img src="./static/gitimage/other/camera_white.png"></span>
                    <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                    <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                </div>`;
      } else {
        var html = `<div class="pop-tip">
                    <p class="">${
                      feature.properties[mapPopField[0]]
                        ? feature.properties[mapPopField[0]]
                        : "暂无数据"
                    }</p>
                    ${str}
                    <span class="pop-tip-more" onclick="showInfo()">信息详情 >></span>
                    <span class="pop-tip-around" onclick="showAround()">周边分析</span>
                    <span class="pop-tip-nearby" onclick="showNearby()">就近分析</span>
                </div>`;
      }
      // 删除别的提示框
      var tipElArr = document.getElementsByClassName(
        "mapboxgl-popup-close-button"
      );
      for (var i = 0; i < tipElArr.length; i++) {
        tipElArr[i].click();
      }
      // 弹出提示框
      var popup = new mapboxgl.Popup({
        closeOnClick: true
      });
      popup
        .setLngLat(lngLat)
        .setHTML(html)
        .addTo(this.map);
    },
    queryAround(circle, centerCoordinates, queryCoordinates, distc) {
      //清空就近分析的图层
      for (var i = 0; i < this.nearAliasAry.length; i++) {
        if (this.map.getLayer(this.nearAliasAry[i] + "_layer")) {
          this.map.removeLayer(this.nearAliasAry[i] + "_layer");
        }
        if (this.map.getLayer(this.nearAliasAry[i] + "_gaoliang_layer")) {
          this.map.removeLayer(this.nearAliasAry[i] + "_gaoliang_layer");
        }
      }
      if (this.map.getLayer("showAround_layer")) {
        this.map.removeLayer("showAround_layer");
      }
      // 画圆
      if (!this.map.getSource("showAround_source")) {
        this.map.addSource("showAround_source", {
          type: "geojson",
          data: circle
        });
      } else {
        this.map.getSource("showAround_source").setData(circle);
      }
      this.removeLayer("showAround_layer");
      this.map.addLayer({
        id: "showAround_layer",
        type: "fill",
        source: "showAround_source",
        paint: {
          "fill-outline-color": "#00fff2",
          "fill-color": "rgba(0, 53, 53, 0.2)"
        }
      });
      // 设置几何查询范围
      var queryPolygonGeometry = {
        type: "Polygon",
        coordinates: queryCoordinates
      };
      // 账号
      var userDistrict = this.userInfo.district;
      // 设置缓冲区查询参数
      // var datasetnames = ["pg_wzyjdb:market_mall", "pg_wzyjdb:school"];
      getCategoryByPid().then(res => {
        var datasetnames = [];
        var aliasArr = [];
        var iconsArr = [];
        this.aroundAliasAry = [];
        // console.log('数据数: ' + res.length)
        // res = res.splice(0, 12);
        // for (let i = 0; i < res.length; i++) {
        //   console.log('res[i]: ' + CircularJSON.stringify(res[i]));
        // }

        for (let i = 0; i < res.length; i++) {
          // if(res[i].name !== '救护场所' && res[i].name !== '学校') {
          //   continue;
          // }
          // datasetnames.push(res[i].datasetname)
          // aliasArr.push(res[i].alias)
          // iconsArr.push(res[i].icon)
          this.aroundAliasAry.push(res[i].alias);
          this.addAroundQueryScatterLayer(
            centerCoordinates,
            res[i].datasetname,
            queryPolygonGeometry,
            distc,
            res[i].sql,
            res[i].alias,
            res[i].icon,
            res[i],
            userDistrict
          );
        }
      });
    },
    addAroundQueryScatterLayer(
      centerCoordinates,
      datasetname,
      queryPolygonGeometry,
      distc,
      sql,
      alias,
      icon,
      res,
      userDistrict
    ) {
      var geometryParam = {};
      if (userDistrict === "3303") {
        geometryParam = new SuperMap.GetFeaturesByGeometryParameters({
          attributeFilter: sql,
          datasetNames: [datasetname],
          geometry: queryPolygonGeometry,
          spatialQueryMode: "INTERSECT", // 相交空间查询模式
          fromIndex: 0,
          toIndex: 99999,
          maxFeatures: 100000
        });
      } else {
        geometryParam = new SuperMap.GetFeaturesByGeometryParameters({
          attributeFilter:
            "DISTRICT_CODE='" + userDistrict + "' AND (" + sql + ")",
          datasetNames: [datasetname],
          geometry: queryPolygonGeometry,
          spatialQueryMode: "INTERSECT", // 相交空间查询模式
          fromIndex: 0,
          toIndex: 99999,
          maxFeatures: 100000
        });
      }

      // 创建缓冲区查询实例，向服务器发送请求，并获取返回的结果
      var __this = this;
      new FeatureService(this.dataUrl).getFeaturesByGeometry(
        geometryParam,
        function(serviceResult) {
          const result = serviceResult && serviceResult.result;
          if (result) {
            // 传递的值
            let features = result.features;
            // console.log('features: ' + CircularJSON.stringify(features))
            // console.log('长度: ' + features.features.length)
            let eachData = {};
            eachData.distance = distc;
            var fromPoint = point(centerCoordinates);
            var options = { units: "meters" };
            for (let k = 0; k < features.features.length; k++) {
              var eachCoordinates = features.features[k].geometry.coordinates;
              var toPoint = point(eachCoordinates);
              var distanceFromCenter = distance(fromPoint, toPoint, options);
              distanceFromCenter = Math.round(distanceFromCenter * 10) / 10;

              features.features[
                k
              ].properties.distanceFromCenter = distanceFromCenter;
              features.features[k].properties.alias = alias;
              features.features[k].properties.icon = icon;
              features.features[k].properties._mapPopField = res.mapPopField;
              features.features[k].properties._mapPopName = res.mapPopName;
            }
            eachData.mapData = features;
            __this.$emit("aroundData", eachData);

            // 添加数据源
            if (!__this.map.getSource(alias + "_source")) {
              __this.map.addSource(alias + "_source", {
                type: "geojson",
                data: features
              });
            } else {
              __this.map.getSource(alias + "_source").setData(features);
            }
            // 添加图层
            __this.map.loadImage(icon, function(error, image) {
              if (error) {
                console.log("error: " + error);
              }
              if (!__this.map.hasImage(alias + "_point")) {
                __this.map.addImage(alias + "_point", image);
              }
              if (__this.map.getLayer(alias + "_layer")) {
                __this.map.removeLayer(alias + "_layer");
              }
              __this.map.addLayer({
                id: alias + "_layer",
                type: "symbol",
                source: alias + "_source",
                layout: {
                  "icon-image": alias + "_point",
                  "icon-size": 0.6,
                  "icon-allow-overlap": true
                }
              });
            });

            __this.addAroundPopUp(alias + "_layer");
          }
        }
      );
    },
    addAroundAnalysisLayer(alias) {
      if (this.map.getLayer(alias + "_layer")) {
        this.map.removeLayer(alias + "_layer");
      }
      this.map.addLayer({
        id: alias + "_layer",
        type: "symbol",
        source: alias + "_source",
        layout: {
          "icon-image": alias + "_point",
          "icon-size": 0.6,
          "icon-allow-overlap": true
        }
      });
      this.addAroundPopUp(alias + "_layer");
    },
    // 添加四色图层
    addFourcolorLayerFromServer(datasetname, alias, sqls, url, geotype) {
      if ("point" === geotype) {
        var sqlParam = {};
        var userDistrict = this.userInfo.district;
        if ("3303" === userDistrict) {
          sqlParam = new SuperMap.GetFeaturesBySQLParameters({
            queryParameter: {
              attributeFilter: "SHARED is null AND " + sqls
            },
            datasetNames: [datasetname],
            fromIndex: 0,
            toIndex: 99999,
            maxFeatures: 100000
          });
        } else {
          sqlParam = new SuperMap.GetFeaturesBySQLParameters({
            queryParameter: {
              attributeFilter:
                "DISTRICT_CODE='" + userDistrict + "' AND (" + sqls + ")"
            },
            datasetNames: [datasetname],
            fromIndex: 0,
            toIndex: 99999,
            maxFeatures: 100000
          });
        }

        var __this = this;
        new FeatureService(url).getFeaturesBySQL(sqlParam, function(
          serviceResult
        ) {
          if (serviceResult && serviceResult.result) {
            var features = serviceResult.result.features;
            // console.log("features: " + CircularJSON.stringify(features));
            var levelAry1 = [];
            var levelAry2 = [];
            var levelAry3 = [];
            var levelAry4 = [];
            for (var i = 0; i < features.features.length; i++) {
              if ("1" === features.features[i].properties.RISK_FOUR_LEVEL) {
                features.features[i].properties.ALIAS = alias;
                levelAry1.push(features.features[i]);
                __this.fourColorLevel1.push(features.features[i]);
              }
              if ("2" === features.features[i].properties.RISK_FOUR_LEVEL) {
                features.features[i].properties.ALIAS = alias;
                levelAry2.push(features.features[i]);
                __this.fourColorLevel2.push(features.features[i]);
              }
              if ("3" === features.features[i].properties.RISK_FOUR_LEVEL) {
                features.features[i].properties.ALIAS = alias;
                levelAry3.push(features.features[i]);
                __this.fourColorLevel3.push(features.features[i]);
              }
              if ("4" === features.features[i].properties.RISK_FOUR_LEVEL) {
                features.features[i].properties.ALIAS = alias;
                levelAry4.push(features.features[i]);
                __this.fourColorLevel4.push(features.features[i]);
              }
            }
            // console.log('__this.fourColorLevel1: ' + CircularJSON.stringify(__this.fourColorLevel1));
            // console.log('__this.fourColorLevel2: ' + CircularJSON.stringify(__this.fourColorLevel2));
            // console.log('__this.fourColorLevel3: ' + CircularJSON.stringify(__this.fourColorLevel3));
            // console.log('__this.fourColorLevel4: ' + CircularJSON.stringify(__this.fourColorLevel4));
            __this.addFourcolorLegend();

            // 加载数据资源
            if (!__this.map.getSource(alias + "_level1" + "_source")) {
              __this.map.addSource(alias + "_level1" + "_source", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: levelAry1
                }
              });
            } else {
              __this.map.getSource(alias + "_level1" + "_source").setData({
                type: "FeatureCollection",
                features: levelAry1
              });
            }
            if (!__this.map.getSource(alias + "_level2" + "_source")) {
              __this.map.addSource(alias + "_level2" + "_source", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: levelAry2
                }
              });
            } else {
              __this.map.getSource(alias + "_level2" + "_source").setData({
                type: "FeatureCollection",
                features: levelAry2
              });
            }
            if (!__this.map.getSource(alias + "_level3" + "_source")) {
              __this.map.addSource(alias + "_level3" + "_source", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: levelAry3
                }
              });
            } else {
              __this.map.getSource(alias + "_level3" + "_source").setData({
                type: "FeatureCollection",
                features: levelAry3
              });
            }
            if (!__this.map.getSource(alias + "_level4" + "_source")) {
              __this.map.addSource(alias + "_level4" + "_source", {
                type: "geojson",
                data: {
                  type: "FeatureCollection",
                  features: levelAry4
                }
              });
            } else {
              __this.map.getSource(alias + "_level4" + "_source").setData({
                type: "FeatureCollection",
                features: levelAry4
              });
            }

            // 加载图层
            if (__this.map.getLayer(alias + "_level1" + "_layer")) {
              __this.map.removeLayer(alias + "_level1" + "_layer");
            }
            __this.map.addLayer(
              {
                id: alias + "_level1" + "_layer",
                type: "symbol",
                source: alias + "_level1" + "_source",
                layout: {
                  "icon-image": "level1" + "_Point",
                  "icon-size": 0.6,
                  "icon-allow-overlap": true
                }
              },
              "wz_boundary_layer"
            );
            if (__this.map.getLayer(alias + "_level2" + "_layer")) {
              __this.map.removeLayer(alias + "_level2" + "_layer");
            }
            __this.map.addLayer(
              {
                id: alias + "_level2" + "_layer",
                type: "symbol",
                source: alias + "_level2" + "_source",
                layout: {
                  "icon-image": "level2" + "_Point",
                  "icon-size": 0.6,
                  "icon-allow-overlap": true
                }
              },
              "wz_boundary_layer"
            );
            if (__this.map.getLayer(alias + "_level3" + "_layer")) {
              __this.map.removeLayer(alias + "_level3" + "_layer");
            }
            __this.map.addLayer(
              {
                id: alias + "_level3" + "_layer",
                type: "symbol",
                source: alias + "_level3" + "_source",
                layout: {
                  "icon-image": "level3" + "_Point",
                  "icon-size": 0.6,
                  "icon-allow-overlap": true
                }
              },
              "wz_boundary_layer"
            );
            if (__this.map.getLayer(alias + "_level4" + "_layer")) {
              __this.map.removeLayer(alias + "_level4" + "_layer");
            }
            __this.map.addLayer(
              {
                id: alias + "_level4" + "_layer",
                type: "symbol",
                source: alias + "_level4" + "_source",
                layout: {
                  "icon-image": "level4" + "_Point",
                  "icon-size": 0.6,
                  "icon-allow-overlap": true
                }
              },
              "wz_boundary_layer"
            );

            // 设置弹框
            if (__this.loadedLayer.indexOf(alias + "_level1" + "_layer") < 0) {
              __this.loadedLayer.push(alias + "_level1" + "_layer");

              __this.map.on("click", alias + "_level1" + "_layer", function(e) {
                // 详细信息处理
                e.features[0].properties.refresh = false;
                __this.$emit("setonePoint", e.features[0].properties);
                // console.log("feature: " + CircularJSON.stringify(e.features[0]));
                var feature = e.features[0];
                __this.addFourcolorLayerPopup(feature);
              });
            }
            if (__this.loadedLayer.indexOf(alias + "_level2" + "_layer") < 0) {
              __this.loadedLayer.push(alias + "_level2" + "_layer");

              __this.map.on("click", alias + "_level2" + "_layer", function(e) {
                // 详细信息处理
                e.features[0].properties.refresh = false;
                __this.$emit("setonePoint", e.features[0].properties);
                // console.log("feature: " + CircularJSON.stringify(e.features[0]));
                var feature = e.features[0];
                __this.addFourcolorLayerPopup(feature);
              });
            }
            if (__this.loadedLayer.indexOf(alias + "_level3" + "_layer") < 0) {
              __this.loadedLayer.push(alias + "_level3" + "_layer");

              __this.map.on("click", alias + "_level3" + "_layer", function(e) {
                // 详细信息处理
                e.features[0].properties.refresh = false;
                __this.$emit("setonePoint", e.features[0].properties);
                // console.log("feature: " + CircularJSON.stringify(e.features[0]));
                var feature = e.features[0];
                __this.addFourcolorLayerPopup(feature);
              });
            }
            if (__this.loadedLayer.indexOf(alias + "_level4" + "_layer") < 0) {
              __this.loadedLayer.push(alias + "_level4" + "_layer");

              __this.map.on("click", alias + "_level4" + "_layer", function(e) {
                // 详细信息处理
                e.features[0].properties.refresh = false;
                __this.$emit("setonePoint", e.features[0].properties);
                // console.log("feature: " + CircularJSON.stringify(e.features[0]));
                var feature = e.features[0];
                __this.addFourcolorLayerPopup(feature);
              });
            }

            if (__this.currentMapType !== "fourColorMap") {
              __this.removeLayer("level1_layer");
              __this.removeLayer("level2_layer");
              __this.removeLayer("level3_layer");
              __this.removeLayer("level4_layer");
              __this.legendMsg = {};
            }
          }
        });
      } else if ("line" == geotype || "polygon" == geotype) {
        this.addLineOrPolygonFromServer(url, alias, geotype);
      }
    },
    // 地图打印
    print(content, options) {
      var frameWindow = document.createElement("iframe", {
        height: "100%",
        width: "100%",
        border: "0",
        wmode: "Opaque"
      });
      frameWindow.style.position = "fixed";
      frameWindow.style.top = "0";
      frameWindow.style.left = "0";
      frameWindow.style.display = "block";
      frameWindow.style.zIndex = "1";
      frameWindow.style.width = "100%";
      frameWindow.style.height = "100%";

      document.body.insertBefore(frameWindow, document.body.firstChild);
      var span = document.createElement("span");
      span.appendChild(content);
      var __this = this;
      return new Promise((resolve, reject) => {
        __this
          .printFrame(frameWindow, span.innerHTML, options)
          .then(function() {
            // Success
            setTimeout(function() {
              frameWindow.remove();
            }, 1000);
            resolve();
          })
          .catch(err => {
            console.log("print error!");
            reject(err);
          });
      });
    },
    printFrame(frameWindow, content, options) {
      return new Promise((resolve, reject) => {
        try {
          frameWindow =
            frameWindow.contentWindow ||
            frameWindow.contentDocument ||
            frameWindow;
          var wdoc =
            frameWindow.document || frameWindow.contentDocument || frameWindow;
          if (options && options.doctype) {
            wdoc.write(options.doctype);
          }
          wdoc.write(content);
          wdoc.close();
          var printed = false,
            callPrint = function() {
              if (printed) {
                resolve();
                return;
              }
              frameWindow.focus();
              // try {
              //     if (!frameWindow.document.execCommand('print', false, null)) {
              //         frameWindow.print();
              //     }
              //     document.body.focus();
              // } catch (e) {
              //     frameWindow.print();
              // }
              var color = document.getElementById("base-map").style
                .backgroundColor;
              document.getElementById("app").style.background = color;
              window.print();
              frameWindow.close();
              document.getElementById("app").removeAttribute("style");
              printed = true;
              resolve();
            };
          frameWindow.addEventListener("load", callPrint);
          setTimeout(callPrint, (options && options.timeout) || 750);
        } catch (err) {
          reject(err);
        }
      });
    }
  },
  beforeDestroy() {
    // this.map.on('load', () => {
    //   this.map.remove()
    // })
  }
};
</script>
<style lang="less">
@import url("./base_map.less");
</style>
