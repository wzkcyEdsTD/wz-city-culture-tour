<template>
  <div class="clear-layer" @click="doClearLayer">
    <img src="static/images/layer-ico/clear.png" />
    <span>清除图层</span>
  </div>
</template>

<script>
export default {
  name: "ClearLayer",
  methods: {
    doClearLayer() {
      this.$bus.$emit("check-clear-topic");
      this.$bus.$emit("cesium-3d-detail-pop-clear");
      this.$bus.$emit("cesium-3d-event-pop-clear");
      this.$bus.$emit("cesium-3d-searchAddress-clear");
    },
  },
};
</script>

<style lang="less" scoped>
.clear-layer {
  position: fixed;
  right: 2vh;
  bottom: 2vh;
  height: 6vh;
  width: 15vh;
  line-height: 6vh;
  background-image: url(/static/images/layer-ico/clear-bg.png);
  background-size: 100% 100%;
  text-align: center;
  cursor: pointer;

  > * {
    display: inline-block;
    height: 3.6vh;
    line-height: 3.6vh;
    vertical-align: middle;
  }
  > span {
    font-size: 1.7vh;
    letter-spacing: 2px;
    // color: rgba(255, 255, 255, 0.5);
    color: #fff;
    transition: all 0.2s;
    &:hover {
      color: rgba(255, 255, 255, 0.9);
    }
  }
}
</style>
