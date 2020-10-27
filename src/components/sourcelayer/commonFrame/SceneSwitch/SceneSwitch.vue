<!--
 * @Author: eds
 * @Date: 2020-09-15 11:04:57
 * @LastEditTime: 2020-09-15 11:05:13
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\SceneSwitch\SceneSwitch.vue
-->
<template>
  <div class="scene-switch">
    <img :src="`/static/images/mode-ico/${label}@2x.png`" />
    <div @click="changeNightMode">
      <span>{{ `${label}模式` }}</span>
      <img src="/static/images/mode-ico/switch-ico@2x.png" />
    </div>
    <div @click="changeCameraMode">
      <span>{{ cameraLabel }}</span>
      <img src="/static/images/mode-ico/camera-ico@2x.png" />
    </div>
  </div>
</template>

<script>
const RATE = 30;
import { mapGetters, mapActions } from "vuex";
import { CenterPoint, LeftPoint, RightPoint } from "mock/overview.js";
export default {
  name: "sceneSwitch",
  data() {
    return {
      toRight: true,
      CenterPoint,
      LeftPoint,
      RightPoint,
      cameraTimer: undefined,
      heading: 0,
    };
  },
  computed: {
    ...mapGetters("map", ["nightMode", "cameraMode", "forceTime"]),
    label() {
      return this.nightMode ? "夜晚" : "白天";
    },
    cameraLabel() {
      return this.cameraMode ? "停止转动" : "开始转动";
    },
  },
  watch: {
    nightMode(n) {
      this.$bus.$emit("cesium-3d-switch", { value: n });
    },
    cameraMode(n) {
      this.doCameraAction(n);
    },
  },
  methods: {
    ...mapActions("map", ["SetNightMode", "SetCameraMode"]),
    changeNightMode() {
      if (this.forceTime != "now") return;
      this.SetNightMode(!this.nightMode);
    },
    changeCameraMode() {
      if (this.forceTime != "now") return;
      this.SetCameraMode(!this.cameraMode);
    },
    doCameraAction(n) {
      const that = this;
      //  视角跳转 需1000ms
      this.cameraMove(this.CenterPoint);
      //  相机转动 1500ms后执行
      // setTimeout(() => {
        if (n) {
          that.cameraTimer = setInterval(() => {
            this.cameraMode && this.cameraFlyTo();
          }, 100); // RATE * 1000
          this.cameraFlyTo();
        } else {
          clearInterval(that.cameraTimer);
          this.heading = 0;
        }
      // }, 0);
    },
    cameraFlyTo() {
      // const toPoint = this.toRight ? this.RightPoint : this.LeftPoint;
      // window.earth.camera.flyTo({
      //   ...toPoint,
      //   duration: RATE * 1.2,
      //   maximumHeight: 450,
      // });
      // this.toRight = !this.toRight;
      const center = Cesium.Cartesian3.fromDegrees(
        120.6954269687849,
        27.99677579868321,
        36.12973
      );
      console.log(this.heading.toFixed(0));
      this.heading.toFixed(0) == 50
        ? (this.toRight = true)
        : this.heading.toFixed(0) == -50
        ? (this.toRight = false)
        : undefined;
      this.heading = this.toRight
        ? (this.heading -= 0.1)
        : (this.heading += 0.1);
      const heading = Cesium.Math.toRadians(this.heading);
      const pitch = Cesium.Math.toRadians(-29.2);
      const range = 2217.0;
      window.earth.camera.lookAt(
        center,
        new Cesium.HeadingPitchRange(heading, pitch, range)
      );
      window.earth.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    },
    cameraMove(Point) {
      window.earth.camera.flyTo({
        ...Point,
        duration: 1,
      });
    },
  },
};
</script>

<style scoped lang="less">
.scene-switch {
  position: absolute;
  width: 40vh;
  height: auto;
  top: 0;
  left: 14vh;
  cursor: pointer;
  > * {
    vertical-align: middle;
  }

  > img {
    display: inline-block;
    height: 4vh;
  }
  > div {
    display: inline-block;
    > * {
      vertical-align: middle;
    }
    > img {
      height: 2.2vh;
    }
    > span {
      color: #ffffff;
      font-size: 1.6vh;
    }
  }
}
</style>
