<template>
  <div class="get-geohash-by-geometry">
    <span class="header">区域绘制</span>
    <div class="form-content">
      <el-button size="small" @click="doDrawPolygon">绘制</el-button>
      <el-button
        size="small"
        class="form-content-finish"
        :loading="isLoading"
        @click="doWithArea"
        >完成</el-button
      >
    </div>
  </div>
</template>

<script>
let handlerPolygon = undefined;
export default {
  name: "getGeohashByGeometry",
  data() {
    return {};
  },
  props: ["BUS_EVENT_TAG", "isLoading"],
  created() {
    this.initHandlerPolygon();
  },
  beforeDestroy() {
    this.destroyHandlerPolygon();
  },
  methods: {
    initHandlerPolygon() {
      handlerPolygon = new Cesium.DrawHandler(
        window.earth,
        Cesium.DrawMode.Polygon
      );
      handlerPolygon.activeEvt.addEventListener((isActive) => {});
      handlerPolygon.movingEvt.addEventListener((windowPosition) => {});
      handlerPolygon.drawEvt.addEventListener((result) => {
        handlerPolygon.polygon.show = false;
        // handlerPolygon.polyline.show = false;
        var positions = result.object.positions;
        var ranges = [];
        for (let i = 0; i < positions.length; i++) {
          var position = positions[i];
          var cartographic = Cesium.Cartographic.fromCartesian(position);
          ranges.push([
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude),
          ]);
        }
        // this.doWithArea(ranges);
      });
    },
    doDrawPolygon() {
      handlerPolygon.clear();
      handlerPolygon.activate();
    },
    doWithArea(ranges) {
      this.$bus.$emit(this.BUS_EVENT_TAG, ranges);
    },
    destroyHandlerPolygon() {
      handlerPolygon.clear();
      // handlerPolygon.destroy();
    },
  },
};
</script>

<style lang="less" scoped>
.get-geohash-by-geometry {
  margin-bottom: 1.5vh;
  .header {
    display: block;
    height: 4vh;
    line-height: 4vh;
    font-family: YouSheBiaoTiHei;
    font-size: 3.2vh;
    color: #ffffff;
    text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.64);
    position: relative;
    padding-left: 1.6vh;
    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0.6vh;
      width: 14vh;
      height: 1.6vh;
      z-index: -1;
      background-image: linear-gradient(90deg, #2acbfe 0%, transparent 100%);
      transform: skewX(-30deg);
    }
  }
  .form-content {
    margin-top: 1vh;
    &/deep/ .el-button {
      background: transparent;
      color: white;
    }
    &/deep/.form-content-finish {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }
}
</style>
