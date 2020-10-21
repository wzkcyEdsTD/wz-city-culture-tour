<template>
  <div class="TrafficSubwayModel"></div>
</template>

<script>
const Cesium = window.Cesium;
import { ExtraSourceURL } from "config/server/mapConfig";
import { mapGetters, mapActions } from "vuex";
const LAYERS = [{ name: "S1", url: ExtraSourceURL.S1 }];
export default {
  name: "TrafficSubwayModel",
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
    this.cameraMove();
  },
  beforeDestroy() {
    this.closeTrafficSubwayModel();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
    },
    //  初始化BIM场景
    initBimScene(fn) {
      const _LAYER_ = window.earth.scene.layers.find(LAYERS[0].name);
      if (_LAYER_) {
        LAYERS.map((v) => {
          const V_LAYER = window.earth.scene.layers.find(v.name);
          V_LAYER.visible = true;
        });
      } else {
        const PROMISES = LAYERS.map((v) => {
          return window.earth.scene.addS3MTilesLayerByScp(v.url, {
            name: v.name,
          });
        });
      }
    },
    //  相机移动
    cameraMove() {
      window.earth.camera.flyTo({
        destination: {
          x: -2876240.8556349813,
          y: 4844823.855379582,
          z: 2991618.648799055,
        },
        orientation: {
          heading: 6.274388551340762,
          pitch: -0.5191263959623971,
          roll: 0,
        },
      });
    },
    //  关闭交通S1模块
    closeTrafficSubwayModel() {
      this.clearTrafficSubwayModel();
      this.$bus.$emit("cesium-3d-hub-event", { value: null });
    },
    //  清除BIM模块
    clearTrafficSubwayModel() {
      LAYERS.map((v) => {
        const V_LAYER = window.earth.scene.layers.find(v.name);
        V_LAYER.visible = false;
      });
    },
  },
};
</script>