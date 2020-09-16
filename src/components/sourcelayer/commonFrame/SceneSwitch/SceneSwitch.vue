<!--
 * @Author: eds
 * @Date: 2020-09-15 11:04:57
 * @LastEditTime: 2020-09-15 11:05:13
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\commonFrame\SceneSwitch\SceneSwitch.vue
-->
<template>
  <div class="scene-switch" @click="nightMode=!nightMode">
    <img :src="`/static/images/mode-ico/${label}@2x.png`" />
    <span>{{`${label}模式`}}</span>
    <img src="/static/images/mode-ico/转换ico@2x.png" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      nightMode: true,
    };
  },
  computed: {
    label() {
      return this.nightMode ? "夜晚" : "白天";
    },
  },
  watch: {
    nightMode(n) {
      this.$bus.$emit("cesium-3d-switch", { value: n });
    },
  },
};
</script>

<style scoped lang="less">
.scene-switch {
  position: absolute;
  top: 0;
  right: -6vh;
  cursor: pointer;
  > * {
    vertical-align: middle;
  }
  > img {
    &:first-child {
      width: 34px;
      height: 34px;
    }
    &:last-child {
      width: 20px;
      height: 20px;
    }
  }
  > span {
    letter-spacing: 0px;
    color: #ffffff;
    font-size: 0.9em;
    font-family: PingFang SC;
  }
}
</style>
