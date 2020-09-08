<!--
 * @Author: eds
 * @Date: 2020-08-20 09:03:10
 * @LastEditTime: 2020-09-08 14:51:25
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\medical-view\extraModel\NanTangModel.vue
-->
<template>
  <div class="nanTangModel"></div>
</template>

<script>
const Cesium = window.Cesium;
import { ServiceUrl } from "config/server/mapConfig";
import { mapGetters, mapActions } from "vuex";
const SERVER_HOST = "http://10.36.217.240:8098/iserver/services";
const LAYER_NAME = "南塘精细三维";
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
      const _LAYER_ = window.earth.scene.layers.find(LAYER_NAME);
      if (_LAYER_) {
        _LAYER_.visible = true;
      } else {
        const promise = window.earth.scene.addS3MTilesLayerByScp(
          ServiceUrl.WZMODEL,
          { name: LAYER_NAME }
        );
        Cesium.when(promise, async (layers) => {
          const layer = window.earth.scene.layers.find(LAYER_NAME);
          layer.visibleDistanceMax = 1400;
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
      window.earth.scene.layers.find(LAYER_NAME).visible = false;
    },
  },
};
</script>

<style>
</style>
