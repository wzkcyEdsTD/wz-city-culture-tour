<template>
  <div class="page-map">
    <traffic-header />
    <div class="cesium-map">
      <cesium-map ref="cesiumMap" />
    </div>
    <div class="mask-wrapper">
      <div class="left"></div>
      <div class="right"></div>
      <div class="bottom"></div>
    </div>
  </div>
</template>
<script>
import CesiumMap from "components/trafficlayer/cesium_map";
import TrafficHeader from "./trafficHeader";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "trafficlayer",
  mounted() {
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {},
  },
  components: {
    CesiumMap,
    TrafficHeader,
  },
};
</script>
<style scoped lang="less">
.page-map {
  .map {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    .cover-map {
      width: 100%;
      height: 100%;
    }
  }
  .cesium-map {
    height: 100%;
    width: 100%;
  }
  .box {
    z-index: 2;
  }
  .tree {
    overflow: auto;
  }
}

.mask-wrapper {
  position: relative;
  .left {
    position: fixed;
    top: 0;
    left: 0;
    width: 36vh;
    height: 100%;
    background-image: linear-gradient(
      90deg,
      rgba(0, 13, 26, 0.84) 0%,
      rgba(0, 17, 34, 0.55) 70%,
      rgba(0, 19, 38, 0) 100%
    );
  }
  .right {
    position: fixed;
    top: 0;
    right: 0;
    width: 50vh;
    height: 100%;
    background-image: linear-gradient(
      270deg,
      rgba(0, 13, 26, 0.84) 0%,
      rgba(0, 17, 34, 0.55) 70%,
      rgba(0, 19, 38, 0) 100%
    );
  }
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 14vh;
    background-image: linear-gradient(
      0deg,
      #031d38 0%,
      rgba(0, 29, 59, 0.64) 61%,
      rgba(3, 45, 62, 0) 100%
    );
  }
}
</style>
