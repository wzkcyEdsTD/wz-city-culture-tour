<!--
 * @Author: eds
 * @Date: 2020-07-21 14:49:26
 * @LastEditTime: 2020-07-28 10:59:15
 * @LastEditors: eds
 * @Description:
 * @FilePath: \wzsjjt-bd-visual\src\components\map-view\basicTools\VisualizationAnalyse.vue
-->
<template>
  <div class="ThreeDContainer" :style="{width:'400px'}">
    <div class="visualizationanalyse tframe">
      <el-form label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="可视域分析" class="elformbtns">
              <el-button class="elformbtn" @click="startVisualize">开始</el-button>
              <el-button class="elformbtn" @click="clearVisualize">清除</el-button>
              <el-button class="elformbtn" @click="closeVisualize">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
const Cesium = window.Cesium;
const viewModel = {
  direction: 1.0,
  pitch: 1.0,
  distance: 1.0,
  verticalFov: 1.0,
  horizontalFov: 1.0,
  visibleAreaColor: "#ffffffff",
  invisibleAreaColor: "#ffffffff",
};
export default {
  name: "VisualizationAnalyse",
  data: {
    pointHandler: undefined,
    handler: undefined,
    viewshed3D: undefined,
    viewPosition: undefined,
    viewer: undefined,
  },
  created() {
    this.viewer = window.earth;
    this.pointHandler = new Cesium.DrawHandler(
      this.viewer,
      Cesium.DrawMode.Point
    );
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.viewshed3D = new Cesium.ViewShed3D(this.viewer.scene);
  },
  mounted() {
    this.eventRegsiter();
  },
  beforeDestroy() {
    this.pointHandler = undefined;
    this.handler.destroy()
    this.viewshed3D && this.viewshed3D.destroy();
    this.viewPosition = undefined;
    this.viewer = undefined;
    this.clearVisualize();
    1;
  },
  methods: {
    //  事件绑定
    eventRegsiter() {
      const that = this;
      that.handler.setInputAction(function (e) {
        if (!that.viewPosition) return;
        // 若此标记为false，则激活对可视域分析对象的操作
        if (!that.viewer.scene.viewFlag) {
          //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
          const position = e.endPosition;
          const last = that.viewer.scene.pickPosition(position);
          //计算该点与视口位置点坐标的距离
          const distance = Cesium.Cartesian3.distance(that.viewPosition, last);
          if (distance > 0) {
            // 将鼠标当前点坐标转化成经纬度
            const cartographic = Cesium.Cartographic.fromCartesian(last);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            const height = cartographic.height;
            // 通过该点设置可视域分析对象的距离及方向
            that.viewshed3D.setDistDirByPoint([longitude, latitude, height]);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      that.handler.setInputAction(function (e) {
        //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
        that.viewer.scene.viewFlag = true;
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      that.pointHandler.drawEvt.addEventListener(function (result) {
        const point = result.object;
        const position = point.position;
        that.viewPosition = position;

        // 将获取的点的位置转化成经纬度
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
        const height = cartographic.height + 1.8;
        point.position = Cesium.Cartesian3.fromDegrees(
          longitude,
          latitude,
          height
        );
        if (that.viewer.scene.viewFlag) {
          // 设置视口位置
          that.viewshed3D.viewPosition = [longitude, latitude, height];
          that.viewshed3D.build();
          // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
          that.viewer.scene.viewFlag = false;
        }
      });
    },
    //  可视域分析
    startVisualize() {
      if (this.pointHandler.active) return;
      //先清除之前的可视域分析
      this.viewer.entities.removeAll();
      this.viewshed3D.distance = 0.1;
      this.viewer.scene.viewFlag = true;
      //激活绘制点类
      this.pointHandler.activate();
    },
    //  关闭可视域分析
    closeVisualize() {
      this.clearVisualize();
      this.viewshed3D && this.viewshed3D.destroy();
      this.$bus.$emit("cesium-3d-maptool", { value: null });
    },
    //  清除分析结果
    clearVisualize() {
      this.viewer && this.viewer.entities.removeAll();
      this.viewshed3D && (this.viewshed3D.distance = 0.1);
      this.viewer && (this.viewer.scene.viewFlag = true);
    },
  },
};
</script>
