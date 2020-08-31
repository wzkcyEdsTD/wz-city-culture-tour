<!--
 * @Author: eds
 * @Date: 2020-08-20 18:52:41
 * @LastEditTime: 2020-08-31 10:50:43
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <div v-if="mapLoaded">
      <Coverage />
      <Area />
      <Turntable />
      <TotalTarget />
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
import Area from "./area/area";
import Turntable from "./turntable/turntable";
import TotalTarget from "./totalTarget/totalTarget";
import NanTangModel from "./extraModel/NanTangModel";
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
      isInfoFrame: false,
    };
  },
  components: {
    Coverage,
    Area,
    Turntable,
    TotalTarget,
    NanTangModel,
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
        const _LAYER_ = window.earth.scene.layers.find("baimo");
        _LAYER_.visibleDistanceMin = !value ? 1400 : 0;
        // _LAYER_.visible = value;
      });
      this.$bus.$off("cesium-3d-mapType");
      this.$bus.$on("cesium-3d-mapType", ({ value }) => {
        if (value == "imagelayer") {
          this.datalayer.show = false;
          this.imagelayer
            ? (this.imagelayer.show = true)
            : (this.imagelayer = window.earth.imageryLayers.addImageryProvider(
                new Cesium.SuperMapImageryProvider({
                  url: ServiceUrl.SWImage,
                })
              ));
        } else {
          this.imagelayer.show = false;
          this.datalayer
            ? (this.datalayer.show = true)
            : (this.datalayer = window.earth.imageryLayers.addImageryProvider(
                new Cesium.SuperMapImageryProvider({
                  url: ServiceUrl.DataImage,
                })
              ));
        }
      });
    },
    init3DMap(fn) {
      const that = this;
      const viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        // 隐藏绿框标识
        selectionIndicator: false,
      });

      this.datalayer = viewer.imageryLayers.addImageryProvider(
        new Cesium.SuperMapImageryProvider({
          url: ServiceUrl.DataImage,
        })
      );
      const mapMvt = viewer.scene.addVectorTilesMap({
        url: ServiceUrl.YJMVT,
        name: "mapMvt",
        viewer,
      });
      const baimoPromise = viewer.scene.addS3MTilesLayerByScp(
        ServiceUrl.WZBaimo,
        {
          name: "baimo",
        }
      );
      Cesium.when(baimoPromise, async (layers) => {
        const LAYER = viewer.scene.layers.find("baimo");
        LAYER.style3D.fillForeColor = new Cesium.Color.fromCssColorString(
          "rgba(137,137,137, 1)"
        );
        // LAYER.style3D.lineColor = new Cesium.Color.fromCssColorString(
        //   "rgba(100, 100, 100, 1)"
        // );
        // LAYER.style3D.lineWidth = 0.5;
        // //  草图模式
        // LAYER.style3D.fillStyle = Cesium.FillStyle.Fill_And_WireFrame;
        // LAYER.wireFrameMode = Cesium.WireFrameType.Sketch;
        LAYER.visibleDistanceMax = 5500;
      });
      // 移除缓冲圈
      $(".cesium-widget-credits").hide();
      fn && fn();
      viewer.scene.globe.depthTestAgainstTerrain = false;
      window.earth = viewer;
      this.cameraMove();
      this.addPointLight();
    },
    addPointLight() {
      const position = new Cesium.Cartesian3(
        -2876658.347784866,
        4840022.695245349,
        2996644.580693739
      );
      const options = {
        intensity: 0.5,
      };
      const directionalLight_v = new Cesium.DirectionalLight(position, options);
      window.earth.scene.addLightSource(directionalLight_v);
    },
    cameraMove() {
      window.earth.scene.camera.setView({
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
    // color: rgb(42, 104, 163);
  }
}
</style>
