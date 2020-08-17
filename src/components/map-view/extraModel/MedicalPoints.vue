<!--
 * @Author: eds
 * @Date: 2020-08-12 15:17:46
 * @LastEditTime: 2020-08-17 11:08:48
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\map-view\extraModel\MedicalPoints.vue
-->
<template>
  <div class="MedicalPoints"></div>
</template>

<script>
const Cesium = window.Cesium;
import
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      viewer: undefined,
    };
  },
  created() {
    this.viewer = window.earth;
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
    this.cameraMove();
    this.SetIsInfoFrame(true);
  },
  beforeDestroy() {
    this.viewer.entities.removeAll();
    this.SetIsInfoFrame(false);
    this.closeMedicalPoint();
    this.viewer = undefined;
  },
  methods: {
    ...mapActions("map", ["SetIsInfoFrame"]),
    //  事件绑定
    eventRegsiter() {
      const that = this;
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
    initBimScene(fn) {},
    addEntity([x, y], image, name = +new Date()) {
      this.viewer.entities.add({
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
    closeMedicalPoint() {
      this.clearMedicalPoint();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearMedicalPoint() {},
  },
};
</script>

<style>
</style>
