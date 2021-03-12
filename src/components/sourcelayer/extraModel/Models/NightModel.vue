<!--
 * @Author: eds
 * @Date: 2020-08-20 09:03:10
 * @LastEditTime: 2020-09-11 17:27:50
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wz-city-culture-tour\src\components\sourcelayer\extraModel\NightModel.vue
-->
<template>
  <div class="nightModel"></div>
</template>

<script>
import { ServiceUrl } from "config/server/mapConfig";
import {
  mapImageLayerInit,
  mapBaimoLayerInit,
  mapRoadLampLayerTurn,
  changeSkyBox,
} from "components/sourcelayer/cesium_map_init";
const LAYERS = ServiceUrl.WZBaimo_OBJ;
export default {
  name: "nightModel",
  async mounted() {
    await this.initScene();
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.resetNightModel();
  },
  methods: {
    //  事件绑定
    eventRegsiter() {},
    //  初始化BIM场景
    async initScene() {
      window.earth.scene.bloomEffect.show = true;
      this.initImageLayer();
      changeSkyBox("night");
      await this.initS3MModel();
      //  路灯、光源叠加
      //   mapRoadLampLayerTurn(true);
    },
    //  开启精模
    async initS3MModel() {
      const _LAYER_ = window.earth.scene.layers.find(LAYERS[0].KEY);
      if (_LAYER_) {
        LAYERS.map(({ KEY }) => {
          window.earth.scene.layers.find(KEY).visible = true;
        });
      } else {
        //  白模叠加
        await mapBaimoLayerInit(LAYERS);
      }
    },
    //  开启大数据底图
    initImageLayer() {
      if (window.datalayer) {
        window.datalayer.show = true;
      } else {
        window.datalayer = mapImageLayerInit(ServiceUrl.DataImage);
      }
    },
    //  关闭模块
    resetNightModel() {
      LAYERS.map(({ KEY }) => {
        window.earth.scene.layers.find(KEY).visible = false;
      });
      //  光源清除
      mapRoadLampLayerTurn(false);
    },
  },
};
</script>
