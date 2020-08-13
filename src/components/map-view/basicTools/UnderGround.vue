<!--
 * @Author: eds
 * @Date: 2020-07-28 15:58:33
 * @LastEditTime: 2020-08-06 15:13:13
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\UnderGround.vue
-->
<template>
  <div class="ThreeDContainer ThreeToTop" :style="{width:'200px'}">
    <div class="underground tframe">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item class="elformbtns">
              <el-button class="elformbtn" @click="digUnderGround">倾斜开挖</el-button>
              <el-button class="elformbtn" @click="closeUnderGround">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { BimSourceURL } from "config/server/mapConfig";
const Cesium = window.Cesium;
const LAYER_NAME = [
  "ResultNetWork_JSGX@guanxian#1",
  "ResultNetWork_JSGX_Node@guanxian#1",
];

export default {
  name: "UnderGround",
  data() {
    return {
      // cesium Object
      viewer: undefined,
      handlerPolygon: undefined,
    };
  },
  created() {
    this.viewer = window.earth;
    this.handlerPolygon = new Cesium.DrawHandler(
      this.viewer,
      Cesium.DrawMode.Polygon
    );
  },
  async mounted() {
    this.initBimScene();
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.clearUnderGround();
    this.handlerPolygon.destroy();
    this.viewer = undefined;
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      that.handlerPolygon.activeEvt.addEventListener(function (isActive) {
        if (isActive == true) {
          that.viewer.enableCursorStyle = false;
          that.viewer._element.style.cursor = "";
        } else {
          that.viewer.enableCursorStyle = true;
        }
      });
      that.handlerPolygon.movingEvt.addEventListener(function (
        windowPosition
      ) {});
      that.handlerPolygon.drawEvt.addEventListener(function (result) {
        that.handlerPolygon.polygon.show = false;
        that.handlerPolygon.polyline.show = false;
        const polygon = result.object;
        const positions = polygon.positions;
        const flatPoints = [];
        for (var i = 0, j = positions.length; i < j; i++) {
          //获取经纬度和高度
          var position = positions[i];
          var cartographic = Cesium.Cartographic.fromCartesian(position);
          var lon = Cesium.Math.toDegrees(cartographic.longitude);
          var lat = Cesium.Math.toDegrees(cartographic.latitude);
          var height = cartographic.height;
          flatPoints.push(lon);
          flatPoints.push(lat);
          flatPoints.push(height);
        }
        overGroundLayer.addExcavationRegion({
          //设置倾斜开挖参数
          position: flatPoints,
          name: "excavation_" + Math.random(),
        });
        that.handlerPolygon.deactivate();
      });
      that.handlerPolygon.activate();
    },
    //  相机移动
    cameraMove() {
      window.earth.scene.camera.setView({
        // 将经度、纬度、高度的坐标转换为笛卡尔坐标
        destination: {
          x: -2875652.7880414873,
          y: 4843023.435651329,
          z: 2993391.653376218,
        },
        orientation: {
          heading: 0,
          pitch: -0.5655775824490981,
          roll: 0,
        },
      });
    },
    //  初始化BIM场景
    initBimScene(fn) {
      this.viewer.scene.undergroundMode = true;
      const _LAYER_ = this.viewer.scene.layers.find(LAYER_NAME[0]);
      if (_LAYER_) {
        LAYER_NAME.map(
          (d) => (this.viewer.scene.layers.find(d).visible = true)
        );
      } else {
        const { UNDERGROUND_SCENE_URL } = BimSourceURL;
        const promise = this.viewer.scene.open(UNDERGROUND_SCENE_URL);
        Cesium.when(promise, async (layers) => {
          const layer = this.viewer.scene.layers.find(LAYER_NAME);
        });
      }
    },
    //  倾斜开挖
    digUnderGround() {},
    //  关闭BIM分析模块
    closeUnderGround() {
      this.clearUnderGround();
      this.$bus.$emit("cesium-3d-event", { value: null });
    },
    //  清除BIM模块
    clearUnderGround() {
      LAYER_NAME.map((d) => (this.viewer.scene.layers.find(d).visible = false));
    },
  },
};
</script>
