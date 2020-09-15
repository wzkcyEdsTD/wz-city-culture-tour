<!--
 * @Author: eds
 * @Date: 2020-08-20 09:03:10
 * @LastEditTime: 2020-09-11 17:27:50
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\extraModel\NanTangModel.vue
-->
<template>
  <div class="nanTangModel"></div>
</template>

<script>
const Cesium = window.Cesium;
import { ServiceUrl } from "config/server/mapConfig";
import { mapGetters, mapActions } from "vuex";
const { BUILDING, OTHERS } = ServiceUrl.SCENE_WZMODEL;
const LAYERS = [
  { name: "BUILDING", url: BUILDING },
  { name: "OTHERS", url: OTHERS },
];
export default {
  data() {
    return {
      //  cesium Object
    };
  },
  async mounted() {
    this.initBimScene();
    // this.addEntities();
    this.eventRegsiter();
    // this.cameraMove();
  },
  beforeDestroy() {
    this.$bus.$emit("cesium-3d-switch", { value: true });
    this.closeNanTangModel();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      this.$bus.$emit("cesium-3d-switch", { value: false });
    },
    //  相机移动
    cameraMove() {
      window.earth.scene.camera.setView({
        destination: {
          x: -2872784.3979956135,
          y: 4845208.573054629,
          z: 2993662.234962943,
        },
        orientation: {
          heading: 0.0030737118735766344,
          pitch: -0.582106282953041,
          roll: 0,
        },
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      const _LAYER_ = window.earth.scene.layers.find(LAYERS[0].name);
      if (_LAYER_) {
        LAYERS.map((v) => {
          const V_LAYER = window.earth.scene.layers.find(v.name);
          V_LAYER.visible = true;
        });
      } else {
        const PROMISES = LAYERS.map((v) => {
          return window.earth.scene.addS3MTilesLayerByScp(v.url, {
            name: v.name,
          });
        });
        Cesium.when(PROMISES[PROMISES.length - 1], () => {
          const otherLayer = window.earth.scene.layers.find("OTHERS");
          otherLayer.visibleDistanceMax = 1400;
          const buildLayer = window.earth.scene.layers.find("BUILDING");
          buildLayer.visibleDistanceMax = 5000;
        });
      }
    },
    addEntities() {
      //  监控点
      this.addEntity(
        [120.66728999999999, 27.998789999999999],
        "/static/images/video.png",
        "video"
      );
      //  vr全景
      this.addEntity(
        [120.66468464400009, 27.99854437800019],
        "/static/images/VR.png",
        "vr"
      );
      //  流量点
      this.addEntity([120.661, 27.999], "/static/images/people.png", "people");
    },
    addEntity([x, y], image, name = +new Date()) {
      window.earth.entities.add({
        position: Cesium.Cartesian3.fromDegrees(x, y, 40),
        billboard: {
          image,
          width: 94,
          height: 94,
        },
        name,
      });
    },
    //  关闭BIM分析模块
    closeNanTangModel() {
      this.clearNanTangModel();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearNanTangModel() {
      LAYERS.map((v) => {
        const V_LAYER = window.earth.scene.layers.find(v.name);
        V_LAYER.visible = false;
      });
    },
  },
};
</script>

<style>
</style>
