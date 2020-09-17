<template>
  <div class="overview" />
</template>

<script>
import {
  CenterPoint,
  LeftPoint,
  RightPoint,
  xs,
  ys,
  zs,
  headings,
  pitchs,
} from "./Overview";
export default {
  name: "overview",
  data() {
    return {
      cameraTimer: undefined,
      toRight: true,
      CenterPoint,
      LeftPoint,
      RightPoint,
    };
  },
  mounted() {
    this.eventRegsiter();
    this.cameraMove(this.CenterPoint);
    setTimeout(() => {
      this.initOverview();
    }, 2000);
  },
  beforeDestroy() {
    clearInterval(this.cameraTimer);
    //  开启鼠标事件
    this.screenSpaceCameraController(true);
    this.cameraMove(this.CenterPoint);
  },
  methods: {
    eventRegsiter() {},
    cameraMove(Point) {
      window.earth.camera.flyTo({ ...Point, duration: 2 });
    },
    cameraFlyTo() {
      const toPoint = this.toRight ? this.RightPoint : this.LeftPoint;
      window.earth.camera.flyTo({ ...toPoint, duration: 24 });
      this.toRight = !this.toRight;
    },
    initOverview() {
      const that = this;
      //  禁用鼠标事件
      this.screenSpaceCameraController(false);
      //  开启
      this.cameraFlyTo();
      this.cameraTimer = setInterval(() => {
        this.cameraFlyTo();
      }, 23000);
    },
    screenSpaceCameraController(boolean) {
      window.earth.scene.screenSpaceCameraController.enableInputs = boolean;
      window.earth.scene.screenSpaceCameraController.enableLook = boolean;
      window.earth.scene.screenSpaceCameraController.enableRotate = boolean;
      window.earth.scene.screenSpaceCameraController.enableTilt = boolean;
      window.earth.scene.screenSpaceCameraController.enableTranslate = boolean;
      window.earth.scene.screenSpaceCameraController.enableZoom = boolean;
    },
  },
};
</script>

<style>
</style>