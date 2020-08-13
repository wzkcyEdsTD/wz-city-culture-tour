<!--
 * @Author: eds
 * @Date: 2020-07-07 09:41:22
 * @LastEditTime: 2020-08-13 11:56:41
 * @LastEditors: eds
 * @Description:
 * @FilePath: \旅游\src\components\map-view\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <div v-if="mapLoaded">
      <Coverage />
      <CesiumMapTool ref="cesiummaptool" v-if="showSubTool == '3t1'" />
      <VisualizationAnalyse ref="visualizationanalyse" v-if="showSubTool == '3t2'" />
      <SectionAnalyse ref="sectionanalyse" v-if="showSubTool == '3t3'" />
      <NanTangModel v-if="showSubFrame == '3d1'" />
      <InfoFrame ref="infoframe" />
      <Popup ref="popup" :mapLoaded="mapLoaded" />
    </div>
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import "./basicTools/ThreeTools.less";
import Coverage from "./treeTool/TreeTool";
import VisualizationAnalyse from "./basicTools/VisualizationAnalyse";
import SectionAnalyse from "./basicTools/SectionAnalyse";
import NanTangModel from "./extraModel/NanTangModel";
import CesiumMapTool from "./basicTools/CesiumMapTool";
import InfoFrame from "./commonFrame/InfoFrame";
import Popup from "./commonFrame/popup";
const Cesium = window.Cesium;
import { mapActions } from "vuex";

export default {
  data() {
    return {
      showSubFrame: null,
      showSubTool: null,
      mapLoaded: false,
      imagelayer: undefined,
      datalayer: undefined,
      viewer: undefined,
    };
  },
  components: {
    Coverage,
    VisualizationAnalyse,
    SectionAnalyse,
    NanTangModel,
    CesiumMapTool,
    InfoFrame,
    Popup,
  },
  mounted() {
    this.init3DMap(() => {
      this.mapLoaded = true;
    });
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["SetForceBimData"]),
    eventRegsiter() {
      this.$bus.$off("cesium-3d-event");
      this.$bus.$on("cesium-3d-event", ({ value }) => {
        this.SetForceBimData([]);
        this.showSubFrame = value;
      });
      this.$bus.$off("cesium-3d-maptool");
      this.$bus.$on("cesium-3d-maptool", ({ value }) => {
        this.showSubTool = value;
      });
      this.$bus.$off("cesium-3d-switch");
      this.$bus.$on("cesium-3d-switch", ({ value }) => {
        const _LAYER_ = this.viewer.scene.layers.find("baimo");
        _LAYER_.visible = value;
      });
      this.$bus.$off("cesium-3d-mapType");
      this.$bus.$on("cesium-3d-mapType", ({ value }) => {
        if (value == "imagelayer") {
          this.datalayer.show = false;
          this.imagelayer
            ? (this.imagelayer.show = true)
            : (this.imagelayer = this.viewer.imageryLayers.addImageryProvider(
                new Cesium.SuperMapImageryProvider({
                  url: ServiceUrl.SWImage,
                })
              ));
        } else {
          this.imagelayer.show = false;
          this.datalayer
            ? (this.datalayer.show = true)
            : (this.datalayer = this.viewer.imageryLayers.addImageryProvider(
                new Cesium.SuperMapImageryProvider({
                  url: ServiceUrl.DataImage,
                })
              ));
        }
      });
    },
    init3DMap(fn) {
      const that = this;
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: true,
        // terrainProvider: new Cesium.CesiumTerrainProvider({
        //   url: ServiceUrl.YJDem,
        // }),
      });
      this.datalayer = this.viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: ServiceUrl.DataImage,
        })
      );
      const mapMvt = this.viewer.scene.addVectorTilesMap({
        url: ServiceUrl.YJMVT,
        name: "mapMvt",
        viewer: this.viewer,
      });
      console.log(mapMvt)
      // this.viewer.scene.addS3MTilesLayerByScp(ServiceUrl.WZBaimo, {
      //   name: "baimo",
      // });
      // 移除缓冲圈
      $(".cesium-widget-credits").hide();
      this.viewer.scene.camera.setView({
        destination: {
          x: -2885689.43805791,
          y: 4865993.322893596,
          z: 2977614.8110983055,
        },
        orientation: {
          heading: 0.003115109744838307,
          pitch: -0.5846590801356228,
          roll: 0,
        },
      });
      fn && fn();
      window.earth = this.viewer;
    },
  },
};
</script>

<style lang="less" scoped>
.cesiumContainer {
  height: 100%;
  width: 100%;
  #cesiumContainer {
    height: 100%;
    width: 100%;
  }
}
</style>
