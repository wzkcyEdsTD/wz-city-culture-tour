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
const LOOT = 30;
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
      //  视角跳转 需1000ms
      this.cameraMove(this.CenterPoint);
      //  相机转动 1500ms后执行
      setTimeout(
        () => {
          if (n) {
            window.cameraTimer = setInterval(() => {
              this.cameraFlyTo();
            }, LOOT * 1000);
            this.cameraFlyTo();
          } else {
            clearInterval(window.cameraTimer);
          }
        },
        n ? 1500 : 0
      );
    },
    cameraFlyTo() {
      const toPoint = this.toRight ? this.RightPoint : this.LeftPoint;
      window.earth.camera.flyTo({
        ...toPoint,
        duration: LOOT * 1.2,
        maximumHeight: 450,
      });
      this.toRight = !this.toRight;
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
  width: 220px;
  height: auto;
  top: 0;
  left: 130px;
  cursor: pointer;
  > * {
    vertical-align: middle;
  }

  > img {
    display: inline-block;
    width: 34px;
    height: 34px;
  }
  > div {
    display: inline-block;
    > * {
      vertical-align: middle;
    }
    > img {
      // width: 20px;
      height: 20px;
    }
    > span {
      letter-spacing: 0px;
      color: #ffffff;
      font-size: 0.9em;
      font-family: PingFang SC;
    }
  }
}
</style>
