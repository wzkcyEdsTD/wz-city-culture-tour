<!--
 * @Author: eds
 * @Date: 2020-08-20 09:03:10
 * @LastEditTime: 2020-09-11 17:27:50
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\extraModel\DetailedModel.vue
-->
<template>
  <div class="nanTangModel"></div>
</template>

<script>
const Cesium = window.Cesium;
import { ServiceUrl } from "config/server/mapConfig";
import { mapGetters, mapActions } from "vuex";
const LAYERS = ServiceUrl.SCENE_WZMODEL;
export default {
  data() {
    return {
      //  cesium Object
    };
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
  },
  beforeDestroy() {
    window.earth.scene.bloomEffect.show = true;
    this.closeNanTangModel();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      this.$bus.$emit("cesium-3d-switch", { value: false });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      window.earth.scene.bloomEffect.show = false;
      const _LAYER_ = window.earth.scene.layers.find(LAYERS[0].key);
      if (_LAYER_) {
        LAYERS.map((v) => {
          const V_LAYER = window.earth.scene.layers.find(v.key);
          V_LAYER.visible = true;
        });
      } else {
        const PROMISES = LAYERS.map((v) => {
          return window.earth.scene.addS3MTilesLayerByScp(v.url, {
            name: v.key,
          });
        });
        Cesium.when(
          PROMISES[PROMISES.length - 1],
          async ([forceLayer, ...oLayer]) => {
            LAYERS.map((v) => {
              const V_LAYER = window.earth.scene.layers.find(v.key);
              V_LAYER.visibleDistanceMax = v.d || 1400;
              V_LAYER.lodRangeScale = 0.01;
            });
          }
        );
      }
    },
    //  关闭BIM分析模块
    closeNanTangModel() {
      this.clearNanTangModel();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearNanTangModel() {
      LAYERS.map((v) => {
        const V_LAYER = window.earth.scene.layers.find(v.key);
        V_LAYER.visible = false;
      });
    },
  },
};
</script>
