<!--
 * @Author: eds
 * @Date: 2020-08-20 18:52:41
 * @LastEditTime: 2020-09-01 16:19:09
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\cesium_map.vue
-->
<template>
  <div class="cesiumContainer">
    <div id="cesiumContainer" />
    <div v-if="mapLoaded">
      <Coverage ref="treetool" />
      <TotalTarget />
      <NanTangModel v-if="showSubFrame == '3d1'" />
      <InfoFrame ref="infoframe" v-show="isInfoFrame" />
      <Popup ref="popups" :mapLoaded="mapLoaded" />
      <RtmpVideo v-if="mapLoaded" />
      <Population v-if="mapLoaded" />
      <VideoCircle ref="videoCircle" v-if="mapLoaded" />
    </div>
  </div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import "./basicTools/ThreeTools.less";
import Coverage from "./treeTool/TreeTool";
import TotalTarget from "./totalTarget/totalTarget";
import NanTangModel from "./extraModel/NanTangModel";
import InfoFrame from "./commonFrame/InfoFrame";
import Popup from "./commonFrame/popup";
import RtmpVideo from "./extraModel/RtmpVideo/RtmpVideo";
import Population from "./extraModel/Population/Population";
import VideoCircle from "./commonFrame/videoCircle";
import { getCurrentExtent, isContainByExtent } from "./commonFrame/mapTool";
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
      handler: undefined,
    };
  },
  components: {
    Coverage,
    TotalTarget,
    NanTangModel,
    InfoFrame,
    Popup,
    RtmpVideo,
    Population,
    VideoCircle,
  },
  mounted() {
    this.init3DMap(() => {
      this.mapLoaded = true;
      this.initPostRender();
      this.initHandler();
    });
    this.eventRegsiter();
  },
  methods: {
    ...mapActions("map", ["SetForceBimData"]),
    initPostRender() {
      window.earth.scene.postRender.addEventListener(() => {
        if (!window.earth) return;
        //  *****[pickedList] 医疗点位*****
        const pickedList = this.$refs.treetool.pickedList;
        if (pickedList && pickedList.length) {
          const extent = getCurrentExtent();
          const pointList = [];
          const newList = [];
          pickedList.map((item) => {
            if (item.geometry && isContainByExtent(extent, item.geometry)) {
              const pointToWindow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.earth.scene,
                item._position._value
              );
              pointList.push(pointToWindow);
              newList.push(item);
            }
          });
          this.$refs.popups && this.$refs.popups.doPopup(newList, pointList);
        }
        //  *****[]  事件传递点位*****
        if (this.$refs.videoCircle.shallPop) {
          this.$refs.videoCircle && this.$refs.videoCircle.doPopup();
        }
        //  *****[]  详情查看点位*****
      });
    },
    initHandler() {
      this.handler = new Cesium.ScreenSpaceEventHandler(
        window.earth.scene.canvas
      );
      // 监听左键点击事件
      this.handler.setInputAction((e) => {
        let pick = window.earth.scene.pick(e.position);
        //  *****[]  监控视频点*****
        if (pick && ~pick.id.id.indexOf("videopoint_")) {
          this.$bus.$emit("cesium-3d-videoPointClick", {
            mp_id: pick.id.id,
            mp_name: pick.id.name,
          });
        }
        //  *****[]  资源详情点*****
        //  code...
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    eventRegsiter() {
      this.$bus.$off("cesium-3d-switch");
      this.$bus.$on("cesium-3d-switch", ({ value }) => {
        const _LAYER_ = window.earth.scene.layers.find("baimo");
        _LAYER_.visibleDistanceMin = !value ? 1400 : 0;
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
        LAYER.visibleDistanceMax = 5500;
      });
      // 移除缓冲圈
      $(".cesium-widget-credits").hide();
      viewer.scene.globe.depthTestAgainstTerrain = false;
      window.earth = viewer;
      fn && fn();
      this.cameraMove();
      this.addPointLight();
      fn && fn();
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
