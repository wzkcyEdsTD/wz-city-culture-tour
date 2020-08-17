<!--
 * @Author: eds
 * @Date: 2020-08-12 15:17:46
 * @LastEditTime: 2020-08-17 11:07:13
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\map-view\extraModel\NanTangModel.vue
-->
<template>
  <div class="nanTangModel"></div>
</template>

<script>
const Cesium = window.Cesium;
import { mapGetters, mapActions } from "vuex";
const SERVER_HOST = "http://10.36.217.240:8098/iserver/services";
const LAYER_NAME = "南塘精细三维";
export default {
  data() {
    return {
      //  cesium Object
      viewer: undefined,
    };
  },
  created() {
    this.viewer = window.earth;
  },
  async mounted() {
    this.initBimScene();
    this.addEntities();
    this.eventRegsiter();
    this.cameraMove();
    this.SetIsInfoFrame(true);
  },
  beforeDestroy() {
    this.viewer.entities.removeAll();
    this.SetIsInfoFrame(false);
    this.$bus.$emit("cesium-3d-switch", { value: true });
    this.closeNanTangModel();
    this.viewer = undefined;
  },
  methods: {
    ...mapActions("map", ["SetIsInfoFrame"]),
    //  事件绑定
    eventRegsiter() {
      const that = this;
      this.$bus.$emit("cesium-3d-switch", { value: false });
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
    initBimScene(fn) {
      const _LAYER_ = this.viewer.scene.layers.find(LAYER_NAME);
      if (_LAYER_) {
        _LAYER_.visible = true;
      } else {
        const promise = this.viewer.scene.addS3MTilesLayerByScp(
          // `${SERVER_HOST}/3D-mongodb-JMLCDNJD/rest/realspace/datas/JM_LCDNJD/config`,
          "http://10.36.217.240:8098/iserver/services/3D-mongodb/rest/realspace/datas/JM_LC_2012_1/config",
          { name: LAYER_NAME }
        );
        Cesium.when(promise, async (layers) => {
          const layer = this.viewer.scene.layers.find(LAYER_NAME);
          layer.visibleDistanceMax = 1500;
        });
      }
    },
    addEntities() {
      //  监控点
      this.addEntity(
        [120.66728999999999, 27.998789999999999],
        "/static/images/video.png",
        "video"
      );
      //  vr全景
      this.addEntity(
        [120.66468464400009, 27.99854437800019],
        "/static/images/VR.png",
        "vr"
      );
      //  流量点
      this.addEntity([120.661, 27.999], "/static/images/people.png", "people");
    },
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
    closeNanTangModel() {
      this.clearNanTangModel();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearNanTangModel() {
      this.viewer.scene.layers.find(LAYER_NAME).visible = false;
    },
  },
};
</script>

<style>
</style>
