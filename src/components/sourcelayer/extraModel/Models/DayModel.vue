<!--
 * @Author: eds
 * @Date: 2020-08-20 09:03:10
 * @LastEditTime: 2020-09-11 17:27:50
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\extraModel\DayModel.vue
-->
<template>
  <div class="day-model"></div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import {
  mapImageLayerInit,
  mapRiverLayerInit,
  changeSkyBox,
} from "components/sourcelayer/mapInit/cesium_map_init";
const LAYERS = ServiceUrl.SCENE_WZMODEL;
export default {
  name: "dayModel",
  async mounted() {
    await this.initScene();
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.resetDayModel();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {},
    //  初始化BIM场景
    async initScene() {
      window.earth.scene.bloomEffect.show = false;
      this.initImageLayer();
      changeSkyBox("day");
      // this.initS3MModel();
      // await this.initRiver();
    },
    //  开启精模
    initS3MModel() {
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
              // v.s && (V_LAYER.shadowType = 2);
              V_LAYER.visibleDistanceMax = v.d || 1400;
              // V_LAYER.lodRangeScale = 0.01;
            });
          }
        );
      }
    },
    //  开启影像底图
    initImageLayer() {
      if (window.imagelayer) {
        window.imagelayer.show = true;
      } else {
        window.imagelayer = mapImageLayerInit(ServiceUrl.SWImage);
      }
    },
    //  开启河流
    async initRiver() {
      //  河流显示
      if (window.earth.scene.layers.find("RIVER")) {
        window.earth.scene.layers.find("RIVER").visible = true;
      } else {
        await mapRiverLayerInit("RIVER", ServiceUrl.STATIC_RIVER);
      }
    },
    //  关闭模块
    resetDayModel() {
      //  关闭精模
      // LAYERS.map((v) => {
      //   const V_LAYER = window.earth.scene.layers.find(v.key);
      //   V_LAYER.visible = false;
      // });
      //  关闭影像图
      window.imagelayer.show = false;
      //  关闭河流
      window.earth.scene.layers.find("RIVER") &&
        (window.earth.scene.layers.find("RIVER").visible = false);
    },
  },
};
</script>
