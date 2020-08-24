<!--
 * @Author: eds
 * @Date: 2020-08-20 18:52:41
 * @LastEditTime: 2020-08-24 13:52:50
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\cesium_map.vue
-->
<!--
 * @Author: eds
 * @Date: 2020-07-07 09:41:22
 * @LastEditTime: 2020-08-21 10:39:11
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <div v-if="mapLoaded">
      <Coverage />
      <TotalTarget />
      <CesiumMapTool ref="cesiummaptool" v-if="showSubTool == '3t1'" />
      <VisualizationAnalyse ref="visualizationanalyse" v-if="showSubTool == '3t2'" />
      <SectionAnalyse ref="sectionanalyse" v-if="showSubTool == '3t3'" />
      <NanTangModel v-if="showSubFrame == '3d1'" />
      <InfoFrame ref="infoframe" v-show="isInfoFrame" />
      <Popup ref="popup" :mapLoaded="mapLoaded" />
      <RtmpVideo v-if="mapLoaded" />
      <Population v-if="mapLoaded" />
    </div>
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import "./basicTools/ThreeTools.less";
import Coverage from "./treeTool/TreeTool";
import TotalTarget from "./totalTarget/totalTarget";
import VisualizationAnalyse from "./basicTools/VisualizationAnalyse";
import SectionAnalyse from "./basicTools/SectionAnalyse";
import NanTangModel from "./extraModel/NanTangModel";
import CesiumMapTool from "./basicTools/CesiumMapTool";
import InfoFrame from "./commonFrame/InfoFrame";
import Popup from "./commonFrame/popup";
import RtmpVideo from "./extraModel/RtmpVideo/RtmpVideo";
import Population from "./extraModel/Population/Population";
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
      isInfoFrame: false,
    };
  },
  components: {
    Coverage,
    TotalTarget,
    VisualizationAnalyse,
    SectionAnalyse,
    NanTangModel,
    CesiumMapTool,
    InfoFrame,
    Popup,
    RtmpVideo,
    Population,
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
        _LAYER_.visibleDistanceMin = !value ? 400 : 0;
        // _LAYER_.visible = value;
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
        // 隐藏绿框标识
        selectionIndicator: false,
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
      const baimoPromise = this.viewer.scene.addS3MTilesLayerByScp(
        ServiceUrl.WZBaimo,
        {
          name: "baimo",
        }
      );
      Cesium.when(baimoPromise, async (layers) => {
        const LAYER = this.viewer.scene.layers.find("baimo");
        LAYER.style3D.fillForeColor = new Cesium.Color.fromCssColorString(
          "rgba(42, 104, 163, 1)"
        );
        LAYER.style3D.lineColor = new Cesium.Color.fromCssColorString(
          "rgba(151, 151, 151, 1)"
        );;
        LAYER.style3D.lineWidth = 0.5;
        //  草图模式
        LAYER.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
        LAYER.wireFrameMode = Cesium.WireFrameType.Sketch;
        LAYER.visibleDistanceMax = 5500;
      });
      this.addPointLight();
      this.cameraMove();
      // 移除缓冲圈
      $(".cesium-widget-credits").hide();
      fn && fn();
      this.viewer.scene.globe.depthTestAgainstTerrain = false;
      window.earth = this.viewer;
    },
    addPointLight() {
      const position = new Cesium.Cartesian3(
        -2876658.347784866,
        4840022.695245349,
        2996644.580693739
      );
      const options = {
        intensity: 1,
      };
      const directionalLight_v = new Cesium.DirectionalLight(position, options);
      this.viewer.scene.addLightSource(directionalLight_v);
    },
    cameraMove() {
      this.viewer.scene.camera.setView({
        destination: {
          x: -2875301.1196146533,
          y: 4843728.17360857,
          z: 2993569.51865382,
        },
        orientation: {
          heading: 0.0033168860454315663,
          pitch: -0.5808830390057396,
          roll: 0,
        },
      });
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
    color: rgb(42, 104, 163)
  }
}
</style>
