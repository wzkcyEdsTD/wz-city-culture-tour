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
} from "components/sourcelayer/mapInit/cesium_map_init";
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
      // mapRoadLampLayerTurn(true);
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
      // var promise = window.earth.scene.open(
      //   "http://www.supermapol.com/realspace/services/3D-Histogram/rest/realspace"
      // );
      // Cesium.when.all(
      //   promise,
      //   function (layers) {
      //     window.earth.scene.camera.setView({
      //       destination: new Cesium.Cartesian3.fromDegrees(145.0214, -37.8148, 2420),
      //       orientation: {
      //         heading: 4.707156513009547,
      //         pitch: -0.41235417870811397,
      //         roll: 0.0035480416143034432,
      //       },
      //     });
      //   },
      //   function () {
      //     var title = "加载SCP失败，请检查网络连接状态或者url地址是否正确？";
      //     widget.showErrorPanel(title, undefined, e);
      //   }
      // );
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
