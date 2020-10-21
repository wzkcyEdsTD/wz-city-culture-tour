<template>
  <div class="page-map">
    <div class="cesium-map" v-if="currentMapType == 'cesiumMap'">
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
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Medical",
  data() {
    return {
      mapTollBar: {}, // 地图按钮操作
      currentBaseMapType: "",
    };
  },
  computed: {
    ...mapGetters("map", ["currentMapType"]),
  },
  mounted() {
    window.onresize = () => {
      this.timer && (this.timer = false);
    };
    this.eventRegsiter();
  },
  methods: {
    eventRegsiter() {
      //  事件传递
      this.$bus.$off("source-message");
      this.$bus.$on("source-message", async ({ layer }) => {
        this.$nextTick(() => {
          this.$bus.$emit("check-hub", {
            key: layer.sourceName,
          });
          this.$bus.$emit("cesium-3d-video-circle", {
            geometry: {
              lng: layer.geometry[0],
              lat: layer.geometry[1],
            },
            queryRadius: layer.radius,
          });
        });
      });
    },
    // 点击地图按钮的操作传值给地图
    setMapTollBar(obj) {
      this.mapTollBar = obj;
    },
  },
  components: {
    CesiumMap,
  },
  watch: {},
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
    // position: absolute;
    height: 100%;
    width: 100%;
    // background-color: #204f77;
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
    width: 18vw;
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
    width: 20vw;
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
